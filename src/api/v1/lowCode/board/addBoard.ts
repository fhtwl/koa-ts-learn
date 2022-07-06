import Router from 'koa-router'
import { Models } from '../../../../common/typings/model'
import { Success } from '../../../../core/HttpException'
import { command } from '../../../../server/mysql'
import { verifyTokenPermission } from '../../../../middlewares/verifyToken'
import validator from '../../../../middlewares/validator'
import addBoardSchema from '../../../../common/apiJsonSchema/lowCode/board/add'
import { format } from '../../../../common/utils/date'
import Config from '../../../../config/Config'

const router = new Router({
  prefix: `${Config.API_PREFIX}v1/lowCode/board`,
})

/*
 * 新增看板
 * @return
 */
router.post('/addBoard', verifyTokenPermission, validator(addBoardSchema, 'body'), async (ctx: Models.Ctx) => {
  const { name, parentId, pageOperation } = ctx.request.body
  const userId = ctx.auth.uid
  const date = format(new Date())
  const res = await command(`
    INSERT INTO lowcode_board ( name, parent_id, page_operation, created_user_id,  created_at, updated_at )
          VALUES
          ( '${name}', ${parentId}, '${pageOperation}', ${userId} ,'${date}', '${date}' );
    SELECT
      b.id,
      b.name,
      b.parent_id,
      b.updated_at,
      u.user_name created_user
    FROM
      lowcode_board b,
      user u
    WHERE
      b.id = (SELECT LAST_INSERT_ID())
    AND
      u.id = b.created_user_id

  `)
  throw new Success(res.results[1][0])
})

export default router
