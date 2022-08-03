import Router from 'koa-router'
import { Models } from '../../../../common/typings/model'
import { Success } from '../../../../core/HttpException'
import { command } from '../../../../server/mysql'
import { verifyTokenPermission } from '../../../../middlewares/verifyToken'
import validator from '../../../../middlewares/validator'
import addComponent from '../../../../common/apiJsonSchema/lowCode/component/addComponent'
import { format } from '../../../../common/utils/date'

const router = new Router({
  prefix: '/api/v1/lowCode/component',
})

/*
 * 新增看板
 * @return
 */
router.post('/add', verifyTokenPermission, validator(addComponent, 'body'), async (ctx: Models.Ctx) => {
  const { name, parentId, chartAxisData, chartStyle, chartType } = ctx.request.body
  const userId = ctx.auth.uid
  const date = format(new Date())
  const res = await command(`
    INSERT INTO component ( name, parent_id, chart_axis_data, chart_style, chart_type, created_user_id,  created_at, updated_at )
          VALUES
          ( '${name}', ${parentId}, '${chartAxisData}', '${chartStyle}', ${chartType} ${userId} ,'${date}', '${date}' );
    SELECT
      b.id,
      b.name,
      b.parent_id,
      b.updated_at,
      u.user_name created_user
    FROM
      lowcode_component b,
      system_user u
    WHERE
      b.id = (SELECT LAST_INSERT_ID())
    AND
      u.id = b.created_user_id

  `)
  throw new Success(res.results[1][0])
})

export default router
