import { Models } from '../common/typings/model'
import { Success, HttpException, Buffer } from '../core/HttpException'
import { infoLog, errorLog } from '../server/logs'
export default async function catchError(ctx: Models.Ctx, next: Function) {
  try {
    await next()
  } catch (error: any) {
    // 当前错误是否是我们自定义的Http错误
    const isHttpException = error instanceof HttpException

    // 如果不是, 则抛出错误
    if (!isHttpException) {
      errorLog(ctx, error)
      const { method, path } = ctx
      ctx.body = {
        msg: '未知错误',
        errorCode: 9999,
        requestUrl: `${method} ${path}`,
      }
      ctx.status = 500
    }
    // 如果是已知错误
    else {
      // 根据给error设置的相应类型设置相应数据类型
      if (error.responseType) {
        ctx.response.type = error.responseType
      }
      // 如果是文件流，则直接返回文件
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
      if (error instanceof Success || error instanceof Buffer) {
        infoLog(ctx)
      } else {
        errorLog(ctx, error)
      }
    }
  }
}
