import Router from 'koa-router'
import { LowCode } from '../../../../common/typings/lowCode'
import { Success } from '../../../../core/HttpException'
import { verifyTokenPermission } from '../../../../middlewares/verifyToken'
import validator from '../../../../middlewares/validator'
import { command } from '../../../../server/mysql'
import getBoardAndCategoryListByParentId from '../../../../common/apiJsonSchema/lowCode/boardCategoryManager/getBoardAndCategoryListByParentId'
import { lineToHumpObject } from '../../../../common/utils/utils'
import { getPagination } from '../../../../common/utils/result'
import Config from '../../../../config/Config'

const router = new Router({
  prefix: `${Config.API_PREFIX}v1/lowCode/boardCategoryManager`,
})

/*
 * 查看当前路径下看板和分类
 * @return
 */
router.post('/list', verifyTokenPermission, validator(getBoardAndCategoryListByParentId, 'body'), async (ctx) => {
  const { params, pageNum, pageSize } = ctx.request.body
  const { name = '', parentId = '' } = params
  const { list: boardList, total: boardTotal } = await getList('lowcode_board', pageNum, pageSize, parentId, name)
  const { list: categoryList, total: categoryTotal } = await getList(
    'lowcode_board_category',
    pageNum,
    pageSize,
    parentId,
    name
  )

  const records = [
    ...categoryList.map((item) => {
      return { ...item, type: 2 }
    }),
    ...boardList.map((item) => {
      return { ...item, type: 1 }
    }),
  ]

  const data = getPagination(records, boardTotal + categoryTotal, pageSize, pageNum)
  throw new Success(data)
})

export default router

async function getList(tableName: string, pageNum: number, pageSize: number, parentId?: number, name = '') {
  const parentIdStr = `parent_id = ${parentId}`
  const nameStr = name ? `And name LIKE '%${name}%'` : ''
  const res = (
    await command(`
    (
      SELECT
        *
      FROM
        ${tableName}
      WHERE
        ${parentIdStr}
        ${nameStr}
        LIMIT ${(pageNum - 1) * pageSize}, ${pageSize}
    )
      ORDER BY
        updated_at DESC;
      SELECT
        count(*) FROM ${tableName};
  `)
  ).results
  const list: LowCode.Board[] = []
  for (const key in res[0]) {
    list.push(res[0][key])
  }
  const total: number = res[1][0]['count(*)']
  return {
    list: list.map(lineToHumpObject),
    total,
  }
}
