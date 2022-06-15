import Config from '../../config/Config'
import JWT from 'jsonwebtoken'
import { command } from '../mysql'
import { Models } from '../../common/typings/model'
import { selectDb } from '../redis'
import { getTreeByList } from '../../common/utils/utils'
import redis from '../redis/redis'

/**
 * 构建token
 * @param uid
 * @param scope
 * @returns
 */
export function generateToken(uid: System.Uid, scope: System.Scope) {
  //传入id和权限
  const secretKey = Config.SECURITY.SECRET_KEY
  const expiresIn = Config.SECURITY.EXPIRES_IN
  const token = JWT.sign(
    {
      uid,
      scope,
    },
    secretKey,
    {
      expiresIn,
    }
  )
  return token
}

/**
 * 获取用户权限
 * @param decode
 * @returns
 */
export function getUserPermission(decode: System.Decode): Promise<System.Menu[]> {
  const { scope } = decode
  return new Promise(async (resolve, reject) => {
    let res: Models.Result

    try {
      res = await command(`
          SELECT
            menu_ids
          FROM
            system_role
          where
            id = ${scope}
      `)
      if (!res.error) {
        const role = res.results[0]
        if (role) {
          const menuList: System.Menu[] = (
            await command(`
              SELECT
                permission
              FROM
                system_menu
              WHERE
                FIND_IN_SET(
                id,
                '${role.menuIds}')
            `)
          ).results
          resolve(menuList)
        } else {
          resolve([])
        }
      } else {
        reject()
      }
    } catch (error) {
      console.log(error)
      reject()
    }
  })
}

/**
 * 校验用户权限
 * @param decode
 * @returns
 */
export function getRedisUserPermission(decode: System.Decode): Promise<string[]> {
  const { scope } = decode
  return new Promise(async (resolve) => {
    selectDb(Config.REDIS_DB_NAME.ROLE).then(() => {
      redis.keys('*').then(async (res) => {
        Promise.all(res.map((item) => redis.hgetall(item))).then((result) => {
          const allRoleList: Common.List = result.map((item) => {
            return {
              ...item,
              id: Number(item.id),
              parentId: Number(item.parentId),
            }
          })
          const roleTree = getTreeByList(allRoleList, 0)
          // 过滤, 获取当前角色及当前角色的祖先角色的所有记录
          const roleList: Common.TreeNode[] = []
          const each = (list: Common.TreeNode[], nodeId: number) => {
            const arr = list.filter((item) => item.id === nodeId)
            if (arr.length) {
              roleList.push(...arr)
              each(list, arr[0].parentId)
            }
          }
          const roleIds = scope.split(',')
          roleIds.forEach((roleId) => {
            each(roleTree, Number(roleId))
          })

          // 当前角色有权限的所有权限.
          let permissionList: string[] = []
          const merge = (list: Common.TreeNode[]) => {
            list.forEach((item) => {
              permissionList = [...new Set([...permissionList, ...(item.permissions as string).split(',')])]
              if (item.children) {
                merge(item.children)
              }
            })
          }
          // 合并当前角色和当前角色的祖先角色的所有菜单
          merge(roleTree)
          resolve(permissionList)
        })
      })
    })
  })
}

/**
 * 获取所有角色的权限列表
 * @returns
 */
export function getAllRolePermission(): Promise<System.Role[]> {
  return new Promise(async (resolve, reject) => {
    let res: Models.Result
    try {
      res = await command(`
          SELECT
            id,
            menu_ids,
            parent_id parentId,
            name
          FROM
            system_role
      `)
      if (!res.error) {
        const RoleList: System.Role[] = []
        for (let i = 0; i < res.results.length; i++) {
          const item: System.Role = res.results[i]
          RoleList.push({
            id: item.id,
            parentId: item.parentId,
            name: item.name,
            menuList: await getUserPermission({
              scope: String(item.id),
              uid: 0,
            }),
            children: [],
            menuIds: item.menuIds,
          })
        }
        resolve(RoleList)
      } else {
        reject()
      }
    } catch (error) {
      console.log(error)
      reject()
    }
  })
}

/**
 * 更新redis里的角色
 */
export function updateRedisRole() {
  getAllRolePermission().then((list) => {
    list.forEach((res) => {
      if (res.menuList.length > 0) {
        updateRoles(
          (res.id || '').toString(),
          new Map([
            ['id', res.id.toString()],
            ['parentId', res.parentId.toString()],
            ['permissions', res.menuList.map((item: { permission: string }) => item.permission).join(',')],
          ])
        )
      }
    })
  })
}

/**
 * 更新权限
 * @param roleId
 * @param obj
 * @returns
 */
export function updateRoles(roleId: string, obj: Map<string, string>): Promise<Models.Result> {
  return new Promise((resolve) => {
    selectDb(Config.REDIS_DB_NAME.ROLE).then(async () => {
      await redis.del(roleId)
      redis.hmset(roleId, obj).then((res) => {
        const result: Models.Result = {
          msg: 'ok',
          state: 1,
          results: res,
          fields: [],
        }
        resolve(result)
      })
    })
  })
}
