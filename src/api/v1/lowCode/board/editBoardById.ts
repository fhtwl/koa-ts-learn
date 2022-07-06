import Router from 'koa-router'
import { Success } from '../../../../core/HttpException'
import { verifyTokenPermission } from '../../../../middlewares/verifyToken'
import validator from '../../../../middlewares/validator'
import { command } from '../../../../server/mysql'
import editBoardAttrById from '../../../../common/apiJsonSchema/lowCode/board/editBoardAttrById'
import editBoardPageById from '../../../../common/apiJsonSchema/lowCode/board/editBoardPageById'
import Config from '../../../../config/Config'

const router = new Router({
  prefix: `${Config.API_PREFIX}v1/lowCode/board`,
})

/*
 * 修改看板属性
 * @return
 */
router.post('/editBoardAttrById', verifyTokenPermission, validator(editBoardAttrById, 'body'), async (ctx) => {
  const { id, name, parentId } = ctx.request.body
  await command(`
    UPDATE
      lowcode_board
    SET name = "${name}", parent_id = ${parentId}
    WHERE id = ${id}
  `)
  throw new Success()
})

/*
 * 修改看板组件
 * @return
 */
router.post('/editBoardPageById', verifyTokenPermission, validator(editBoardPageById, 'body'), async (ctx) => {
  const { id, pageOperation } = ctx.request.body
  await command(`
    UPDATE
    lowcode_board
    SET page_operation = '${pageOperation}'
    WHERE id = ${id}
  `)
  throw new Success()
})

export default router
