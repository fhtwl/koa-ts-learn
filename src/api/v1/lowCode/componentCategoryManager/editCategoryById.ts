import Router from 'koa-router'
import { Success } from '../../../../core/HttpException'
import { verifyTokenPermission } from '../../../../middlewares/verifyToken'
import validator from '../../../../middlewares/validator'
import { command } from '../../../../server/mysql'
import editComponentAttrById from '../../../../common/apiJsonSchema/lowCode/component/editComponentAttrById'

const router = new Router({
  prefix: '/api/v1/lowCode/componentCategoryManager',
})

/*
 * 修改仪表盘分类属性
 * @return
 */
router.post('/editCategoryById', verifyTokenPermission, validator(editComponentAttrById, 'body'), async (ctx) => {
  const { id, name, parentId } = ctx.request.body
  await command(`
    UPDATE
      component_category
    SET name = "${name}", parent_id = ${parentId}
    WHERE id = ${id}
  `)
  throw new Success()
})

export default router
