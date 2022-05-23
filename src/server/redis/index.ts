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

// /**
//  * 新增日志
//  * @param log
//  * @returns
//  */
// export async function addLog(log: string): Promise<Boolean> {
//   return new Promise((resolve) => {
//     selectDb(Config.LOGS.REDIS_DB_NAME).then(() => {
//       redis
//         .lpush(Config.LOGS.REDIS_KEY, Config.LOGS.EXPIRESIN, log)
//         .then(() => {
//           resolve(true)
//         })
//         .catch(redisCatch)
//     })
//   })
// }

// /**
//  * 获取最新的日志
//  * @param length 获取的条数
//  * @returns
//  */
// export async function getNewLogs(length: number): Promise<string[]> {
//   return new Promise((resolve) => {
//     selectDb(Config.LOGS.REDIS_DB_NAME).then(() => {
//       redis
//         .lrange(Config.LOGS.REDIS_KEY, 0, length)
//         .then((res) => {
//           resolve(res)
//         })
//         .catch(redisCatch)
//     })
//   })
// }
