import Router from 'koa-router'
import { LowCode } from '../../../../common/typings/lowCode'
import { Success } from '../../../../core/HttpException'
import { verifyTokenPermission } from '../../../../middlewares/verifyToken'
import validator from '../../../../middlewares/validator'
import { command } from '../../../../server/mysql'
import getListByParentId from '../../../../common/apiJsonSchema/lowCode/componentCategoryManager/list'
import { lineToHumpObject } from '../../../../common/utils/utils'
import { getPagination } from '../../../../common/utils/result'
import Config from '../../../../config/Config'

const router = new Router({
  prefix: `${Config.API_PREFIX}v1/lowCode/componentCategoryManager`,
})

/*
 * 查看当前路径下组件和分类
 * @return
 */
router.post('/list', verifyTokenPermission, validator(getListByParentId, 'body'), async (ctx) => {
  const { params, pageNum, pageSize } = ctx.request.body
  const { name = '', parentId = '' } = params
  const { list: componentList, total: componentTotal } = await getList(
    'lowcode_component',
    pageNum,
    pageSize,
    parentId,
    name
  )
  const { list: categoryList, total: categoryTotal } = await getList(
    'lowcode_component_category',
    pageNum,
    pageSize,
    parentId,
    name
  )

  const records = [
    ...categoryList.map((item) => {
      return { ...item, type: 2 }
    }),
    ...componentList.map((item) => {
      return { ...item, type: 1 }
    }),
  ]

  const data = getPagination(records, componentTotal + categoryTotal, pageSize, pageNum)
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
        LIMIT ${pageNum - 1}, ${pageSize}
    )
      ORDER BY
        updated_at DESC;
      SELECT
        count(*) FROM ${tableName};
  `)
  ).results
  const list: LowCode.Component[] = []
  for (const key in res[0]) {
    list.push(res[0][key])
  }
  const total: number = res[1][0]['count(*)']
  return {
    list: list.map(lineToHumpObject),
    total,
  }
}
