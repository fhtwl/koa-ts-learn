import HttpCode, { CODE } from './code'

// http异常
export class HttpException extends Error {
  public message: string
  public errorCode: number
  public code: number
  public data: any
  public isBuffer = false
  public responseType: string | undefined
  constructor(data?: unknown, msg = '服务器异常，请联系管理员', errorCode = 10000, code = 400) {
    super()
    this.message = msg
    this.errorCode = errorCode
    this.code = code
    this.data = data
  }
}
// http参数异常
export class ParameterException extends HttpException {
  constructor(msg?: string, errorCode?: CODE) {
    super()
    this.code = 200
    this.message = msg || HttpCode.getMessage(CODE.CODE_11001 || errorCode)
    this.errorCode = CODE.CODE_11001
  }
}

// http请求成功
export class Success extends HttpException {
  public data
  public responseType
  public session
  constructor(data?: any, msg = 'ok', code = 200, errorCode = 10000, responseType?: string, session?: string) {
    super()
    this.code = code //200查询成功，201操作成功
    this.message = msg
    this.errorCode = errorCode
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
    this.code = 200 //200查询成功，201操作成功
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

// 数据库出错
export class DataBaseFailed extends HttpException {
  constructor(msg?: string, errorCode?: number) {
    super()
    this.code = 500
    this.message = msg || '数据库出错'
    this.errorCode = errorCode || 100005
  }
}
