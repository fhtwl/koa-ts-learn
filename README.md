# 一、前言

绝大部分项目中, 用户、角色、权限等概念和功能都是必要的, 它系统的地基.

若依的权限管理系统给了我不少启发, 我计划用自己熟悉的 js/ts 去搭建一个后台管理系统, 其权限模块思路借鉴于若依的权限管理部分, 并写下博客, 记录心得.

由于我打算项目创建做起, 流程较长, 我计划将整个项目分为 2-3 节, 本文作为第一节, 主要介绍了基础服务的搭建, 包括 koa2 + ts 后端环境的搭建和常用中间件的使用和封装

文中若有错误或者可优化之处, 望请不吝赐教

# 二、环境搭建

## 1. 创建包管理文件

```sh
# 生成package.json
npm init -y
```

新建 src 文件夹, 在 src 根目录新建 app.ts 文件, app.ts 就是整个项目的入口

## 2. 安装依赖

```sh
# 依赖
npm i koa koa-bodyparser koa-router koa-session koa-static koa2-cors log4js mongodb mysql svg-captcha validator ajv ioredis jsonwebtoken
# 依赖注解
npm i --save-dev @types/koa @types/koa-bodyparser @types/koa-router @types/koa-session @types/koa-static @types/koa2-cors @types/log4js @types/mongodb @types/mysql @types/validator @types/ajv @types/ioredis @types/jsonwebtoken

```

## 3. 初始化 ts 配置

```sh
# 生成tsconfig.json
tsc --init
```

修改 tsconfig.json

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2015", // 目标语言版本
    "module": "commonjs", // 指定生成代码的模板标准
    "rootDir": "./", // 指定输出目录, 默认是dist文件夹
    "strict": true, // 严格模式
    "allowSyntheticDefaultImports": true, // 没有默认导出时, 编译器会创建一个默认导出
    "esModuleInterop": true, // 允许export= 导出, 由import from导入
    "forceConsistentCasingInFileNames": true // 强制区分大小写
  },
  "include": [
    // 需要编译的的文件和目录
    "src/**/*"
  ],
  "files": ["src/app.ts"]
}
```

## 4. 运行项目

在 app.ts 里实例化一个 koa 服务器

```ts
// src/app.ts

// 引入koa
import Koa from 'koa'
import http from 'http'
// 创建koa实例
const app = new Koa()
// 创建服务器
const server: http.Server = new http.Server(app.callback())
// 中间件
app.use(async (ctx) => {
  ctx.body = 'Hello World'
})
// 监听端口
app.listen(9000, () => {
  console.log('run success')
  console.log('app started at port 9000...')
})
```

运行

```sh
# 编译ts文件
tsc
# 运行编译的文件
node ./dist/src/app.js
```

如果成功的话, 命令行会打印

```
run success
app started at port 9000...
```

我们可以在浏览器访问 <a href="http://localhost:9000/">http://localhost:9000/</a> <br/>
此时页面上应该会显示 Hello World <br/>

每次都需要执行编译和运行, 太麻烦, 我们可以在修改 package.json, 添加 dev 命令

```json
// package.json
{
  ...

  "scripts": {
    "dev": "tsc && node ./dist/src/app.js"
  },
  ...
}

```

之后每次运行 npm run dev 即可 <br/>
但是这样依然繁琐, 我们希望可以自动监听文件的保存并自动刷新, 这个可以用 nodemon 和 ts-node 来实现 <br/>
前者可以监听文件的变更, 自动重启服务, 后者可以直接运行 ts 文件

安装 nodemon

```sh
npm i nodemon ts-node typescript --save-dev
```

修改 package.json 的 dev 命令

```json
// package.json
{

  ...
  "scripts": {
    "dev": "nodemon ./src/app.ts"
  },
  ...
}
```

## 5. 代码风格控制和自动格式化

为了控制代码风格和质量, 我们可以引入 eslint 和 prettier

```sh
npm i eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-config-prettier prettier --save-dev

```

在根目录创建 .eslintrc.js

```js
// .eslintrc.js
module.exports = {
  root: true,

  env: {
    node: true,
    es2021: true,
  },

  parser: '@typescript-eslint/parser',

  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
  },

  plugins: ['@typescript-eslint'],
  rules: {
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    'no-useless-escape': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/unbound-method': 'off',
    '@typescript-eslint/await-thnable': 'off',
    '@typescript-eslint/restrict-template-expressions': 'off',
    '@typescript-eslint/no-misused-promises': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unsafe-call': 'off',
    '@typescript-eslint/no-unsafe-argument': 'off',
    'no-async-promise-executor': 'off',
    '@typescript-eslint/no-floating-promises': 'off',
    '@typescript-eslint/require-await': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/ban-types': 'off',
    'no-prototype-builtins': 'off',
    'space-before-function-paren': 0,
  },

  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'prettier',
  ],
}
```

在根目录创建.prettierrc 和.editorconfig

```js
// .prettierrc
{
  "printWidth": 120,
  "semi": false,
  "singleQuote": true,
  "prettier.spaceBeforeFunctionParen": true
}

