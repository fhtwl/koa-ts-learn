import { Models } from '../common/typings/model'
import Config from '../config/Config'
import { AuthFailed, Forbbiden } from '../core/HttpException'
import JWT from 'jsonwebtoken'
import { Account } from '../common/typings/account'
import { getTokenValue } from '../server/auth/token'
import { getRedisUserPermission } from '../server/auth'

/**
 * 校验token是否合法
 * @param ctx
 * @param next
 * @param callback
 */
export default async function verifyToken(ctx: Models.Ctx, next: Function, callback?: Function) {
  // 获取token
  const userToken = getToken(ctx)
  // 如果token不存在, 或者不存在redis里
  if (!userToken || !(await getTokenValue(userToken)).results) {
    throw new Forbbiden('无访问权限')
  }
  // 尝试解析token, 获取uid和scope
  const { uid, scope } = (await analyzeToken(userToken)) as Account.Decode
  // 在上下文保存uid和scope
  ctx.auth = {
    uid,
    scope,
  }
  if (callback) {
    await callback({ uid, scope })
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

/**
 * 校验token权限
 * @param ctx
 * @param next
 */
export async function verifyTokenPermission(ctx: Models.Ctx, next: Function) {
  await verifyToken(ctx, next, async (decode: Account.Decode) => {
    const permissionList: string[] = await getRedisUserPermission(decode)

    const bool = permissionList.find((permission) => {
      const path = `${Config.API_PREFIX}v1/${permission.split(':').join('/')}`
      return path === ctx.path
    })
    if (!bool) {
      throw new Forbbiden('权限不足')
    }
  })
}
