import Router from 'koa-router'
import { Success } from '../../../../core/HttpException'
import { verifyTokenPermission } from '../../../../middlewares/verifyToken'
import validator from '../../../../middlewares/validator'
import { command } from '../../../../server/mysql'
import editBoardAttrById from '../../../../common/apiJsonSchema/lowCode/board/editBoardAttrById'
import Config from '../../../../config/Config'

const router = new Router({
  prefix: `${Config.API_PREFIX}v1/lowCode/boardCategoryManager`,
})

/*
 * 修改仪表盘分类属性
 * @return
 */
router.post('/editAttr', verifyTokenPermission, validator(editBoardAttrById, 'body'), async (ctx) => {
  const { id, name, parentId, type } = ctx.request.body
  const tableName = type === 1 ? 'board' : 'lowcode_board_category'
  await command(`
    UPDATE
      ${tableName}
    SET name = "${name}", parent_id = ${parentId}
    WHERE id = ${id}
  `)
  throw new Success()
})

export default router