```

```sh
# .editorconfig
root = true

[*.{js,ts,json}]
charset=utf-8
end_of_line=lf
insert_final_newline=false
indent_style=space
trim_trailing_whitespace = true
indent_size=2
insert_final_newline = true

```

编辑 vscode 配置文件 setting.json, 在末尾添加下列行

```json
// setting.json
{
  ...
  "eslint.format.enable": true,
  "editor.codeActionsOnSave": {
    // 启用ESLint规则格式化以上设为none的代码
      "source.fixAll.eslint": true
  },
  "editor.tabSize": 2,

  // 保存时格式化代码
  "editor.formatOnSave": true,
  "eslint.trace.server": "off",
  // 粘贴时格式化代码
  "editor.formatOnPaste": false,
  "[typescript]": {
      "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
}

```

安装 vscode 插件 Prettier - Code formatter <br />

修改 src/app.ts, 在末尾添加下列代码

```ts
// src/app.ts
let a = {
  num: 1,
}
```

此时 eslint 会提示有 2 个警告 1 个错误, 代码有 3 处不符合我们设置的规范

- 'a' is never reassigned. Use 'const' instead.
- num 这行应该使用 2 个空格作为缩进, 而不是 4 个空格
- 结束行应该没有分号作为结束

当我们 ctrl+s 保存文件, 会发现编辑器将代码修改为

```ts
// src/app.ts
const a = {
  num: 1,
}
```

不规范的地方被修复了, 这表示我们的配置成功了

## 6. 项目编译

在正式环境里部署项目, 我们不再需要对文件修改进行监听, 而是直接编译文件. 因此我们添加一个 build 命令

```json
// package.json
{

  ...
  "scripts": {
    "dev": "nodemon ./src/app.ts",
    "build": "tsc && node ./dist/src/app.js"
  },
  ...
}
```

如果项目是部署 window 环境下, 直接 ctrl+c 就可以停止项目, 但是如果在 linux 环境下, 重启项目就比较麻烦, 可以考虑使用 pm2 来管理 node 服务

```sh
# 全局安装pm2
npm install pm2 -g

# 项目根目录
# 运行项目
npm run build

# 查看项目运行状态
pm2 list

# 重启项目
pm2 restart ./dist/src/app.js

```

## 7. 环境变量

为了区分正式环境和开发环境, 我们可以使用 cross-env 添加环境变量

```sh
# 安装cross-env
npm i cross-env --save-dev
```

修改 dev 和 build 命令

```json
// package.json
{
  ...
  "scripts": {
    "dev": "cross-env NODE_ENV=development nodemon ./src/app.ts",
    "build": "tsc && cross-env NODE_ENV=production node dist/src/app.js"
  },
  ...
}

```

修改 src/app.ts

```ts
// src/app.ts
import Koa from 'koa'
import http from 'http'
// 创建koa实例
const app = new Koa()
// 创建服务器
const server: http.Server = new http.Server(app.callback())
// 中间件
app.use(async (ctx) => {
  ctx.body = 'Hello World'
})
// 监听端口
app.listen(9000, () => {
  console.log('run success')
  console.log('app started at port 9000...')
  console.log(process.env.NODE_ENV)
})
```

我们就能看到控制台打印出来的 development。

## 8. 断点调试

在开发过程种, 当我们遇到错误的时候, 可以利用编辑器的断点调试功能, 在不修改代码的情况下就能做到暂停和逐步调试, 能极大地提升开发体验和效率<br />

1. 打开 vscode, 按下 ctrl+shift+d 或者直接点击左侧的"运行和调试：运行"按钮, 左侧会出现"运行和调试：运行"窗口；
2. 点击"运行和调试", 点击"创建 launch.json 文件", 选择环境-"node.js"。vscode 会自动在根目录生产.vscode 文件夹, 和.vscode/launch.json 文件
3. 在左侧"运行和调试"窗口, 点击"Launch Program"（选择运行类型）, 选择 node.js, 选择启动配置为"Run Script: Dev"
4. 按下 F5 或者点击左侧的调试按钮

此时项目会以调试模式启动, 点击需要打断点的代码的行数左侧, 就会生成一个红点, 说明断点设置成功

至此,基础环境搭建基本完成

# 三、中间件开发

## 1. 中间件的含义和作用

中间件是一种封装方式, 用于处理 http 请求的功能 <br />
如果将一个 http 请求比喻为一条运水的管道, 那么中间件就是管道上的仪表、阀门等处理装置 <br />
中间件主要有 3 个核心概念: 请求 request、响应 response 和 next 函数 <br />
request 和 response 是请求的上下文信息 Context, next 函数用于控制状态. <br />
如果一个请求, 没有设置 response, 那么这个请求就会返回 404 <br />
如果一个请求, 进入某个中间件后, 只有当执行 next 函数后, 请求才会继续执行下一个中间件. 如果没有执行 next 函数, 而是设置 response 的状态码和返回值, 那么请求就会结束, 不再继续执行下面的中间件, 而是直接把 response 返回给前端. <br />

## 2. koa 如何使用中间件

koa 使用 use 方法载入中间件

```ts
// 中间件middleware
const middleware1 = (ctx, next) => {
  console.log('1')
  next()
}
// 中间件middleware2
const middleware2 = (ctx, next) => {
  console.log('2')
  ctx.body = 'hello world'
}
app.use(middleware1)
app.use(middleware2)
```

值得注意的是, 中间件先被 use 的, 就先执行 <br />

下面我们介绍一些常用的中间件, 并开发一些中间件<br />

为了模块清晰, 我们在 src 目录下创建 core 文件夹, 用户存放核心静态类 <br />
在 src/core 目录下, 新建 Init.ts, 用于初始化中间件 <br />

## 3. 请求报文处理中间件

http 请求里, 报文主体（即 body 参数部分）是以二进制的数据在网络中进行传输, 并且为了优化速度, 还常常会对内容进行压缩编码, 比如 gzip <br />
koa-bodyparser 中间件, 会将 post 请求的请求报文进行处理, 将请求主体以 json 格式, 挂载在 ctx.request.body 上

```ts
// src/core/Init.ts

import Koa from 'koa'
import http from 'http'
import koaBodyParser from 'koa-bodyparser'
class Init {
  public static app: Koa<Koa.DefaultState, Koa.DefaultContext>
  public static server: http.Server
  public static initCore(app: Koa<Koa.DefaultState, Koa.DefaultContext>, server: http.Server) {
    Init.app = app
    Init.server = server
    Init.loadBodyParser()
  }

  // 解析body参数
  public static loadBodyParser() {
    Init.app.use(koaBodyParser())
  }
}

export default Init.initCore
```

```ts
// src/app.ts
import Koa from 'koa'
import http from 'http'
import initCore from './core/Init'
// 创建koa实例
const app = new Koa()
// 创建服务器
const server: http.Server = new http.Server(app.callback())

// 执行初始化
initCore(app, server)
// 监听端口
app.listen(9000, () => {
  console.log('run success')
  console.log('app started at port 9000...')
  console.log(process.env.NODE_ENV)
})
```

## 4. 路由中间件

服务器端路由, 即根据不同路径的 http 请求做出对应的相应和处理

```ts
// src/core/Init.ts
class Init {
  ...
  static async initLoadRouters() {
    Init.app.use((ctx) => {
      console.log(ctx.path)
      switch (ctx.path) {
        case '/login':
          // 只允许post请求
          if (ctx.method === 'GET') {
            ctx.status = 404
            break
          }
          ctx.body = '登录成功'
          break
        case '/getUser':
          // 只允许get请求
          if (ctx.method === 'POST') {
            ctx.status = 404
            break
          }
          ctx.body = 'admin'
          break
        default: {
          ctx.status = 404
        }
      }
    })
  }
  ...
}
```

但是这样做, 所有的处理都在一起, 在实际开发中并不合适。我们希望把不同的请求处理函数放在不同的目录和文件里, 并且能方便地设置请求路径和请求方法 <br />
koa-router 是 koa 的一个路由中间件, 它可以将请求的 URL 和方法（如：GET 、 POST 、 PUT 、 DELETE 等） 匹配到对应的响应程序或页面 <br />

在 src 下新建目录 api, 在 api 下新建目录 v1, 表示接口的版本, 当前版本的接口都放在 v1 目录下 <br />

在 v1 下新建文件 text.ts, 在这个文件里, 我们创建一个路由实例

```ts
// src/api/v1/test.ts
import Router from 'koa-router'
const router = new Router({
  prefix: '/api/v1',
})

router.get('/test', async (ctx) => {
  ctx.body = 'test'
})

export default router
```

然后在 init 里加载这个路由实例

```ts
// src/core/Init.ts
import test from '../api/v1/test'
class Init {
  ...
  static async initLoadRouters() {
    Init.app.use(test.routes())
  }
  ...
}
```

目前我们约定, src/api 目录下, 只存放 http 请求路由文件, 因此手动引动太过繁琐, 我们希望可以自动递归遍历 src/api 目录, 自动加载所有的路由处理 <br />

在 src 目录下新建 common 目录, 用于存放公共文件, 在 common 下新建 utils 目录, 用于存放工具函数, 再在 utils 下新建 utils.ts <br />

我们先在 utils 里写一个遍历目录下所有文件默认导出的方法

```ts
// src/common/utils/utils.ts

import fs from 'fs'
import path from 'path'
/**
 * 获取某个目录下所有文件的默认导出
 * @param filePath 需要遍历的文件路径
 */
export async function getAllFilesExport(filePath: string, callback: Function) {
  // 根据文件路径读取文件, 返回一个文件列表
  const files: string[] = fs.readdirSync(filePath)
  // 遍历读取到的文件列表
  files.forEach((fileName) => {
    // path.join得到当前文件的绝对路径
    const absFilePath: string = path.join(filePath, fileName)
    const stats: fs.Stats = fs.statSync(absFilePath)
    const isFile = stats.isFile() // 是否为文件
    const isDir = stats.isDirectory() // 是否为文件夹
    if (isFile) {
      const file = require(absFilePath)
      callback(file.default)
    }
    if (isDir) {
      getAllFilesExport(absFilePath, callback) // 递归, 如果是文件夹, 就继续遍历该文件夹里面的文件；
    }
  })
}
```

然后在 init 里调用

```ts
// src/core/Init.ts
class Init {
  ...
  static async initLoadRouters() {
    const dirPath = path.join(`${process.cwd()}/src/api/`)
    getAllFilesExport(dirPath, (file: Router) => {
      Init.app.use(file.routes())
    })
  }
  ...
}
```

此时 src/api 目录下的路由会被自动调用, 但是还有一个问题, 就是在 build 后, 目录会变化, 变成/dist/src/api/, 我们需要根据环境变量, 控制加载目录 <br />

其它需要使用绝对路径的地方, 都会有这个问题, 所以我们可以创建一个公共变量, 利于复用 <br />

在 src 下创建目录 config, 在 config 下创建 Config.ts, 用于存放配置和公共变量

```ts
// src/config/Config.ts
const isDev = process.env.NODE_ENV === 'development'

export default class Config {
  // 服务器端口
  public static readonly HTTP_PORT = 9000
  // 接口前缀
  public static readonly API_PREFIX = '/api/'
  // 根目录
  public static readonly BASE = isDev ? 'src' : 'dist/src'
}
```

修改 app.ts

```ts
// src/app.ts
import Koa from 'koa'
import http from 'http'
import initCore from './core/Init'
import Config from './config/Config'
// 创建koa实例
const app = new Koa()
// 创建服务器
const server: http.Server = new http.Server(app.callback())

// 执行初始化
initCore(app, server)
// 监听端口
app.listen(Config.HTTP_PORT, () => {
  console.log('run success')
  console.log(`app started at port ${Config.HTTP_PORT}...`)
  console.log(process.env.NODE_ENV)
})
```

修改 src/api/v1/test.ts

```ts
// src/api/v1/test.ts

import Router from 'koa-router'
import Config from '../../config/Config'
const router = new Router({
  prefix: `${Config.API_PREFIX}v1`, // 路径前缀
})
// 指定一个url和请求方法匹配处理
router
  .get('/test', (ctx) => {
    ctx.body = 'test'
  })
  .post('/login', (ctx) => {
    ctx.body = '登录'
  })

export default router
```

修改 src/core/Init.ts

```ts
// src/core/Init.ts

import Koa from 'koa'
import http from 'http'
import koaBodyParser from 'koa-bodyparser'
import path from 'path'
import { getAllFilesExport } from '../common/utils/utils'
import Router from 'koa-router'
import Config from '../config/Config'
class Init {
  public static app: Koa<Koa.DefaultState, Koa.DefaultContext>
  public static server: http.Server
  public static initCore(app: Koa<Koa.DefaultState, Koa.DefaultContext>, server: http.Server) {
    Init.app = app
    Init.server = server
    Init.loadBodyParser()
    Init.initLoadRouters()
  }

  // 解析body参数
  public static loadBodyParser() {
    Init.app.use(koaBodyParser())
  }

  // http路由加载
  static async initLoadRouters() {
    const dirPath = path.join(`${process.cwd()}/${Config.BASE}/api/`)
    getAllFilesExport(dirPath, (file: Router) => {
      Init.app.use(file.routes())
    })
  }
}

export default Init.initCore
```

## 5. 错误监听和日志处理

koa 可以通过 ctx.throw()方法或者创建一个 Error 实例并使用 throw 关键字直接抛出错误, 错误会中断程序的执行. <br />
如果错误会被 try...catch 捕获, 一旦被程序就会执行 catch 里的语句, 然后继续往下执行. <br />

```ts
// 中间件one
const one = (ctx, next) => {
  console.log('>> one')
  next()
  console.log('<< one')
}
// 中间件two
const two = (ctx, next) => {
  console.log('>> two')
  next()
  console.log('<< two')
}

app.use(one)
app.use(two)
```

最后的打印结果是

```
>> one
>> two
<< one
<< two
```

ctx 的当前的上下文, next 有点类型回调函数的意思, 会在执行完 next 后再执行下一步 <br />
因此, 在第一个中间件里, 用 try...catch 将 next 包裹, 就能监听往后所有中间件的错误, 知道给 ctx.body 赋值, 整个响应结束 <br />
如果我们自定义一些"错误", 当捕获到不同"错误"时, 做出响应的处理, 那这个中间件不仅仅可以捕获异常, 还能给接口响应一个统一的出口. <br />
在 src/core 目录下, 新建 HttpException.ts, 用于存放不同的 http 错误类型

```ts
// src/core/HttpException.ts
// http异常
export class HttpException extends Error {
  public message: string
  public errorCode: number
  public code: number
  public data: any
  public isBuffer = false
  public responseType: string | undefined
  constructor(data = {}, msg = '服务器异常, 请联系管理员', errorCode = 10000, code = 400) {
    super()
    this.message = msg
    this.errorCode = errorCode
    this.code = code
    this.data = data
  }
}
// http参数异常
export class ParameterException extends HttpException {
  constructor(msg?: string, errorCode?: number) {
    super()
    this.code = 422
    this.message = msg || '参数错误'
    this.errorCode = errorCode || 10000
  }
}

// http请求成功
export class Success extends HttpException {
  public data
  public responseType
  public session
  constructor(data?: unknown, msg = 'ok', code = 200, errorCode = 0, responseType?: string, session?: string) {
    super()
    this.code = code //200查询成功, 201操作成功
    this.message = msg
    this.errorCode = errorCode || 0
    this.data = data
    this.responseType = responseType
    this.session = session
  }
}
// 返回文件流
export class Buffer extends Success {
  public data
  public responseType
  public session
  public isBuffer
  constructor(data?: any, responseType?: string, session?: string) {
    super()
    this.code = 200 //200查询成功, 201操作成功
    this.message = 'ok'
    this.errorCode = 0
    this.data = data
    this.responseType = responseType
    this.session = session
    this.isBuffer = true
  }
}
// 404
export class NotFount extends HttpException {
  constructor(msg: string, errorCode: number) {
    super()
    this.code = 404
    this.message = msg || '资源未找到'
    this.errorCode = errorCode || 10001
  }
}
// 授权失败
export class AuthFailed extends HttpException {
  constructor(msg?: string, errorCode?: number) {
    super()
    this.code = 401
    this.message = msg || '授权失败'
    this.errorCode = errorCode || 10002
  }
}
// Forbbiden
export class Forbbiden extends HttpException {
  constructor(msg: string, errorCode?: number) {
    super()
    this.code = 403
    this.message = msg || '禁止访问'
    this.errorCode = errorCode || 100006
  }
}

// 查询失败
export class QueryFailed extends HttpException {
  constructor(msg?: string, errorCode?: number) {
    super()
    this.code = 500
    this.message = msg || '未查到匹配的数据'
    this.errorCode = errorCode || 100006
  }
}

// 查询失败
export class dataBaseFailed extends HttpException {
  constructor(msg?: string, errorCode?: number) {
    super()
    this.code = 500
    this.message = msg || '数据库出错'
    this.errorCode = errorCode || 100005
  }
}
```

当请求过程中, 出现一些我们预料之中的情况, 比如

- 请求成功应该返回数据
- 请求参数错误或者校验失败
- 请求成功需要返回文件
- 登录失效
  ...

我们可以抛出错误, 并拦截做出处理, 返回对应的状态码和数据。<br />

如果是意料之外的错误,则按异常处理, 并打印日志<br />

在 src 目录下新建目录 middlewares, 用户存放自定义中间件, 然后在 middlewares 目录下新建 catchError.ts, 开发错误拦截中间件<br />

```ts
// src/middlewares/catchError.ts
import koa from 'koa'
import { Success, HttpException } from '../core/HttpException'
export async function catchError(ctx: koa.Context, next: Function) {
  const { method, path } = ctx
  try {
    await next()
  } catch (error: any) {
    // 当前错误是否是我们自定义的Http错误
    const isHttpException = error instanceof HttpException

    // 如果不是, 则抛出错误
    if (!isHttpException) {
      ctx.body = {
        msg: '未知错误',
        errorCode: 9999,
        requestUrl: `${method} ${path}`,
      }
      ctx.status = 500
    }
    // 如果是已知错误
    else {
      if (error.responseType) {
        ctx.response.type = error.responseType
      }
      // 如果是文件流, 则直接返回文件
      if (error.isBuffer) {
        ctx.body = error.data
      } else {
        ctx.body = {
          msg: error.message,
          errorCode: error.errorCode,
          data: error.data,
        }
      }

      ctx.status = error.code
    }
  }
}
```

然后再 Init 里使用中间件

```ts
// src/core/Init.ts
class Init {

  ...
  Init.initCatchError()
  ...

  ...
  // 错误监听和日志处理
  public static initCatchError() {
    Init.app.use(catchError)
  }

  ...
}

```

我们修改下 src/api/v1/test.ts 接口, 根据不同的请求抛出不同的处理

```ts
// src/api/v1/test.ts
import { Success, ParameterException, AuthFailed } from '../../core/HttpException'
router.get('/test', (ctx) => {
  const { id } = ctx.request.body
  const token = ctx.header['authorization'] || ctx.cookies.get('authorization')
  // 如果没有携带登录信息
  if (!token) {
    throw new AuthFailed('未登录')
  }
  // 如果缺少参数或者参数类型错误
  if (typeof id !== 'number') {
    throw new ParameterException('缺少参数id')
  }
  // 请求成功
  throw new Success('text')
})
```

打开浏览器访问<a href="http://localhost:9000/api/v1/test">http://localhost:9000/api/v1/test</a>,可以看到接口返回

> {"msg":"未登录","errorCode":10002,"data":{}}

这样当所有的错误, 以及 http 请求响应,都会集中在 catchError 中间件中处理,根据我们设置的 HttpException 返回对应的数据. <br/>

除去控制太和返回客户端的错误信息之外,我们还需要一个日志系统,将错误记录在一个固定目录下,便于日后查看 <br/>

在 src/common 下创建文件夹 lib, 然后新建 logs.ts, 用于存放日志配置.我们的日志系统主要依赖于 log4js. <br />

在 src 下新建 server 目录, 用户存放单例和公共业务<br />
在 src/server 下, 新建 logs 目录, 用户存放日志相关的业务<br />
src/server/logs 下, 新建 logsConfing.ts, 用户存放 log4js 的配置

```ts
// src/server/logs/logsConfing.ts
export default {
  appenders: {
    console: {
      type: 'console',
    },
    date: {
      type: 'dateFile',
      filename: 'logs/date',
      category: 'normal',
      alwaysIncludePattern: true,
      pattern: '-yyyy-MM-dd-hh.log',
    },
  },
  categories: {
    default: {
      appenders: ['console', 'date'],
      level: 'info',
    },
  },
}
```

log4js 配置项很多, 这里只介绍了 appenders 和 categories 配置<br />

- appenders 可以在 appenders 添加属性设置日志类型.我们这里添加了 console 和 date,并通过 type 设置记录类型.type 为 console 时,表示记录在控制台;type 为 dateFile, date 表示记录在文件里,并根据时间将日志分片

- categories 通过 categories.defult.appenders,可以设置启用的 appenders.通过 categories.defult.level,可以对日志进行过滤

在 src/server/logs 目录下, 新建 logger.ts, 用于获取 logger. <br />
由于我们的配置, 是在 logs 目录下新建日期日志, 而 logs 文件并不需要记录在 git 版本里, 我们也没有手动创建 logs 目录. 当代码运行时, 因为 logs 目录不存在, 就会报错. 所以在服务启动时,需要先判断 logs 目录是否存在. <br />

```ts
// src/server/logs/logger.ts
import log4js from 'log4js'
import fs from 'fs'
import { isDirectory } from '../../common/utils/utils'
import logsConfing from './logsConfing'

//检查某个目录是否存在
if (!isDirectory('logs')) {
  fs.mkdirSync('logs')
}

log4js.configure(logsConfing)

const logger = log4js.getLogger('cheese')

export default logger
```

```ts
// src/common/utils/utils.ts

/**
 * 判断某个文件夹是否存在
 * @param path
 * @returns {boolean}
 */
export function isDirectory(path: string): boolean {
  try {
    const stat = fs.statSync(path)
    return stat.isDirectory()
  } catch (error) {
    return false
  }
}
```

日志的内容, 除去错误信息外, 我们还希望知道错误是调用哪个接口产生的, 因此我们还需要拿到上下文信息 Context, 即请求信息和响应信息. Context 使用的频率很高, 我们可以将这些常用的类型整合起来 <br />
在 src/common 目录下, 新建 typings 目录, 用于存放公共的描述文件 <br />
在 src/common/typings 下, 新建 model.d.ts

```ts
// src/common/typings/model.d.ts
import Koa from 'koa'
export namespace Models {
  type Ctx = Koa.Context
}
```

然后在 src/server/logs 目录下, 创建 index.ts, 用于封装具体业务

```ts
// src/server/logs/index.ts
import logger from './logger'
import { Models } from '../../common/typings/model'

/**
 * 记录信息日志
 * @param ctx
 */
export function infoLog(ctx: Models.Ctx) {
  const { method, response, originalUrl } = ctx
  logger.info(method, response.status, originalUrl)
}

/**
 * 记录错误日志
 * @param ctx
 * @param error
 */
export function errorLog(ctx: Models.Ctx, error: any) {
  const { method, response, originalUrl } = ctx
  logger.error(method, response.status, originalUrl, error)
}
```

然后在 catchError 中间件里,我们引入 logger

```ts
// src/middlewares/catchError
import logger from '../common/lib/logs'
export default async function catchError(ctx: koa.Context, next: Function) {
  const { method, path } = ctx
  try {
    await next()
  } catch (error: any) {
    // 当前错误是否是我们自定义的Http错误
    const isHttpException = error instanceof HttpException

    // 如果不是, 则抛出错误
    if (!isHttpException) {
      logger.error(method, ctx.response.status, ctx.originalUrl, error)
      ...
    }
    // 如果是已知错误
    else {
      ...
      if (error instanceof Success || error instanceof Buffer) {
        logger.info(method, ctx.response.status, ctx.originalUrl)
      } else {
        logger.error(method, ctx.response.status, ctx.originalUrl, error)
      }
    }
  }
}

```

当服务重启后, 我们可以看到, 项目自动在根目录生成了 logs 文件夹和 date.-2022-05-05-13.log（名称就是当前时间）, 在当我们调用接口时,就能在 logs 里看到日志文件 date.-2022-05-05-13.log 内容更新了

```log
[2022-05-05T13:41:54.102] [ERROR] cheese - GET 401 /api/v1/test AuthFailed [Error]: 未登录
    at F:\code\git-demo\node\demo\src\api\v1\test.ts:14:13
    at dispatch (F:\code\git-demo\node\demo\node_modules\koa-compose\index.js:42:32)
    at F:\code\git-demo\node\demo\node_modules\koa-router\lib\router.js:372:16
    at dispatch (F:\code\git-demo\node\demo\node_modules\koa-compose\index.js:42:32)
    at F:\code\git-demo\node\demo\node_modules\koa-compose\index.js:34:12
    at dispatch (F:\code\git-demo\node\demo\node_modules\koa-router\lib\router.js:377:31)
    at dispatch (F:\code\git-demo\node\demo\node_modules\koa-compose\index.js:42:32)
    at F:\code\git-demo\node\demo\src\middlewares\catchError.ts:6:11
    at Generator.next (<anonymous>)
    at F:\code\git-demo\node\demo\src\middlewares\catchError.ts:8:71 {
  isBuffer: false,
  errorCode: 10002,
  code: 401,
  data: undefined
}

```

# 四、引入数据库

## 1. Mysql

<!-- 在上一部分的日志处理中, 如果我们需要日志系统, 比如可以在前端展示日志的列表, 或者查看最新的报错信息, 如果采用读取log文件的方式, 效率比较低, 我们可以考虑将报错的日志存储在Mysql数据库里, 便于读取 <br /> -->

在 src/server 下, 新建 mysql 目录, 在 mysql 下新建 mysqlConfing.ts, 用于存放配置文件

```ts
// src/config/Config.ts
export default class Config {
  ...
  // mysql配置
  public static readonly MYSQL = {
    DB_NAME: 'ts',
    HOST: '127.0.0.1',
    PORT: 3306,
    USER_NAME: 'admin',
    PASSWORD: 'admin',
    CONNECTION_LIMIT: 60 * 60 * 1000,
    CONNECT_TIMEOUT: 1000 * 60 * 60 * 1000,
    ACQUIRE_TIMEOUT: 60 * 60 * 1000,
    TIMEOUT: 1000 * 60 * 60 * 1000,
  }

}

```

```ts
// src/server/redis/mysqlConfing.ts
import Config from '../../config/Config'

export default {
  host: Config.MYSQL.HOST,
  port: Config.MYSQL.PORT,
  user: Config.MYSQL.USER_NAME,
  password: Config.MYSQL.PASSWORD,
  database: Config.MYSQL.DB_NAME,
  multipleStatements: true, // 运行执行多条语句
  connectionLimit: Config.MYSQL.CONNECTION_LIMIT,
  connectTimeout: Config.MYSQL.CONNECT_TIMEOUT,
  acquireTimeout: Config.MYSQL.ACQUIRE_TIMEOUT,
  timeout: Config.MYSQL.TIMEOUT,
}
```

在 src/server/mysql 下新建 pool.ts, 创建 mysql 连接池实例

```ts
// src/server/mysql/pool.ts
import mysql from 'mysql'
import mysqlConfing from './mysqlConfing'

const pool = mysql.createPool(mysqlConfing)
export default pool
```

在 src/server/mysql 下新建 index.ts, 用于封装常用方法和公共业务

```ts
// src/server/mysql/index.ts
import { Models } from '../../common/typings/model'
import pool from './pool'
import { DataBaseFailed } from '../../core/HttpException'
import { lineToHumpObject } from '../../common/utils/utils'
import mysql from 'mysql'

/*
 * 数据库增删改查
 * @param command 增删改查语句
 * @param value 对应的值
 */
export async function command(command: string, value?: Array<any>): Promise<Models.Result> {
  try {
    return new Promise<Models.Result>((resolve, reject: (error: Models.MysqlError) => void) => {
      pool.getConnection((error: mysql.MysqlError, connection: mysql.PoolConnection) => {
        // 如果连接出错, 抛出错误
        if (error) {
          const result: Models.MysqlError = {
            error,
            msg: '数据库连接出错' + ':' + error.message,
          }
          reject(result)
        }

        const callback: mysql.queryCallback = (err, results?: any, fields?: mysql.FieldInfo[]) => {
          connection.release()
          if (err) {
            const result: Models.MysqlError = {
              error: err,
              msg: err.sqlMessage || '数据库增删改查出错',
            }

            reject(result)
          } else {
            const result: Models.Result = {
              msg: 'ok',
              state: 1,
              // 将数据库里的字段, 由下划线更改为小驼峰
              results: results instanceof Array ? results.map(lineToHumpObject) : results,
              fields: fields || [],
            }
            resolve(result)
          }
        }
        // 执行mysql语句
        if (value) {
          pool.query(command, value, callback)
        } else {
          pool.query(command, callback)
        }
      })
    }).catch((error) => {
      throw new DataBaseFailed(error.msg)
    })
  } catch {
    throw new DataBaseFailed()
  }
}
```

其它相关文件修改：

```ts
// src/config/Config.ts
export default class Config {
  ...
  // 默认时间格式
  public static readonly DEFAULT_DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss'
}
```

安装 moment, 用于对时间的处理

```
npm i moment
npm i @types/moment --save-dev
```

在 src/utils 下新增 date.ts, 用于存放时间相关的工具函数

```ts
// src/common/utils/date.ts
import moment from 'moment'
import Config from '../../config/Config'

/**
 * 格式化时间
 * @param date
 * @param pattern
 * @returns
 */
export function format(date: Date, pattern = Config.DEFAULT_DATE_FORMAT) {
  return moment(date).format(pattern)
}
```

mysql 存储的字段, 一般是以下划线的格式存储, 而 js 代码中, 一般是以驼峰式命名变量名, 所以需要对数据做一层转换

```ts
// src/common/utils/utils.ts
...
export function isValidKey(key: string | number | symbol, object: object): key is keyof typeof object {
  return key in object
}

/**
 * 下划线转驼峰
 * @param str
 * @returns
 */
export function lineToHump(str: string): string {
  if (str.startsWith('_')) {
    return str
  }
  return str.replace(/\_(\w)/g, (all, letter: string) => letter.toUpperCase())
}

/**
 * 驼峰转下划线
 * @param str
 * @returns
 */
export function humpToLine(str = ''): string {
  if (typeof str !== 'string') {
    return str
  }
  return str.replace(/([A-Z])/g, '_$1').toLowerCase()
}

/**
 * 将对象的所有属性由下划线转换成驼峰
 * @param obj
 * @returns
 */
export function lineToHumpObject(obj: Object) {
  let key: string
  const element: {
    [key: string]: any
  } = {}
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (isValidKey(key, obj)) {
        const value = obj[key]
        if (typeof key === 'string' && (key as string).indexOf('_at') > -1) {
          element[lineToHump(key)] = format(value)
        } else {
          element[lineToHump(key)] = value
        }
      }
    }
  }
  return {
    ...element,
  }
}

