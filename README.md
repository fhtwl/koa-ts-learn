# 一、前言

上文介绍了一个 nodejs+ts 的 web 后端项目的环境搭建以及常见中间件的开发和使用, 具体目录如下:

```
一、前言
二、环境搭建
  1. 创建包管理文件
  2. 安装依赖
  3. 初始化ts配置
  4. 运行项目
  5. 代码风格控制和自动格式化
  6. 项目编译
  7. 环境变量
  8. 断点调试
三、中间件开发
  1. 中间件的含义和作用
  2. koa如何使用中间件
  3. 请求报文处理中间件
  4. 路由中间件
  5. 错误监听和日志处理
四、引入数据库
  1. Mysql
  2. Redis
五、总结

```

本文会在上文的基础上, 开始具体功能的开发, 主要是注册和登录相关功能的设计与实现

文中若有错误或者可优化之处, 望请不吝赐教

# 二、用户注册

## 1.创建数据库

<!-- 不同的业务场景下, 由不同的人去开发, 可能有不同的最优数据库设计.我们需要先梳理一下当前的业务场景. <br />
我们希望实现的是一个通用后台管理系统, 用户可以有多种角色, 每个角色可以有多种权限, 拥有对应权限的用户, 可以在管理系统里对用户和权限进行增删改查. -->

登录 mysql, 创建数据库 admin,

```sql
CREATE TABLE admin
```

选择 admin

```sql
use admin
```

## 2.创建 system_user 表

system_user 表用于存储所有的用户, <b>id</b>和<b>email</b><b>user_name</b>是唯一不重复的, 如果是以手机号作为区分用户的唯一标识, 可以把<b>email</b>换成<b>phone</b>. <br />

为了便于排序以及后期可能有的日志等功能, 我们给表添加<b>created_at</b>和<b>update_at</b>字段

