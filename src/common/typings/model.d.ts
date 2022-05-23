import Koa from 'koa'
import mysql from 'mysql'
export namespace Models {
  type Ctx = Koa.Context

  // mysql相关错误
  interface MysqlError {
    msg: string
    error?: mysql.MysqlError
  }

  // mysql 连接数据库返回值
  interface Result {
    /** `state===1`时为成功 */
    state: number
    /** 结果数组 或 对象 */
    results: any
    /** 状态 */
    fields?: Array<mysql.FieldInfo>
    /** 错误信息 */
    error?: mysql.MysqlError
    /** 描述信息 */
    msg: string
  }
}
