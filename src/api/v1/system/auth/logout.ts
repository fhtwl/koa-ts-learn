import KoaRouter from 'koa-router'
import { Success } from '../../../../core/HttpException'
import Config from '../../../../config/Config'
import { Models } from '../../../../common/typings/model'
import { deleteToken } from '../../../../server/redis'
import verifyToken, { getToken } from '../../../../middlewares/verifyToken'

const router = new KoaRouter({
  prefix: `${Config.API_PREFIX}v1/system/auth`,
})

/*
 * 退出登录
 */
router.get('/logout', verifyToken, async (ctx: Models.Ctx) => {
  await deleteToken(getToken(ctx))
  throw new Success()
})

export default router
