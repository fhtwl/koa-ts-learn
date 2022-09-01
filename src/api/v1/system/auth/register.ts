import KoaRouter from 'koa-router'
import { Models } from '../../../../common/typings/model'
import { command } from '../../../../server/mysql'
import { Success } from '../../../../core/HttpException'
import { format } from '../../../../common/utils/date'
import Config from '../../../../config/Config'
import validator from '../../../../middlewares/validator'
import schema from '../../../../common/apiJsonSchema/system/auth/register'
import verificationCodeValidator from '../../../../middlewares/verificationCodeValidator'

const router = new KoaRouter({
  prefix: `${Config.API_PREFIX}v1/system/auth`,
})

router.post('/register', validator(schema, 'body'), verificationCodeValidator, async (ctx: Models.Ctx) => {
  const { password, userName, email } = ctx.request.body
  const date = format(new Date())

  // 注册
  await command(`
        INSERT INTO system_user ( user_name, email, password, role_ids, created_at, updated_at )
        VALUES
        ( '${userName}', '${email}', '${password}', '2', '${date}', '${date}' );
    `)

  throw new Success()
})

export default router
