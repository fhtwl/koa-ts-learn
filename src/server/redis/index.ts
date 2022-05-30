import { Models } from '../../common/typings/model'
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
