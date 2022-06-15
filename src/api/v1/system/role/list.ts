import { Models } from '../../../../common/typings/model'
import Config from '../../../../config/Config'
import KoaRouter from 'koa-router'
import { Success } from '../../../../core/HttpException'
import { getTreeByList, lineToHumpObject, sort } from '../../../../common/utils/utils'
import { verifyTokenPermission } from '../../../../middlewares/verifyToken'
import { command } from '../../../../server/mysql'
import { getPagination } from '../../../../common/utils/result'
const router = new KoaRouter({
  prefix: `${Config.API_PREFIX}v1/system/role`,
})

router.post('/list', verifyTokenPermission, async (ctx: Models.Ctx) => {
  const { params, pageNum, pageSize } = ctx.request.body as unknown as Common.PaginationParams
  const { name = '' } = params
  const res = (
    await command(`
      (SELECT
        id,
        name,
        \`describe\`,
        updated_at,
        parent_id,
        serial_num,
        menu_ids
      FROM
      system_role
      where
        system_role.name like '%${name}%'
      )
      ORDER BY
      updated_at DESC;

  `)
  ).results.map(lineToHumpObject)
  const records = getTreeByList(res, 0)
  const total: number = records.length
  if (pageNum > 1) {
    records.splice((pageNum - 1) * pageSize, pageSize)
  }
  const each = (arr: Common.TreeNode[]) => {
    sort(arr, 'serialNum', 'desc')
    arr.forEach((item) => {
      if (item.children) {
        each(item.children)
      }
    })
  }
  each(records)
  const data = getPagination(records, total, pageSize, pageNum)
  throw new Success(data)
})

export default router
