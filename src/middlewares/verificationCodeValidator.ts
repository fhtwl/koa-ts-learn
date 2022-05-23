import { Models } from '../common/typings/model'
import { ParameterException } from '../core/HttpException'

/**
 * 校验验证码
 * @param ctx
 * @param next
 */
export default async function verificationCodeValidator(ctx: Models.Ctx, next: Function) {
  const { code } = ctx.request.body
  if (ctx.session!.code !== code) {
    throw new ParameterException('验证码错误')
  } else {
    await next()
  }
}
