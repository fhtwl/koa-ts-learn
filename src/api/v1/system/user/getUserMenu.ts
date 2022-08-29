import { Models } from '../../../../common/typings/model'
import KoaRouter from 'koa-router'
import { command } from '../../../../server/mysql'
import { Success } from '../../../../core/HttpException'
import verifyToken from '../../../../middlewares/verifyToken'
import { getTreeByList, sort } from '../../../../common/utils/utils'
import Config from '../../../../config/Config'
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

  // 存放当前用户的角色和祖宗角色
  const roleList: System.Role[] = []
  // 过滤, 获取当前角色及当前角色的祖先角色的所有记录
  const each = (list: System.Role[], nodeId: number) => {
    const arr = list.filter((item) => item.id === nodeId)
    if (arr.length) {
      roleList.push(...arr)
      each(list, arr[0].parentId)
    }
  }
  // 将用户的角色ids转换为数组
  const roleIdList: number[] = roleIds.split(',').map((str: string) => Number(str))
  roleIdList.forEach((roleId) => {
    each(roleRes, roleId)
  })

  // 当前角色的角色树
  const roleTree = getTreeByList(roleList as unknown as Common.List, 0) as unknown as System.Role[]
  // 当前角色有权限的所有菜单.
  let menuList: number[] = []
  const merge = (list: System.Role[]) => {
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
          menu.component_path,
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
  const sortEach = (arr: System.Menu[]) => {
    sort(arr, 'serialNum', 'desc')
    arr.forEach((item) => {
      if (item.children) {
        sortEach(item.children)
      }
    })
  }
  // 根据serialNum排序
  sortEach(res.results)
  // 构建前端需要的menu树
  const list = (res.results as System.Menu[]).map(
    ({
      name,
      parentId,
      id,
      icon,
      title,
      show,
      component,
      componentPath,
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
        componentPath,
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
