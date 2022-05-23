import KoaRouter from 'koa-router'
import { Models } from '../../../../common/typings/model'
import { command } from '../../../../server/mysql'
import { Success } from '../../../../core/HttpException'
import Config from '../../../../config/Config'
import verifyToken from '../../../../middlewares/verifyToken'

const router = new KoaRouter({
  prefix: `${Config.API_PREFIX}v1/system/user`,
})

router.get('/query', verifyToken, async (ctx: Models.Ctx) => {
  const { uid } = ctx.auth

  const res = await command(`
      select 
        user_name, role_ids, info, id
      from
        system_user
      where 
        id = ${uid}
    `)

  throw new Success(res.results[0])
})

export default router
