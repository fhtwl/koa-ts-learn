# 一、前言

上文我们基于 nodejs+ts 的 web 后端环境里, 完成了登录和注册接口的开发, 以及相关的如发送邮件、图片验证码、接口参数校验中间件等功能的开发, 具体目录如下:

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

# 二、角色设计

## 1. 业务场景

我们希望设计一个通用的后台管理系统, 每一个用户都能有多种角色, 每一个角色都能有多个用户, 每个角色都可以有多类和多个权限. 角色与角色之间有父子关系, 即它们的权限可以继承 <br>

角色权限根据场景不同可以有多种, 我们这里只处理最基础也最通用的前端路由(菜单分类、菜单、操作按钮)权限和后端接口权限的的设计和开发, 当然, 角色可以有多个权限, 权限也可以有多个角色

## 2. system_role

我们需要新建 **system_role** 表用于存储所有的角色, 在前文中, 我们设计和创建了用户表 **system_user** , 并为 **system_user** 创建了 _role_ids_ 字段, 用于记录角色的 id. _role_ids_ 以逗号分隔字符串的形式, 存储多个 id , 即 **system_role** 的 id, 实现了每一个用户都能有多种角色, 每一个角色都能有多个用户. 在 **system_role** 中, 我们通 _menus_ids_ 字段保存前端菜单 id, 实现角色和菜单权限的多对多关系

```sh
DROP TABLE IF EXISTS `system_role`;
CREATE TABLE `system_role`  (
  `id` int(0) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '角色名称',
  `describe` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '描述',
  `parent_id` int(0) NOT NULL COMMENT '父id',
  `serial_num` int(0) NULL DEFAULT NULL COMMENT '排序',
  `menus_ids` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '菜单权限',
  `created_at` datetime(0) NOT NULL COMMENT '创建时间',
  `updated_at` datetime(0) NOT NULL ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 9 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

```

## 3. system_menu

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

# 六、总结

本文从数据库创建开始, 对完整的注册和登录功能进行了设计和开发, 下一节将开始介绍权限管理控制的设计和开发<br />

本文的完整代码地址 <a href="https://github.com/fhtwl/koa-ts-learn/tree/step3"> github koa-ts-learn</a>
