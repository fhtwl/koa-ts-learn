import KoaRouter from 'koa-router'
import { Models } from '../../../../common/typings/model'
import { command } from '../../../../server/mysql'
import { ParameterException, QueryFailed, Success } from '../../../../core/HttpException'
import Config from '../../../../config/Config'
import validator from '../../../../middlewares/validator'
import schema from '../../../../common/apiJsonSchema/system/auth/login'
import verificationCodeValidator from '../../../../middlewares/verificationCodeValidator'
import { generateToken } from '../../../../server/auth'
import { Account } from '../../../../common/typings/account'
import { saveToken } from '../../../../server/redis'

const router = new KoaRouter({
  prefix: `${Config.API_PREFIX}v1/system/auth`,
})

router.post('/login', validator(schema, 'body'), verificationCodeValidator, async (ctx: Models.Ctx) => {
  const { password, userName } = ctx.request.body
  const res: Models.Result = await command(`
        SELECT
        id,email,deleted,info,role_ids,password
        FROM
            system_user
        where
            user_name = '${userName}'
    `)
  if ((res.results as Account.User[]).length > 0) {
    const user = res.results[0]
    const token = getToken(user, password)
    saveToken(token, user.id)
    throw new Success(token)
  } else {
    throw new QueryFailed('该用户名不存在')
  }
})

export default router

/**
 * 获取token
 * @param user
 * @param password
 * @returns
 */
function getToken(user: Account.User, password: string): string {
  if (user.password !== password) {
    throw new ParameterException('密码不正确')
  }
  return generateToken(user.id, user.roleIds)
}
