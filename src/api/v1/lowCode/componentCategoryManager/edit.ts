import Router from 'koa-router'
import { Success } from '../../../../core/HttpException'
import { verifyTokenPermission } from '../../../../middlewares/verifyToken'
import validator from '../../../../middlewares/validator'
import { command } from '../../../../server/mysql'
import editComponentAttrById from '../../../../common/apiJsonSchema/lowCode/component/editComponentAttrById'

const router = new Router({
  prefix: '/api/v1/lowCode/component',
})

/*
 * 修改看板属性
 * @return
 */
router.post('/edit', verifyTokenPermission, validator(editComponentAttrById, 'body'), async (ctx) => {
  const { id, name, parentId } = ctx.request.body
  await command(`
    UPDATE
    lowcode_component
    SET name = "${name}", parent_id = ${parentId}
    WHERE id = ${id}
  `)
  throw new Success()
})

export default router
