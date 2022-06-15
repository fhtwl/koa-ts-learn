import KoaRouter from 'koa-router'
import { Models } from '../../../../common/typings/model'
import { command } from '../../../../server/mysql'
import { Success } from '../../../../core/HttpException'
import Config from '../../../../config/Config'
import verifyToken from '../../../../middlewares/verifyToken'

interface MenuList extends System.User {
  roleParentId: number
  menuId: number
  roleName: string
  roleId: number
  menuName: string
  menuType: System.MenuType
  serialNum: number
  show: 0 | 1
  menuParentId: number
  menuPermission: string
}

interface Permissions {
  name: string
  roleId: number
  id: number
  menuType: System.MenuType
  show: number
  parentId: number
  serialNum: number
  permission: string
  actions: System.Action[]
}

const router = new KoaRouter({
  prefix: `${Config.API_PREFIX}v1/system/user`,
})

router.get('/query', verifyToken, async (ctx: Models.Ctx) => {
  const { uid } = ctx.auth
  // 查询获取所有的菜单(包括菜单目录和按钮)
  const AllMenulist = (
    (
      await command(`
    SELECT
        user.user_name,
        user.email,
        user.info infoStr,
        user.deleted,
        role.name roleName,
        role.id roleId,
        role.menu_ids,
        role.parent_id roleParentId,
        menu.name menuName,
        menu.id menuId,
        menu.type menuType,
        menu.show,
        menu.serial_num,
        menu.parent_id menuParentId,
        menu.permission menuPermission
    FROM
        system_user user,
        system_role role,
        system_menu menu
    WHERE
        user.id = ${uid}
        AND FIND_IN_SET(role.id , user.role_ids)
        AND FIND_IN_SET(menu.id , role.menu_ids)
  `)
    ).results as MenuList[]
  ).map((item) => {
    item.info = JSON.parse(item.infoStr)
    return {
      ...item,
    }
  })

  // 上面的查询会有重复, 过滤重复数据
  const filterMenuList: MenuList[] = []
  AllMenulist.forEach((element: MenuList) => {
    const info: System.UserInfo = JSON.parse(element.infoStr)
    const data = filterMenuList.find(
      (item) =>
        info.nickName === item.info.nickName && element.roleIds === item.roleIds && element.menuId === item.menuId
    )
    if (!data) {
      filterMenuList.push(element)
    }
  })
  const { info, roleName, userName, roleId, email } = AllMenulist[0]

  // 将数据转换为前端需要的数据结构
  const menuList: Permissions[] = filterMenuList.map((item) => {
    return {
      roleId: item.roleId,
      roleName: item.roleName,
      id: item.menuId,
      menuType: item.menuType,
      name: item.menuName,
      show: item.show,
      serialNum: item.serialNum,
      actions: [],
      parentId: item.menuParentId,
      permission: item.menuPermission,
    }
  })
  // 获取所有的操作(即按钮)
  const allActions: Permissions[] = menuList.filter((item) => item.menuType === 3)
  // 获取所有的菜单目录和菜单
  const allMenu: Permissions[] = menuList.filter((item) => item.menuType === 1 || item.menuType === 2) || []
  // 根据parentId给菜单添加操作
  allMenu.forEach((menu) => {
    menu.actions = allActions
      .filter((item) => item.parentId === menu.id)
      .map((item) => {
        return {
          id: item.id,
          serialNum: item.serialNum,
          permission: item.permission,
        }
      })
  })
  const userInfo = {
    userName,
    email,
    info,
    role: {
      roleName,
      roleId,
      permissions: allMenu,
    },
  }
  throw new Success(userInfo)
})

export default router
