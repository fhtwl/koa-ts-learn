import Router from 'koa-router'
import { Models } from '../../../../common/typings/model'
import { Success } from '../../../../core/HttpException'
import { command } from '../../../../server/mysql'
import { verifyTokenPermission } from '../../../../middlewares/verifyToken'
import validator from '../../../../middlewares/validator'
import getBoardById from '../../../../common/apiJsonSchema/lowCode/board/query'
import Config from '../../../../config/Config'

const router = new Router({
  prefix: `${Config.API_PREFIX}v1/lowCode/board`,
})

/*
 * 查询看板
 * @return
 */
router.get('/query', verifyTokenPermission, validator(getBoardById), async (ctx: Models.Ctx) => {
  const id = Number(ctx.request.query.id)
  const res = await command(`
  SELECT
    *
    FROM
      lowcode_board
    WHERE
      id = ${id}
  `)
  throw new Success(res.results[0])
})

export default router
