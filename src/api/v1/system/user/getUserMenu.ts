import { Models } from '../../../../common/typings/model'
import KoaRouter from 'koa-router'
import { command } from '../../../../server/mysql'
import { Success } from '../../../../core/HttpException'
import verifyToken from '../../../../middlewares/verifyToken'
import { getTreeByList, sort } from '../../../../common/utils/utils'
import { Account } from '../../../../common/typings/account'
import Config from '../../../../config/Config'
import { Menu } from '../../../../common/typings/menu'
const router = new KoaRouter({
  prefix: `${Config.API_PREFIX}v1/system/user`,
})

/**
 * 获取当前用户的菜单
 */
router.post('/getUserMenu', verifyToken, async (ctx: Models.Ctx) => {
  const { scope: roleIds } = ctx.auth
  // 所有的角色
  const roleRes = (
    await command(`
      SELECT
        *
      FROM
        system_role
    `)
  ).results

  // 过滤, 获取当前角色及当前角色的祖先角色的所有记录
  const roleList: Account.Role[] = []
  const each = (list: Account.Role[], nodeId: number) => {
    const arr = list.filter((item) => item.id === nodeId)
    if (arr.length) {
      roleList.push(...arr)
      each(list, arr[0].parentId)
    }
  }
  const roleIdList: number[] = roleIds.split(',').map((str: string) => Number(str))
  roleIdList.forEach((roleId) => {
    each(roleRes, roleId)
  })

  // 当前角色的角色树
  const roleTree = getTreeByList(roleList, 0) as unknown as Account.Role[]
  // 当前角色有权限的所有菜单.
  let menuList: number[] = []
  const merge = (list: Account.Role[]) => {
    list.forEach((item) => {
      menuList = [...new Set([...menuList, ...item.menuIds.split(',').map((str) => Number(str))])]
      if (item.children) {
        merge(item.children)
      }
    })
  }
  // 合并当前角色和当前角色的祖先角色的所有菜单
  merge(roleTree)

  // roleId 字段，角色，与权限相关
  const res = await command(`
      SELECT
          menu.id,
          menu.name title,
          menu.show,
          menu.icon,
          menu.component,
          menu.redirect,
          menu.parent_id,
          menu.path,
          menu.hide_children,
          menu.serial_num,
          menu.permission,
          menu.type
      FROM
        system_menu menu
      WHERE
          FIND_IN_SET(menu.id , '${menuList.join(',')}')
    `)
  const sortEach = (arr: Menu.Menu[]) => {
    sort(arr, 'serialNum', 'desc')
    arr.forEach((item) => {
      if (item.children) {
        sortEach(item.children)
      }
    })
  }
  sortEach(res.results)
  const list = (res.results as Menu.Menu[]).map(
    ({
      name,
      parentId,
      id,
      icon,
      title,
      show,
      component,
      redirect,
      path,
      hideChildren,
      children,
      serialNum,
      permission,
      type,
    }) => {
      const isHideChildren = Boolean(hideChildren)
      const isShow = Boolean(show)
      return {
        name,
        parentId,
        id,
        meta: {
          icon,
          title,
          show: isShow,
          hideChildren: isHideChildren,
        },
        component,
        redirect,
        path,
        children,
        serialNum,
        permission,
        type,
      }
    }
  )

  throw new Success(list)
})

export default router
