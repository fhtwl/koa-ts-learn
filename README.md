# 一、前言

上文我们基于 nodejs+ts 的 web 后端环境里, 完成了登录和注册接口的开发, 以及相关的如发送邮件、图片验证码、接口参数校验等常见业务中间件等功能的开发, 具体章节如下:

```
一、前言
二、用户注册
  1.创建数据库
  2.创建 system_user 表
  3. 注册
    1. session
    2. 发送邮件
    3. 校验用户名和邮箱是否可用
三、参数校验
  6. 项目编译
  7. 环境变量
  8. 断点调试
三、中间件开发
  1. json-schema
  2. ajv
  3. 参数校验中间件开发
  4. 使用校验中间件
  5. 验证码校验中间件开发
四、用户登录
  1. 构建 token
  2. 图片验证码
  3. 登录接口开发
  4. token 校验中间件开发
  5. 用户信息查询接口开发
五、退出登录
  1. 如何实现退出登录
  2. 通过 redis 保存 token
  3. 校验 token 签发机构
  3. 删除 token
六、总结

```

<a href="https://juejin.cn/post/7100897370744815623">前文地址</a> <br />
本文会在之前的基础上进行开发, 完成权限模块的设计与实现

文中若有错误或者可优化之处, 望请不吝赐教

# 二、路由权限

我们希望设计一个通用的后台管理系统, 每一个用户都能有多种角色, 每一个角色都能有多个用户, 每个角色都可以有多类和多个权限. 角色与角色之间有父子关系, 即它们的权限可以继承 <br>

角色权限根据场景不同可以有多种, 我们这里只处理最基础也最通用的前端路由(菜单分类、菜单、操作按钮)权限和后端接口权限的的设计和开发, 当然, 角色可以有多个权限, 权限也可以有多个角色

## 1. 数据库表设计

### 1. system_role

我们需要新建 **system_role** 表用于存储所有的角色, 在前文中, 我们设计和创建了用户表 **system_user** , 并为 **system_user** 创建了 _role_ids_ 字段, 用于记录角色的 id. _role_ids_ 以逗号分隔字符串的形式, 存储多个 id , 即 **system_role** 的 id, 实现了每一个用户都能有多种角色, 每一个角色都能有多个用户. 在 **system_role** 中, 我们通 _menu_ids_ 字段保存前端菜单 id, 实现角色和菜单权限的多对多关系

```sh
DROP TABLE IF EXISTS `system_role`;
CREATE TABLE `system_role`  (
  `id` int(0) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '角色名称',
  `describe` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '描述',
  `parent_id` int(0) NOT NULL COMMENT '父id',
  `serial_num` int(0) NULL DEFAULT NULL COMMENT '排序',
  `menu_ids` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '菜单权限',
  `created_at` datetime(0) NOT NULL COMMENT '创建时间',
  `updated_at` datetime(0) NOT NULL ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 9 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

```

### 2. system_menu

```sh
  DROP TABLE IF EXISTS `system_menu`;
  CREATE TABLE `system_menu`  (
    `id` int(0) NOT NULL AUTO_INCREMENT,
    `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '菜单名称',
    `parent_id` int(0) NOT NULL COMMENT '父id',
    `icon` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '图标',
    `show` tinyint(0) NULL DEFAULT NULL COMMENT '是否显示',
    `component` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '组件',
    `redirect` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '重定向',
    `permission` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '权限标识',
    `serial_num` int(0) NULL DEFAULT NULL COMMENT '排序',
    `path` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '路径',
    `hide_children` tinyint(0) NULL DEFAULT 0 COMMENT '是否隐藏子节点',
    `type` tinyint(1) NOT NULL DEFAULT 1 COMMENT '菜单类型(1目录,2页面,3按钮)',
    `updated_at` datetime(0) NOT NULL COMMENT '更新时间',
    `created_at` datetime(0) NOT NULL COMMENT '创建时间',
    PRIMARY KEY (`id`) USING BTREE
  ) ENGINE = InnoDB AUTO_INCREMENT = 41 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

