# 使用 koa 将客户端的图片上传至七牛云

## 图片的上传与服务端存储与静态 web 托管

图片的上传和访问是一个很必要的功能. <br />

最直接最简单的文件上传功能, 是客户端上传图片时, 服务端读取文件流, 然后在服务器的某个目录下, 创建图片文件并将文件流写入, 即可完成图片的上传. <a href="https://www.npmjs.com/package/@koa/multer" >@koa/multer</a>就是基于此的官方 multer 中间件 <br />

客户端访问上传到服务端的图片, 需要服务端提供静态文件托管功能. 主要思路在于监听路由, 当请求路径以静态资源的后缀名结尾时, 则修改 content-type 为对用文件的格式, 即不再返回 json, 而是返回对用的文件.<a href="https://www.npmjs.com/package/koa-static">koa-static
</a>是 koa 中最常用的、较为成熟的 静态 web 托管服务中间件 <br />

很显然, 使用上述方案, 可以很轻松地图片的上传和访问功能, 但是有些缺点, 那就是上传的图片放在项目里, 代码仓库会存储大量变化的静态资源, 不利于版本管理, 上传和静态 web 托管服务和整个项目是耦合的, 不利于复用. <br />

使用一个独立的文件存储服务, 其它服务都可以将客户端上传的文件保存到这个文件存储服务里, 客户端也可以访问独立的这个文件存储服务, 可以比较完美地解决上述问题

## 七牛云

这里使用七牛云对象存储服务提供第三方的文件上传、存储和访问功能<br />

为了对上传的接口能够做到灵活的权限限制, 我们的上传流程设计如下:

1. 用户登录后, 在客户端使用 formData 将文件流上传到 web 服务器

2. web 服务器校验上传接口权限

3. web 服务器将文件上传至七牛云

4. 七牛云返回上传文件操作的返回值, 如在七牛云上的存储路径、文件名等

5. web 服务器将七牛云的文件信息, 如文件路径、文件大小等, 返回给客户端

6. 客户端接收到服务端的文件信息, 请求结束

### 解析 body

http 请求的报文主体(body)部分, 是以二进制数据的形式在网络中传输, 而 koa 本身并未集成对 body 的解析, 如果需要将 body 参数解析为键值对, 需要我们额外进行处理, <a href="https://www.npmjs.com/package/koa-body">koa-body</a>就是一个常用的帮助解析 http 中 body 内容的中间件, 包括 json、文本、文件、表单等. <br />

koa-body 主要是根据 content-type、encoding 判断请求类型和编码, 解析 body 数据, 然后将解析出来的键值对放在 ctx.request.body 或者 ctx.request.files 里 <br />

安装 koa-body

```sh
npm i koa-body
```

新建接口文件

```ts
// src/api/v1/system/common/upload/img.ts

import Router from 'koa-router'
import { Models } from '../../../../../common/typings/model'
import Config from '../../../../../config/Config'
import { Success } from '../../../../../core/HttpException'
import verifyToken from '../../../../../middlewares/verifyToken'
import formidable from 'formidable'

const router = new Router({
  prefix: `${Config.API_PREFIX}v1/system/common/upload`,
})

/*
 * 上传图片
 */
router.post('/img', verifyToken, async (ctx: Models.Ctx) => {
  const file = ctx.request.files?.img as unknown as formidable.File
})

export default router
```

### 封装七牛云

安装 七牛云 依赖

```
npm i qiniu

npm i @types/qiniu --save-dev
```

在 src/server 下, 新建 qiniu 目录, 在 qiniu 下新建 qiniuConfing.ts, 用于存放配置文件

```ts
// src/server/qiniu/qiniuConfig.ts

import Config from '../../config/Config'
export default {
  accessKey: Config.QINIU.AK,
  secretKey: Config.QINIU.SK,
  bucket: Config.QINIU.BUCKET, // 七牛云存储空间名
}
```

```ts
// src/config/Config.ts

export default class Config {
  ...
  // 七牛云配置
  public static readonly QINIU = {
    AK: 'xxxxx',
    SK: 'xxxxx',
    BUCKET: 'node-static', // 七牛云存储空间名
  }
}
```

在 src/server/qiniu 下, 新建 index.ts, 用于封装常用方法和公共业务

```ts
import qiniu from 'qiniu'
import formidable from 'formidable'
import qiniuConfig from './qiniuConfig'
interface RespBody {
  key: string
  hash: string
  size: number
  bucket: string
  mimeType: string
}

const { accessKey, secretKey, bucket } = qiniuConfig

const putPolicy = new qiniu.rs.PutPolicy({
  scope: bucket,
  // 上传成功后返回数据键值对参数设置
  returnBody: '{"key":"$(key)","hash":"$(etag)","size":$(fsize),"bucket":"$(bucket)", "mimeType":"$(mimeType)"}',
})

/**
 * 获取上传凭证
 * @returns
 */
export function updateToken() {
  const mac = new qiniu.auth.digest.Mac(accessKey, secretKey)
  return putPolicy.uploadToken(mac)
}

/**
 * 上传
 * @param file
 * @returns
 */
export async function upload(file: formidable.File): Promise<RespBody> {
  return new Promise((resolve, reject) => {
    const config: qiniu.conf.Config = new qiniu.conf.Config({
      useHttpsDomain: true, // 是否使用https域名
      useCdnDomain: true, // 上传是否使用cdn加速
    })
    const formUploader = new qiniu.form_up.FormUploader(config) //  生成表单上传的类
    const putExtra = new qiniu.form_up.PutExtra() //  生成表单提交额外参数
    formUploader.putFile(
      updateToken(),
      `upload/${file.originalFilename}`, // 默认上传到upload文件夹下
      file.filepath,
      putExtra,
      function (respErr, respBody, respInfo) {
        if (respErr) {
          console.log(respErr)
          reject(respErr)
        }
        if (respInfo.statusCode == 200) {
          resolve(respBody)
        } else {
          console.log(respInfo.statusCode)
          reject(respBody)
        }
      }
    )
  })
}
```

### 将文件上传到七牛云

```ts
// src/api/v1/system/common/upload/img.ts

import Router from 'koa-router'
import { Models } from '../../../../../common/typings/model'
import Config from '../../../../../config/Config'
import { Success } from '../../../../../core/HttpException'
import verifyToken from '../../../../../middlewares/verifyToken'
import { upload } from '../../../../../server/qiniu'
import formidable from 'formidable'

const router = new Router({
  prefix: `${Config.API_PREFIX}v1/system/common/upload`,
})

const resourcePath = '/resource/'

/*
 * 上传图片
 */
router.post('/img', verifyToken, async (ctx: Models.Ctx) => {
  const file = ctx.request.files?.img as unknown as formidable.File

  const res = await upload(file)

  throw new Success({
    path: `${resourcePath}${res.key}`,
    name: file.originalFilename,
    mimetype: file.mimetype,
    size: file.size,
  })
})

export default router
```
