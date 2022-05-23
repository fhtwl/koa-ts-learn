import Koa from 'koa'
import http from 'http'
import koaBodyParser from 'koa-bodyparser'
import path from 'path'
import { getAllFilesExport } from '../common/utils/utils'
import Router from 'koa-router'
import Config from '../config/Config'
import catchError from '../middlewares/catchError'
class Init {
  public static app: Koa<Koa.DefaultState, Koa.DefaultContext>
  public static server: http.Server
  public static initCore(app: Koa<Koa.DefaultState, Koa.DefaultContext>, server: http.Server) {
    Init.app = app
    Init.server = server
    Init.loadBodyParser()
    Init.initCatchError()
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

  // 错误监听和日志处理
  public static initCatchError() {
    Init.app.use(catchError)
  }
}

export default Init.initCore
