import { Models } from '../../../../common/typings/model'
import KoaRouter from 'koa-router'
import validator from '../../../../middlewares/validator'
import Config from '../../../../config/Config'
import editBase from '../../../../common/apiJsonSchema/system/user/editBase'
import { verifyTokenPermission } from '../../../../middlewares/verifyToken'
import { command } from '../../../../server/mysql'
import { Success } from '../../../../core/HttpException'
const router = new KoaRouter({
  prefix: `${Config.API_PREFIX}v1/system/user`,
})

/**
 * 更新用户详情
 */
router.post('/editBase', verifyTokenPermission, validator(editBase, 'body'), async (ctx: Models.Ctx) => {
  const id = ctx.auth?.uid
  const { nickName, profile, avatar } = ctx.request.body
  const info = {
    nickName,
    profile,
    avatar,
  }
  await command(`
        UPDATE
        system_user
        SET info = '${JSON.stringify(info)}'
        WHERE id = ${id}
    `)
  throw new Success()
})

export default router
