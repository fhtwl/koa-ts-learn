import Koa from 'koa'
import http from 'http'
import koaBody from 'koa-body'
import path from 'path'
import { getAllFilesExport } from '../common/utils/utils'
import Router from 'koa-router'
import Config from '../config/Config'
import catchError from '../middlewares/catchError'
import session from 'koa-session'
import { updateRedisRole } from '../server/auth'
import { initPlugin } from '../plugin/index'
class Init {
  public static app: Koa<Koa.DefaultState, Koa.DefaultContext>
  public static server: http.Server
  public static initCore(app: Koa<Koa.DefaultState, Koa.DefaultContext>, server: http.Server) {
    Init.app = app
    Init.server = server
    Init.loadBodyParser()
    Init.initCatchError()
    Init.loadSession()
    Init.initLoadRouters()
    Init.updateRedisRole()
    Init.initPlugin()
  }

  // 解析body参数
  public static loadBodyParser() {
    Init.app.use(
      koaBody({
        multipart: true, // 支持文件上传
        // encoding: 'gzip',
        formidable: {
          maxFieldsSize: 2 * 1024 * 1024, // 最大文件为2兆
          keepExtensions: true, // 保持文件的后缀
        },
      })
    )
  }

  // http路由加载
  static async initLoadRouters() {
    const dirPath = path.join(`${process.cwd()}/${Config.BASE}/api/`)
    getAllFilesExport(dirPath, (file: Router) => {
      Init.app.use(file.routes())
    })
  }

  // 错误监听和日志处理
  public static initCatchError() {
    Init.app.use(catchError)
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

  // 更新redis里的角色数据
  public static updateRedisRole() {
    !Config.IS_DEV && updateRedisRole()
  }

  public static initPlugin() {
    initPlugin({
      pluginNames: ['WebSocket'],
      app: Init.app,
      server: Init.server,
    })
  }
}

export default Init.initCore
