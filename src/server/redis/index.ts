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
