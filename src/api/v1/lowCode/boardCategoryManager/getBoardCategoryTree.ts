import Router from 'koa-router'
import { Success } from '../../../../core/HttpException'
import { command } from '../../../../server/mysql'
import { getTreeByList } from '../../../../common/utils/utils'
import Config from '../../../../config/Config'
import verifyToken from '../../../../middlewares/verifyToken'

const router = new Router({
  prefix: `${Config.API_PREFIX}v1/lowCode/boardCategoryManager`,
})

/*
 * 获取分类树形结构
 * @return
 */
router.get('/getBoardCategoryTree', verifyToken, async () => {
  const rootId = 0
  const name = `getBoardCategoryChildList(${rootId})`
  const res = await command(`
    SELECT
      *
    FROM
      lowcode_board_category
    WHERE
      FIND_IN_SET(
        id,
        ${name}
      )
  `)
  // const list = res.results[0][name].split(',')
  throw new Success(getTreeByList(res.results, 0))
})

export default router