```sql

DROP TABLE IF EXISTS `system_user`;
CREATE TABLE `system_user`  (
  `id` int(0) NOT NULL AUTO_INCREMENT COMMENT '唯一id',
  `email` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '邮箱',
  `user_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '用户名',
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '密码',
  `role_ids` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '权限id集合',
  `deleted` tinyint(1) NOT NULL DEFAULT 0 COMMENT '已被删除',
  `info` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '详情',
  `created_at` datetime(0) NOT NULL COMMENT '创建时间',
  `updated_at` datetime(0) NOT NULL ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `user_name`(`user_name`) USING BTREE,
  UNIQUE INDEX `email`(`email`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;


```

## 3. 注册

注册, 本质上是往<i>system_user</i>表内新增记录. <br />
注册用户时, 用户需要给出下列参数:

- 用户名
- 邮箱
- 邮箱验证码
- 密码

在 src/api/v1 下新建 system 目录, 用于存放系统基础接口. 在 system 下新建 auth 目录, 用于存放登录注册相关的接口<br />
在 src/api/v1/system/auth 下新建 register.ts

```ts
// src/api/v1/system/auth/register.ts
import KoaRouter from 'koa-router'
import { Models } from '../../../../common/typings/model'
import { command } from '../../../../server/mysql'
import { Success } from '../../../../core/HttpException'
import { format } from '../../../../common/utils/date'
import Config from '../../../../config/Config'

const router = new KoaRouter({
  prefix: `${Config.API_PREFIX}v1/system/auth`,
})

router.post('/register', async (ctx: Models.Ctx) => {
  const { password, userName, email } = ctx.request.body
  const date = format(new Date())

  // 注册
  await command(`
        INSERT INTO user ( user_name, email, password, created_at, updated_at )
        VALUES
        ( '${userName}', '${email}', '${password}', '${date}', '${date}' );
    `)

  throw new Success()
})

export default router
```

为了安全性, 这里将密码的加密放在了前端. 后端会将密码等数据直接存储在数据库里. <br />
使用 Apifox 等接口模拟工具去模拟请求:

> localhost:9000/api/v1/system/auth/register

```json
{
  "password": "ee11cbb19052e40b07aac0ca060c23ee", // md5 加密后的密码
  "user": "user",
  "email": "12345678@qq.com"
}
```

执行后我们能在数据库里发现新增了一条数据. <br />

此时仅仅是将接口和数据库走通, 整个注册功能远远不够完善, 比如缺少邮箱验证, 我们希望用于填写的邮箱是有效的邮箱, 而不是随便输入的字符串<br />

整个注册流程应该是这样的:

1. 用户填写用户名、密码(和确认密码)、邮箱
2. 用户点击<b>获取邮箱验证码</b>的按钮, 后台往用户填写的邮箱里发送验证码邮件
3. 用户填写从邮件里获取的验证码
4. 点击登录, 注册成功

这是一个以邮箱账号作为账号主体的账号系统最基础的功能和流程. <br />
表面上看, 它只涉及一个发送邮件的功能, 实际上, 除此之外, 我们还需要一个记录用户状态的功能. <br />
梳理一下发送邮件的业务逻辑:

1. 后台接收到获取邮箱验证码的请求
2. 后台创建一个随机的验证码, 并将这个验证码写入到邮件里并发送给用户的邮箱.
3. 后台接收到注册的请求, 后台需要判断注册请求里用户的验证码是不是就是之前获取邮箱验证码请求里给我的验证码

http 是无状态的, 相互之前没有关联, 而这里就需要同时获取两个接口的数据. 常见的作法是使用 session <br />

#### 1. session

session 是一种记录客户状态的机制，使一段信息能在服务端和客户端之间传递, 用于实现多个有关联的 http 请求所构成的一个会话。 <br />

> 当我们讨论 session 的实现方式的时候，都是寻找一种方式从而使得多次请求之间能够共享一些信息。不论选择哪种方式，都是需要由服务自己来实现的，http 协议并不提供原生的支持。

session 最常见的方式还是使用 cookie 来存储 session 信息, 这里的信息可以是整个 session 的具体数据，也可以只是 session 的标识。这样服务端通过 set-cookie 的方式把信息返回给客户端，客户端下次请求的时候会自动带上符合条件的 cookie，服务端再解析 cookie 就能够获取到 session 信息了。<br />

这里我们通过 Koa-Session 来实现 session 会话的管理, Koa-Session 默认也是使用 cookie <br />

在 src/core/Init.ts 里新建静态方法 loadSession

```ts
// src/core/Init.ts
import session from 'koa-session'

...
  public static initCore(app: Koa<Koa.DefaultState, Koa.DefaultContext>, server: http.Server) {
    Init.app = app
    Init.server = server
    Init.loadBodyParser()
    Init.initCatchError()
    Init.loadSession()
    Init.initLoadRouters()
  }

  // 加载session
  public static loadSession() {
    Init.app.keys = ['some secret hurr']
    Init.app.use(
      session(
        {
          key: 'koa:sess', //cookie key (default is koa:sess)
          maxAge: 86400000, // cookie的过期时间 maxAge in ms (default is 1 days)
          overwrite: true, //是否可以overwrite    (默认default true)
          httpOnly: true, //cookie是否只有服务器端可以访问 httpOnly or not (default true)
          signed: true, //签名默认true
          rolling: false, //在每次请求时强行设置cookie，这将重置cookie过期时间（默认：false）
          renew: false, //(boolean) renew session when session is nearly expired,
        },
        Init.app
      )
    )
  }

...

```

#### 2. 发送邮件

发送邮件我们可以使用 nodemailer <br />
安装 nodemailer

```sh
npm i nodemailer
npm i @types/nodemailer --save-dev
```

在 src/server 下新建 mailer 目录, 在 mailer 下新建 mailerConfing.ts, 用于存放配置文件

```ts
// src/server/mailer/mailerConfing.ts
export default {
  service: 'qq', //使用了内置传输发送邮件 查看支持列表：https://nodemailer.com/smtp/well-known/
  port: 456, // SMTP 端口
  auth: {
    user: 'xxx@qq.com', // 邮箱
    pass: 'xxxxxxxx', // 这里密码不是邮箱密码，是你设置的smtp授权码
  },
  secureConnection: true, // 使用 SSL
}
```

在 src/server/mailer 下新建 transporter.ts, 创建一个 SMTP 客户端配置对象

```ts
// src/server/mailer/transporter.ts
import nodemailer from 'nodemailer'
import mailerConfing from './mailerConfing'

// 开启一个 SMTP 连接池
const transporter = nodemailer.createTransport(mailerConfing)

export default transporter
```

在 src/server/mailer 下新建 index.ts, 用于封装常用方法和公共业务

```ts
// src/server/mailer/index.ts
import { HttpException } from '../../core/HttpException'
import transporter from './transporter'
interface MailOptions {
  from?: string // 发件人
  to: string // 收件人
  subject: string // 主题
  text: string // plain text body
  html: string // html body
}

/**
 * 发送邮件
 * @param { MailOptions } mailOptions
 * @returns
 */
export async function sendEmail({ from = '"Fhtwl" <xxxxxxx@qq.com>', to, subject, text, html }: MailOptions) {
  return new Promise((resolve, reject) => {
    const mailOptions = {
      from,
      to,
      subject,
      text,
      html,
    }
    mailOptions.from = from
    mailOptions.to = to
    mailOptions.subject = subject
    mailOptions.text = text
    mailOptions.html = html
    transporter.sendMail(mailOptions).then((res) => {
      if (res.response.indexOf('250') > -1) {
        resolve(true)
      } else {
        reject()
      }
    })
  }).catch((error) => {
    throw new HttpException(error.msg)
  })
}
```

然后在接口里调用。在 src/api/v1/system/auth 下新建 sendCodeEmail.ts

```ts
// src/api/v1/system/auth/sendCodeEmail.ts
import KoaRouter from 'koa-router'
import { Models } from '../../../../common/typings/model'
import Config from '../../../../config/Config'
import { Success } from '../../../../core/HttpException'
import { sendEmail } from '../../../../server/mailer'

const router = new KoaRouter({
  prefix: `${Config.API_PREFIX}v1/system/auth`,
})

router.post('/sendCodeEmail', async (ctx: Models.Ctx) => {
  const { email, userName } = ctx.request.body
  const code = (Math.random() * 1000000).toFixed()
  // 在会话中添加验证码字段code
  ctx.session!.code = code
  // 发送邮件
  await sendEmail({
    to: email,
    subject: '验证码',
    text: '验证码',
    html: `
            <div >
                <p>您正在注册FHTWL低代码平台帐号，用户名<b>${userName}</b>，
                验证邮箱为<b>${email}</b> 。
                验证码为：</p>
                <p style="color: green;font-weight: 600;margin: 0 6px;text-align: center; font-size: 20px">
                  ${code}
                </p>
                <p>请在注册页面填写该改验证码</p>
            </div>
        `,
  })

  throw new Success()
})

export default router
```

成功调用这个接口后, 我们就能在填写的邮箱里收到对应的验证码邮件. <br />

修改 register 接口, 校验用户填写的验证码 code 是否就是会话中存储的验证码 code

```ts
// src/api/v1/system/auth/register.ts
import KoaRouter from 'koa-router'
import { Models } from '../../../../common/typings/model'
import { command } from '../../../../server/mysql'
import { ParameterException, Success } from '../../../../core/HttpException'
import { format } from '../../../../common/utils/date'
import Config from '../../../../config/Config'

const router = new KoaRouter({
  prefix: `${Config.API_PREFIX}v1/system/auth`,
})

router.post('/register', async (ctx: Models.Ctx) => {
  const { password, userName, email, code } = ctx.request.body
  if (code !== ctx.session?.code) {
    throw new ParameterException('验证码错误')
  }
  const date = format(new Date())

  // 注册
  await command(`
        INSERT INTO user ( user_name, email, password, created_at, updated_at )
        VALUES
        ( '${userName}', '${email}', '${password}', '${date}', '${date}' );
    `)

  throw new Success()
})

export default router
```

session 和发送验证码邮件, 保证了每个注册用户的邮箱都是可用的, 但是目前是逻辑还有需要优化的地方， 比如邮箱和用户名作为唯一值需要校验是否已经有用户在使用

#### 3. 校验用户名和邮箱是否可用

```ts
// src/api/v1/system/auth/sendCodeEmail.ts
import KoaRouter from 'koa-router'
import { Models } from '../../../../common/typings/model'
import Config from '../../../../config/Config'
import { HttpException, Success } from '../../../../core/HttpException'
import { sendEmail } from '../../../../server/mailer'
import { command } from '../../../../server/mysql'

const router = new KoaRouter({
  prefix: `${Config.API_PREFIX}v1/system/auth`,
})

router.post('/sendCodeEmail', async (ctx: Models.Ctx) => {
  const { email, userName } = ctx.request.body
  const { bool, msg } = await checkUserNameAndEmail(userName, email)
  if (!bool) {
    throw new HttpException('', msg)
  }
  const code = (Math.random() * 1000000).toFixed()
  // 在会话中添加验证码字段code
  ctx.session!.code = code
  // 发送邮件
  await sendEmail({
    to: email,
    subject: '验证码',
    text: '验证码',
    html: `
            <div >
                <p>您正在注册FHTWL低代码平台帐号，用户名<b>${userName}</b>，
                验证邮箱为<b>${email}</b> 。
                验证码为：</p>
                <p style="color: green;font-weight: 600;margin: 0 6px;text-align: center; font-size: 20px">
                  ${code}
                </p>
                <p>请在注册页面填写该改验证码</p>
            </div>
        `,
  })

  throw new Success()
})

export default router

/**
 * 邮箱和用户名作为唯一值需要校验是否已经有用户在使用
 * @param { string } userName
 * @param { string } email
 * @returns
 */
async function checkUserNameAndEmail(userName: string, email: string): Promise<{ bool: boolean; msg: string }> {
  return new Promise(async (resolve, reject) => {
    const res = await command(`
      SELECT
        user_name,
        email
      FROM
        user
      where
        user_name = '${userName}'
      or
        email = '${email}'
    `)
    if (res.results.length > 0) {
      const userNameList = res.results.filter((item: { userName: any }) => item.userName === userName)
      const emailList = res.results.filter((item: { email: any }) => item.email === email)
      const msgList = []
      if (userNameList.length > 0) {
        msgList.push('该用户名已被注册')
      }
      if (emailList.length > 0) {
        msgList.push('该邮箱已被注册')
      }
      resolve({
        bool: false,
        msg: msgList.join(','),
      })
    } else {
      reject({
        bool: false,
      })
    }
  })
}
```

# 三、参数校验

在上一节两个接口的开发中, 我们会发现, 当调用接口时没有传递正确的参数, 程序就会报错, 但是客户端根据就不知道服务端是因为什么导致的报错, 所以我们需要对参数进行校验, 并在校验未通过了给出专门的处理。 <br />

这里我是采用了结合 json-schema 的约定用 ajv 做验证的方案

## 1. json-schema

json-schema 是一种描述 json 结构的 json 数据规范

```json
{
  "$schema": "http://json-schema.org/draft-04/schema#",
  "title": "book info",
  "description": "some information about book",
  "type": "object",
  "properties": {
    "id": {
      "description": "The unique identifier for a book",
      "type": "integer",
      "minimum": 1
    },
    "name": {
      "type": "string",
      "pattern": "^#([0-9a-fA-F]{6}$",
      "maxLength": 6,
      "minLength": 6
    },
    "price": {
      "type": "number",
      "multipleOf": 0.5,
      "maximum": 12.5,
      "exclusiveMaximum": true,
      "minimum": 2.5,
      "exclusiveMinimum": true
    },
    "tags": {
      "type": "array",
      "items": [
        {
          "type": "string",
          "minLength": 5
        },
        {
          "type": "number",
          "minimum": 10
        }
      ],
      "additionalItems": {
        "type": "string",
        "minLength": 2
      },
      "minItems": 1,
      "maxItems": 5,
      "uniqueItems": true
    }
  },
  "minProperties": 1,
  "maxProperties": 5,
  "required": ["id", "name", "price"]
}
```

关键字说明：

| 关键字           | 描述                                                                                                   |
| ---------------- | ------------------------------------------------------------------------------------------------------ |
| $schema          | 当前遵循的格式标准                                                                                     |
| title            | 一般用来进行简单的描述，可以省略                                                                       |
| description      | 一般是进行详细的描述信息，可以省略                                                                     |
| type             | 用于约束校验的 JSON 元素的数据类型，是 JSON 数据类型关键字定义的第一个约束条件：它必须是一个 JSON 对象 |
| properties       | 定义属性：定义各个键和它们的值类型，最小和最大值中要使用 JSON 文件                                     |
| required         | 必需属性，这个关键字是数组，数组中的元素必须是字符串                                                   |
| minimum          | 这是约束的值，并代表可接受的最小值                                                                     |
| exclusiveMinimum | 如果“exclusiveMinimum”的存在，并且具有布尔值 true 的实例是有效的，如果它是严格的最低限度的值           |
| maximum          | 这是约束的值被提上表示可接受的最大值                                                                   |
| exclusiveMaximum | 如果“exclusiveMaximum”的存在，并且具有布尔值 true 的实例是有效的，如果它是严格的值小于“最大”。         |
| multipleOf       | 数值实例有效反对“multipleOf”分工的实例此关键字的值，如果结果是一个整数。                               |
| maxLength        | 字符串实例的长度被定义为字符的最大数目                                                                 |
| minLength        | 字符串实例的长度被定义为字符的最小数目                                                                 |
| pattern          | 正则表达式                                                                                             |

我们在 src/common 下新建 apiJsonSchema 目录, 用户存放接口的 JsonSchema 文件. 在 apiJsonSchema 新建 system/auth 目录, 在 auth 下新建 register.ts, 用于存放 register 接口的参数校验 JsonSchema

```ts
// src/common/apiJsonSchema/system/auth/register
export default {
  type: 'object', // 数据类型为json
  required: ['password', 'userName', 'email', 'code'], // 必填项
  properties: {
    // 字段的校验
    code: {
      type: 'string',
      maxLength: 6,
      minLength: 6,
    },
    password: {
      type: 'string',
      maxLength: 255,
      minLength: 6,
    },
    userName: {
      type: 'string',
      maxLength: 255,
      minLength: 4,
    },
    email: {
      type: 'string',
      pattern: '^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(.[a-zA-Z0-9_-]+)+$',
    },
  },
}
```

更多细节可查询官方文档 <a href="http://json-schema.org/learn/getting-started-step-by-step.html">json-schema</a>

## 2. ajv

ajv 是基于 JSON-Schema 定义来对 JSON 格式进行校验的工具 <br />

官方示例：

```ts
const Ajv = require('ajv')
const ajv = new Ajv()

const schema = {
  type: 'object',
  properties: {
    foo: { type: 'integer' },
    bar: { type: 'string' },
  },
  required: ['foo'],
  additionalProperties: false,
}

const data = { foo: 1, bar: 'abc' }
const valid = ajv.validate(schema, data)
if (!valid) console.log(ajv.errors)
```

更多细节可查询官方文档 <a href="https://ajv.js.org/">ajv</a> <br />

ajv 封装： <br />

在 src/server 下新建 ajv 目录, 在 ajv 下新建 ajvConfig.ts, 用于存放配置文件

```ts
// src/server/ajv/ajvConfig.ts
import Config from '../../config/Config'

export default {
  allErrors: Config.IS_DEV, // 是否输出所有的错误（比较慢）
}
```

```ts
// src/config/Config.ts
export default class Config {
  // 是否是测试环境
  public static readonly IS_DEV = isDev
  ...
}
```

在 src/server/ajv 下新建 ajv.ts, 创建 ajv 实例

```ts
// src/server/ajv/ajv.ts
import Ajv from 'ajv'
import ajvConfig from './ajvConfig'
const ajv = new Ajv(ajvConfig)

export default ajv
```

在 src/server/ajv 下新建 index.ts, 用于封装常用方法和公共业务

```ts
// src/server/ajv/index.ts
import ajv from './ajv'
/**
 * json schema 校验
 * @param {Object} schema json schema 规则
 * @param {Object} data 待校验的数据
 */
export function validate(schema: object | string | boolean, data = {}) {
  const valid: boolean | PromiseLike<any> = ajv.validate(schema, data)
  if (!valid) {
    return ajv.errorsText()
  }
}
```

## 3. 参数校验中间件开发

在 src/middlewares 下新建 validator.ts

```ts
// src/middlewares/validator.ts
import { Models } from '../common/typings/model'
import { ParameterException } from '../core/HttpException'
import { validate } from '../server/ajv'

// 请求参数类型
type RequestDataType = 'query' | 'body'
/**
 * 数据校验中间件
 */
function validator(schema: string | boolean | object, type: RequestDataType = 'query') {
  return async function validator(ctx: Models.Ctx, next: Function) {
    const data = ctx.request[type]
    const errors = validate(schema, data) || null
    if (errors) {
      //校验失败
      throw new ParameterException(errors)
    }
    await next()
  }
}
export default validator
```

## 4. 使用校验中间件

在注册接口中使用参数校验中间件

```ts
// src/api/v1/system/auth/register.ts
import KoaRouter from 'koa-router'
import { Models } from '../../../../common/typings/model'
import { command } from '../../../../server/mysql'
import { ParameterException, Success } from '../../../../core/HttpException'
import { format } from '../../../../common/utils/date'
import Config from '../../../../config/Config'
import validator from '../../../../middlewares/validator'
import schema from '../../../../common/apiJsonSchema/system/auth/register'

const router = new KoaRouter({
  prefix: `${Config.API_PREFIX}v1/system/auth`,
})

router.post('/register', validator(schema, 'body'), async (ctx: Models.Ctx) => {
  const { password, userName, email, code } = ctx.request.body
  if (code !== ctx.session?.code) {
    throw new ParameterException('验证码错误')
  }
  const date = format(new Date())

  // 注册
  await command(`
        INSERT INTO user ( user_name, email, password, created_at, updated_at )
        VALUES
        ( '${userName}', '${email}', '${password}', '${date}', '${date}' );
    `)

  throw new Success()
})

export default router
```

## 5. 验证码校验中间件开发

验证码 code 的校验, 只需要 ctx.body.code 与 ctx.session.code 相等, 在逻辑上是独立的, 很适合抽离为中间件 <br />

在 src/middlewares 下新建 verificationCodeValidator.ts <br />

```ts
// src/middlewares/verificationCodeValidator.ts
import { Models } from '../common/typings/model'
import { ParameterException } from '../core/HttpException'

/**
 * 校验验证码
 * @param ctx
 * @param next
 */
export default async function verificationCodeValidator(ctx: Models.Ctx, next: Function) {
  const { code } = ctx.request.body
  if (ctx.session!.code !== code) {
    throw new ParameterException('验证码错误')
  } else {
    await next()
  }
}
```

在需要校验的接口里引入中间件

```ts
// src/api/v1/system/auth/register.ts
import KoaRouter from 'koa-router'
import { Models } from '../../../../common/typings/model'
import { command } from '../../../../server/mysql'
import { Success } from '../../../../core/HttpException'
import { format } from '../../../../common/utils/date'
import Config from '../../../../config/Config'
import validator from '../../../../middlewares/validator'
import schema from '../../../../common/apiJsonSchema/system/auth/register'
import verificationCodeValidator from '../../../../middlewares/verificationCodeValidator'

const router = new KoaRouter({
  prefix: `${Config.API_PREFIX}v1/system/auth`,
})

router.post('/register', validator(schema, 'body'), verificationCodeValidator, async (ctx: Models.Ctx) => {
  const { password, userName, email } = ctx.request.body
  const date = format(new Date())

  // 注册
  await command(`
        INSERT INTO user ( user_name, email, password, created_at, updated_at )
        VALUES
        ( '${userName}', '${email}', '${password}', '${date}', '${date}' );
    `)

  throw new Success()
})

export default router
```

# 四、用户登录

用户登录的意义, 在于从登录开始, 使客户端在一段时间内保持登录状态, 并使其它接口同样'拥有'这种状态 <br />

http 是无状态的, 本身是提供以上这种功能的, 因此我们需要额外通过代码去实现. <br />

## 1. 构建 token

token 是目前最流行的跨域身份验证解决方案. <br />

当客户端使用用户名/密码(即调用登录接口)向服务端请求认证, 服务端认证成功, 那么在服务端会生成并返回 token 给前端, 前端可以在每次请求的时候带上 token 证明自己的合法身份。如果这个 Token 在服务端持久化（比如存入数据库）, 那它就是一个永久的身份令牌. <br />

JWT, 全称是 json web token, 就是一种基于 token 的具体实现方式, 更多信息也查询官网<a href="https://jwt.io/">https://jwt.io/</a> <br />

在 src/server 下新建 auth 目录, 在 auth 下新建 index, 用于存放用户认证相关业务.

```ts
// src/server/auth/index.ts
import Config from '../../config/Config'
import JWT from 'jsonwebtoken'
import { AuthFailed, Forbbiden } from '../../core/HttpException'

// userId
type Uid = number

// 权限id
type Scope = string

/**
 * 构建token
 * @param uid 用户id
 * @param scope 权限
 * @returns
 */
export function generateToken(uid: Uid, scope: Scope) {
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
```

```ts
// src/config/Config.ts
export default class Config {
  // 安全配置
  public static readonly SECURITY = {
    // token key
    SECRET_KEY: 'learn-koa-ts',
    // 过期时间
    EXPIRES_IN: 60 * 60 * 24 * 0.5,
  }
}
```

## 2. 图片验证码

为了提高安全性, 防止恶意破解密码, 可以在登录时设置图形验证码 <br />

在 src/api/v1/system 下新建 commom 目录, 用户存放系统公共接口, 在 common 目录下新建 code.ts <br />

```ts
// src/api/v1/system/common/code.ts
import Router from 'koa-router'
import { Models } from '../../../../common/typings/model'
import svgCaptcha from 'svg-captcha'
import { Buffer } from '../../../../core/HttpException'
import Config from '../../../../config/Config'

const router = new Router({
  prefix: `${Config.API_PREFIX}v1/system/common`,
})
/*
 * 获取验证码
 * @return { image } 返回图片
 */
router.get('/code', async (ctx: Models.Ctx) => {
  const captcha: svgCaptcha.CaptchaObj = svgCaptcha.createMathExpr({
    size: 6, //验证码长度
    fontSize: 45, //验证码字号
    ignoreChars: '0o1i', // 过滤掉某些字符， 如 0o1i
    noise: 1, //干扰线条数目
    width: 100, //宽度
    // heigth:40,//高度
    color: true, //验证码字符是否有颜色，默认是没有，但是如果设置了背景颜色，那么默认就是有字符颜色
    background: '#cc9966', //背景大小
  })

  ctx.session!.code = captcha.text //把验证码赋值给session
  throw new Buffer(captcha.data, 'image/svg+xml', captcha.text)
})

export default router
```

这里我们使用了 svg-captcha 去生成图形验证码 <br />
svg-captcha 是一个流行的图形验证码工具库, 可以很轻松地生成 svg 格式的图形验证码, 更多参数可以访问其<a href="https://github.com/produck/svg-captcha#readme"> 主页 </a>

## 3. 登录接口开发

在校验参数格式和验证码后, 查询数据库, 判断用户名与密码是否正确, 如果正确则返回 token <br />
在 src/api/v1/system/auth 下新建 login.ts

```ts
// src/api/v1/system/auth/login.ts
import KoaRouter from 'koa-router'
import { Models } from '../../../../common/typings/model'
import { command } from '../../../../server/mysql'
import { ParameterException, QueryFailed, Success } from '../../../../core/HttpException'
import Config from '../../../../config/Config'
import validator from '../../../../middlewares/validator'
import schema from '../../../../common/apiJsonSchema/system/auth/login'
import verificationCodeValidator from '../../../../middlewares/verificationCodeValidator'
import { generateToken } from '../../../../server/auth'
import { Account } from '../../../../common/typings/account'

const router = new KoaRouter({
  prefix: `${Config.API_PREFIX}v1/system/auth`,
})

router.post('/login', validator(schema, 'body'), verificationCodeValidator, async (ctx: Models.Ctx) => {
  const { password, userName } = ctx.request.body
  const res: Models.Result = await command(`
        SELECT
        id,email,deleted,info,role_ids,password
        FROM
            system_user
        where
            user_name = '${userName}'
    `)
  if ((res.results as Account.User[]).length > 0) {
    const user = res.results[0]
    const token = getToken(user, password)
    throw new Success(token)
  } else {
    throw new QueryFailed('该用户名不存在')
  }
})

export default router

/**
 * 获取token
 * @param user
 * @param password
 * @returns
 */
function getToken(user: Account.User, password: string): string {
  if (user.password !== password) {
    throw new ParameterException('密码不正确')
  }
  return generateToken(user.id, user.roleIds)
}
```

## 4. token 校验中间件开发

在客户端登录后, 服务端会返回给客户端一个 token, 客户端会保留这个 token 并在后续请求中携带这个 token, 而服务端则尝试去解析这个 token, 如果成功则说明 token 有效, 并给与客户端对应的登录权限 <br />

在 src/middlewares 下新建 verifyToken.ts

```ts
// src/middlewares/verifyToken.ts
import { Models } from '../common/typings/model'
import Config from '../config/Config'
import { AuthFailed, Forbbiden } from '../core/HttpException'
import JWT from 'jsonwebtoken'
import { Account } from '../common/typings/account'

/**
 * 校验token是否合法
 * @param ctx
 * @param next
 */
export default async function verifyToken(ctx: Models.Ctx, next: Function) {
  // 获取token
  const userToken = getToken(ctx)
  if (!userToken) {
    throw new Forbbiden('无访问权限')
  }
  // 尝试解析token, 获取uid和scope
  const { uid, scope } = (await analyzeToken(userToken)) as Account.Decode

  // 在上下文保存uid和scope
  ctx.auth = {
    uid,
    scope,
  }
  await next()
}

/**
 * 获取token
 * @param ctx
 * @returns
 */
export function getToken(ctx: Models.Ctx): string {
  return ctx.header['authorization'] || ctx.cookies.get('authorization') || ''
}

/**
 * 解析token
 * @param token
 * @returns
 */
async function analyzeToken(token: string) {
  return new Promise((resolve, reject) => {
    JWT.verify(token, Config.SECURITY.SECRET_KEY, (error, decode) => {
      if (error) {
        reject(error)
      }
      resolve(decode)
    })
  }).catch((error) => {
    if (error.name === 'TokenExpiredError') {
      throw new AuthFailed('token已过期')
    }
    throw new Forbbiden('token不合法')
  })
}
```

## 5. 用户信息查询接口开发

用户信息查询接口很显然需要用户登录才能正常访问, 因此可以使用 token 校验中间件, 来验证当前访问的客户端是否已经登录 <br />

在 src/api/v1/system 下新建目录 user, 用户存放用户相关接口. 在 user 目录下新建 query.ts

```ts
// src/api/v1/system/user/query.ts

import KoaRouter from 'koa-router'
import { Models } from '../../../../common/typings/model'
import { command } from '../../../../server/mysql'
import { Success } from '../../../../core/HttpException'
import Config from '../../../../config/Config'
import verifyToken from '../../../../middlewares/verifyToken'

const router = new KoaRouter({
  prefix: `${Config.API_PREFIX}v1/system/user`,
})

router.get('/query', verifyToken, async (ctx: Models.Ctx) => {
  const { uid } = ctx.auth

  const res = await command(`
      select 
        user_name, role_ids, info, id
      from
        system_user
      where 
        id = ${uid}
    `)

  throw new Success(res.results[0])
})

export default router
```

# 五、退出登录

## 1. 如何实现退出登录

由于 token 保存在客户端, 当用户主动退出登录时, 只能在客户端去删除这个 token .但是这个 token 在过期之前依然有效. 因此本质上, 这种退出登录是一种"虚假"的退出. 且这种情况下, 服务端只能通过 token 是否能解析来判断 token 的有效性, 而不能判断 token 是否是由有效的签发机构(在这里就是指自己)所创建, 这显然有一定的安全隐患. 因此, 我们需要在服务端保存 token.

## 2. 通过 redis 保存 token

定义将 token 存在 redis 的 3 号数据库里

```ts
// src/config/Config.ts
export default class Config {
  // 安全配置
  public static readonly SECURITY = {
    // 存储token的redis数据库名
    TOKEN_REDIS_DB: 3,
  }
}
```

将 token 作为 key, userId 作为 value, 在 redis 中保存 token, 并记录过期时间, redis 会在过期时间自动删除过期记录

```ts
// src/server/redis/index.ts
/**
 * 保存token
 * @param key
 * @param uid
 * @returns
 */
export async function saveToken(key: string, uid: number): Promise<Models.Result> {
  return new Promise((resolve) => {
    redis.select(Config.SECURITY.TOKEN_REDIS_DB).then(() => {
      redis.setex(key, Config.SECURITY.EXPIRES_IN, uid).then((res) => {
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
```

在登录接口生成 token 时保存 token

```ts
// src/api/v1/system/auth/login.ts
router.post('/login', validator(schema, 'body'), verificationCodeValidator, async (ctx: Models.Ctx) => {
  ...
  if ((res.results as Account.User[]).length > 0) {
    const user = res.results[0]
    const token = getToken(user, password)
    saveToken(token, user.id)
    throw new Success(token)
  } else {
    throw new QueryFailed('该用户名不存在')
  }
})

```

## 3. 校验 token 签发机构

从 redis 中查询是否存在当前 token, 如果有, 则说明 token 是由自己签发的

```ts
// src/server/redis/index.ts
/**
 * 获取token的值
 * @param key
 * @returns
 */
export async function getTokenValue(key: string): Promise<Models.Result> {
  return new Promise((resolve) => {
    redis.select(Config.SECURITY.TOKEN_REDIS_DB).then(() => {
      redis.get(key).then((res) => {
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
```

修改 token 校验中间件, 校验 token 是否存在

```ts
// src/middlewares/verifyToken.ts
...
export default async function verifyToken(ctx: Models.Ctx, next: Function) {
  // 获取token
  const userToken = getToken(ctx)
  // 如果token不存在, 或者不存在redis里
  if (!userToken || !(await getTokenValue(userToken)).results) {
    throw new Forbbiden('无访问权限')
  }
  ...
}
```

## 3. 删除 token

在 src/server/redis/index.ts 创建 deleteToken 函数

```ts
// src/server/redis/index.ts
/**
 * 删除token
 * @param key
 * @returns
 */
export async function deleteToken(key: string): Promise<Models.Result> {
  return new Promise((resolve) => {
    redis.select(Config.SECURITY.TOKEN_REDIS_DB).then(() => {
      redis.del(key).then((res) => {
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
```

在 src/api/system/auth 下新建 logout.ts

```ts
// src/api/system/auth/logout.ts
import KoaRouter from 'koa-router'
import { Success } from '../../../../core/HttpException'
import Config from '../../../../config/Config'
import { Models } from '../../../../common/typings/model'
import { deleteToken } from '../../../../server/redis'
import verifyToken, { getToken } from '../../../../middlewares/verifyToken'

const router = new KoaRouter({
  prefix: `${Config.API_PREFIX}v1/system/auth`,
})

/*
 * 退出登录
 */
router.get('/logout', verifyToken, async (ctx: Models.Ctx) => {
  await deleteToken(getToken(ctx))
  throw new Success()
})

export default router
```

# 六、总结

本文从数据库创建开始, 对完整的注册和登录功能进行了设计和开发, 下一节将开始介绍权限管理控制的设计和开发<br />

本文的完整代码地址 <a href="https://github.com/fhtwl/koa-ts-learn/tree/step2"> github koa-ts-learn</a>
