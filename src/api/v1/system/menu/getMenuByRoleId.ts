import { Models } from '../../../../common/typings/model'
import KoaRouter from 'koa-router'
import { Success } from '../../../../core/HttpException'
import { lineToHumpObject } from '../../../../common/utils/utils'
import { Menu } from '../../../../common/typings/menu'
import Config from '../../../../config/Config'
import verifyToken from '../../../../middlewares/verifyToken'
import { command } from '../../../../server/mysql'

const router = new KoaRouter({
  prefix: `${Config.API_PREFIX}v1/system/menu`,
})

router.get('/getMenuByRoleId', verifyToken, async (ctx: Models.Ctx) => {
  const { id } = ctx.request.query
  const res = (
    await command(`
  (
    SELECT
      permissions id
    FROM
      system_role
    WHERE
      id = ${id}

  )
  ORDER BY
    updated_at DESC;
`)
  ).results.map(lineToHumpObject) as Menu.Menu[]

  throw new Success(res.map((item) => item.id))
})

export default router
