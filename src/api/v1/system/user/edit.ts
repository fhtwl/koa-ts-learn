import { Models } from '../../../../common/typings/model'
import KoaRouter from 'koa-router'
import { Success } from '../../../../core/HttpException'
import validator from '../../../../middlewares/validator'
import Config from '../../../../config/Config'
import editUserById from '../../../../common/apiJsonSchema/system/user/editUserById'
import { verifyTokenPermission } from '../../../../middlewares/verifyToken'
import { command } from '../../../../server/mysql'
const router = new KoaRouter({
  prefix: `${Config.API_PREFIX}v1/system/user`,
})

router.post('/editUserById', verifyTokenPermission, validator(editUserById, 'body'), async (ctx: Models.Ctx) => {
  const { nickName, profile = '', avatar, roleId, id } = ctx.request.body
  const info = {
    nickName,
    profile,
    avatar,
  }
  await command(`
    UPDATE
      system_user
    SET info = '${JSON.stringify(info)}', role_id = ${roleId}
    WHERE id = ${id}
  `)

  throw new Success()
})

export default router
