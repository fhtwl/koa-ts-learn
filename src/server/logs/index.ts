import logger from './logger'
import { Models } from '../../common/typings/model'

/**
 * 记录信息日志
 * @param ctx
 */
export function infoLog(ctx: Models.Ctx) {
  const { method, response, originalUrl } = ctx
  logger.info(method, response.status, originalUrl)
}

/**
 * 记录错误日志
 * @param ctx
 * @param error
 */
export function errorLog(ctx: Models.Ctx, error: any) {
  const { method, response, originalUrl } = ctx
  logger.error(method, response.status, originalUrl, error)
}