/**
 * 将对象的所有属性由驼峰转换为下划线
 * @param obj
 * @returns
 */
export function humpToLineObject(obj: Object) {
  let key: string
  const element: {
    [key: string]: any
  } = {}
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (isValidKey(key, obj)) {
        const value = obj[key]
        element[humpToLine(key)] = value || null
      }
    }
  }
  return {
    ...element,
  }
}


```

## 2. Redis

在 src/server 下, 新建 redis 目录, 在 redis 下新建 redisConfing.ts, 用于存放配置文件

```ts
// src/config/Config.ts
export default class Config {
  ...
  // redis
  public static readonly REDIS = {
    PORT: 6379,
    HOST: '127.0.0.1',
    PASSWORD: 'admin',
    DB: 0,
  }

}

```

```ts
// src/server/redis/redisConfing.ts
import Config from '../../config/Config'

export default {
  port: Config.REDIS.PORT, // Redis port
  host: Config.REDIS.HOST, // Redis host
  password: Config.REDIS.PASSWORD,
  db: Config.REDIS.DB,
}
```

在 src/server/redis 下新建 redis.ts, 创建 redis 实例

```ts
// src/server/redis/redis.ts
import redisConfing from './redisConfing'
import IoreDis from 'IoreDis'
export default new IoreDis(redisConfing)
```

在 src/server/redis 下新建 index.ts, 用于封装常用方法和公共业务

```ts
// src/server/redis/index.ts
import Config from '../../config/Config'
import { DataBaseFailed } from '../../core/HttpException'
import redis from './redis'
/**
 * redis报错回调
 * @param err
 */
export function redisCatch(err: Error) {
  throw new DataBaseFailed(err.message)
}

/**
 * 选择数据库
 * @param DbName
 * @returns
 */
export async function selectDb(DbName: number) {
  return new Promise((resolve) => {
    redis
      .select(DbName)
      .then(() => {
        resolve(true)
      })
      .catch(redisCatch)
  })
}
```

# 五、总结

本文主要介绍了 koa2+ts 后端项目的环境搭建和常用中间件, 下一篇会在本文基础上, 介绍注册和登录系统的设计和开发<br />

本文的完整代码在 <a href="https://gitee.com/fhtwl/koa-ts-learn/tree/step2/"> gitee koa-ts-learn step1</a>
