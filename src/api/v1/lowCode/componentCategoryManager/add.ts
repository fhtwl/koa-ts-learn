import Router from 'koa-router'
import { Models } from '../../../../common/typings/model'
import { Success } from '../../../../core/HttpException'
import { command } from '../../../../server/mysql'
import { verifyTokenPermission } from '../../../../middlewares/verifyToken'
import validator from '../../../../middlewares/validator'
import addComponent from '../../../../common/apiJsonSchema/lowCode/component/addComponent'
import { format } from '../../../../common/utils/date'

const router = new Router({
  prefix: '/api/v1/lowCode/componentCategoryManager',
})

/*
 * 新增组件和分类
 * @return
 */
router.post('/add', verifyTokenPermission, validator(addComponent, 'body'), async (ctx: Models.Ctx) => {
  const { name, parentId, setting, chartType, type } = ctx.request.body
  const tableName = type === 1 ? 'lowcode_component' : 'lowcode_component_category'
  const userId = ctx.auth.uid
  const date = format(new Date())
  const names = `name, parent_id, ${type === 1 ? 'setting, chart_type,' : ''} created_user_id,  created_at, updated_at`
  const value = type === 1 ? `${setting}', '${chartType}',` : ''
  const values = `'${name}', ${parentId}, ${value} ${userId} ,'${date}', '${date}'`
  const res = await command(`
    INSERT INTO component ( ${names} )
          VALUES
          ( ${values} );
    SELECT
      b.id,
      b.name,
      b.parent_id,
      b.updated_at,
      u.user_name created_user
    FROM
      ${tableName} b,
      system_user u
    WHERE
      b.id = (SELECT LAST_INSERT_ID())
    AND
      u.id = b.created_user_id

  `)
  throw new Success(res.results[1][0])
})

export default router
