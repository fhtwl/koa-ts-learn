import Router from 'koa-router'
import { Models } from '../../../../common/typings/model'
import { Success } from '../../../../core/HttpException'
import { command } from '../../../../server/mysql'
import { verifyTokenPermission } from '../../../../middlewares/verifyToken'
import validator from '../../../../middlewares/validator'
import getComponentById from '../../../../common/apiJsonSchema/lowCode/component/getComponentById'

const router = new Router({
  prefix: '/api/v1/lowCode/component',
})

/*
 * 查询组件
 * @return
 */
router.get('/getComponentById', verifyTokenPermission, validator(getComponentById), async (ctx: Models.Ctx) => {
  const id = Number(ctx.request.query.id)
  const res = await command(`
  SELECT
    *
    FROM
      component
    WHERE
      id = ${id}
  `)
  throw new Success(res.results[0])
})

export default router