```

## 2. 用户动态路由

前端通过该接口创建动态路由和导航栏 <br />
在 src/api/v1/system/user 下新建 getUserMenu.ts

```ts
// src/api/v1/system/user/getUserMenu.ts
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

  // 存放当前用户的角色和祖宗角色
  const roleList: Account.Role[] = []
  // 过滤, 获取当前角色及当前角色的祖先角色的所有记录
  const each = (list: Account.Role[], nodeId: number) => {
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
  // 根据serialNum排序
  sortEach(res.results)
  // 构建前端需要的menu树
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
```

## 3. 操作权限

通过路由和导航的控制, 我们控制页面和路由的权限, 但是我们希望控制的颗粒度到达操作级, 即可以控制每个按钮的权限. <br />

修改 system/user/query 接口, 返回权限

```ts
// src/api/v1/system/user/query.ts

import KoaRouter from 'koa-router'
import { Models } from '../../../../common/typings/model'
import { command } from '../../../../server/mysql'
import { Success } from '../../../../core/HttpException'
import Config from '../../../../config/Config'
import verifyToken from '../../../../middlewares/verifyToken'
import { Account } from '../../../../common/typings/account'
import { Menu } from '../../../../common/typings/menu'

interface MenuList extends Account.User {
  roleParentId: number
  menuId: number
  roleName: string
  roleId: number
  menuName: string
  menuType: Menu.MenuType
  serialNum: number
  show: 0 | 1
  menuParentId: number
  menuPermission: string
}

interface Permissions {
  name: string
  roleId: number
  id: number
  menuType: Menu.MenuType
  show: number
  parentId: number
  serialNum: number
  permission: string
  actions: Account.Action[]
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
    const info: Account.UserInfo = JSON.parse(element.infoStr)
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
```

# 三、接口权限

为了安全性, 我们在后端添加了接口的校验, 只有当前接口拥有访问权限时才能正常访问该接口. <br />

接口的访问权限目前分为 3 种:

- 任何人都可以访问
- 登录用户可以访问
- 某些角色可以访问

我们给客户端的每一个需要访问接口的操作都设置一个权限字段 _permission_ , _permission_ 由接口的路由构成, 比如:

> system:user:query

当用户访问接口时, 会经过权限校验中间件, 通过 token 解析获取角色, 以此获取当前角色的接口权限列表, 再通过上下文对象 _Context_ 获取接口路径, 并转换为路径权限字段, 当接口权限列表里包含该路径权限字段时, 说明该角色拥有该接口的访问权限, 否则拒绝访问<br />

如果每次都查询 mysql 去获取权限, 会对性能带来浪费, 故这里考虑对角色进行缓存

## 1. 缓存角色

我们使用 redis 实现角色的缓存, 将角色 id 作为 key, 使用 hash 类型将关键信息 _id_ 、 _parentId_ 、 _permissions_ 缓存起来 <br />

- id: 角色 id
- parentId: 角色的父 id
- permissions: 角色权限字段的列表转换的逗号分隔的字符串

```ts
// src/server/auth/index.ts
/**
 * 获取用户权限
 * @param decode
 * @returns
 */
export function getUserPermission(decode: Account.Decode): Promise<Menu.Menu[]> {
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
          const menuList: Menu.Menu[] = (
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
 * 获取所有角色的权限列表
 * @returns
 */
export function getAllRolePermission(): Promise<Role.Role[]> {
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
        const RoleList: Role.Role[] = []
        for (let i = 0; i < res.results.length; i++) {
          const item: Menu.Menu = res.results[i]
          RoleList.push({
            id: item.id,
            parentId: item.parentId,
            name: item.name,
            menuList: await getUserPermission({
              scope: String(item.id),
              uid: 0,
            }),
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
```

在服务启动时, 执行角色的缓存

```ts
// src/core/Init.ts
import { updateRedisRole } from '../server/auth'
class Init {
  public static initCore(app: Koa<Koa.DefaultState, Koa.DefaultContext>, server: http.Server) {
    ...
    Init.updateRedisRole()
  }

  ...
  // 更新redis里的角色数据
  public static updateRedisRole() {
    updateRedisRole()
  }
}
```

## 2. 角色接口访问权限中间件开发

```ts
// src/middlewares/verifyToken.ts

import { getRedisUserPermission } from '../server/auth'
/**
 * 校验token是否合法
 * @param ctx
 * @param next
 * @param callback
 */
export default async function verifyToken(ctx: Models.Ctx, next: Function, callback?: Function) {
  // 获取token
  const userToken = getToken(ctx)
  // 如果token不存在, 或者不存在redis里
  if (!userToken || !(await getTokenValue(userToken)).results) {
    throw new Forbbiden('无访问权限')
  }
  // 尝试解析token, 获取uid和scope
  const { uid, scope } = (await analyzeToken(userToken)) as Account.Decode
  // 在上下文保存uid和scope
  ctx.auth = {
    uid,
    scope,
  }
  if (callback) {
    await callback({ uid, scope })
  }
  await next()
}

/**
 * 校验token权限
 * @param ctx
 * @param next
 */
export async function verifyTokenPermission(ctx: Models.Ctx, next: Function) {
  await verifyToken(ctx, next, async (decode: Account.Decode) => {
    // 获取当前角色的权限字段列表
    const permissionList: string[] = await getRedisUserPermission(decode)

    const bool = permissionList.find((permission) => {
      const path = `${Config.API_PREFIX}v1/${permission.split(':').join('/')}`
      return path === ctx.path
    })
    if (!bool) {
      throw new Forbbiden('权限不足')
    }
  })
}
```

当接口需要校验角色权限时, 则给接口添加 _verifyTokenPermission_ 中间件; 当接口只需要登录即可访问时, 给接口添加 _verifyToken_ 中间件; 否则不添加权限校验中间件

## 3. 修改角色和权限

当用户修改角色和权限成功后, 更新 redis 缓存

```ts
// src/api/v1/system/role/add.ts

import { Models } from '../../../../common/typings/model'
import Config from '../../../../config/Config'
import KoaRouter from 'koa-router'
import { Success } from '../../../../core/HttpException'
import validator from '../../../../middlewares/validator'
import addRole from '../../../../common/apiJsonSchema/system/role/addRole'
import { format } from '../../../../common/utils/date'
import { command } from '../../../../server/mysql'
import { verifyTokenPermission } from '../../../../middlewares/verifyToken'
import { updateRedisRole } from '../../../../server/auth'

const router = new KoaRouter({
  prefix: `${Config.API_PREFIX}v1/system/role`,
})

router.post('/add', verifyTokenPermission, validator(addRole, 'body'), async (ctx: Models.Ctx) => {
  const { name, parentId, describe = '', serialNum } = ctx.request.body
  const date = format(new Date())
  const res = await command(`
    INSERT INTO system_role ( name, parent_id, \`describe\`, serial_num, created_at, updated_at )
    VALUES
    ( '${name}', ${parentId}, '${describe}', ${serialNum}, '${date}', '${date}' );
  `)
  updateRedisRole()
  throw new Success(res)
})

export default router
```

# 四、总结

本文从数据库创建开始, 对角色和权限功能进行了设计和开发, 至此该系列结束, 一个基于 koa2 和 ts 的 web 后端框架基本搭建完成<br />

本文的完整代码地址 <a href="https://github.com/fhtwl/koa-ts-learn/tree/step3"> github koa-ts-learn</a>
