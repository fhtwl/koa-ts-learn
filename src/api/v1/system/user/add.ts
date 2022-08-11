import { Models } from '../../../../common/typings/model'
import KoaRouter from 'koa-router'
import { Success } from '../../../../core/HttpException'
import validator from '../../../../middlewares/validator'
import Config from '../../../../config/Config'
import add from '../../../../common/apiJsonSchema/system/user/add'
import { verifyTokenPermission } from '../../../../middlewares/verifyToken'
import { command } from '../../../../server/mysql'
import { format } from '../../../../common/utils/date'
const router = new KoaRouter({
  prefix: `${Config.API_PREFIX}v1/system/user`,
})

router.post('/add', verifyTokenPermission, validator(add, 'body'), async (ctx: Models.Ctx) => {
  const { userName, roleIds, info, email, password } = ctx.request.body
  const date = format(new Date())
  await command(`
  INSERT INTO system_user ( user_name, role_ids, info, email, password, created_at, updated_at )
    VALUES
    ( '${userName}', ${roleIds}, '${info}', ${email}, ${password}, '${date}', '${date}' );
  `)

  throw new Success()
})

export default router
