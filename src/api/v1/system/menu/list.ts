import { Models } from '../../../../common/typings/model'
import KoaRouter from 'koa-router'
import { Success } from '../../../../core/HttpException'
import { lineToHumpObject, getTreeByList, sort } from '../../../../common/utils/utils'
import Config from '../../../../config/Config'
import { verifyTokenPermission } from '../../../../middlewares/verifyToken'
import { command } from '../../../../server/mysql'
import { getPagination } from '../../../../common/utils/result'

const router = new KoaRouter({
  prefix: `${Config.API_PREFIX}v1/system/menu`,
})

router.post('/list', verifyTokenPermission, async (ctx: Models.Ctx) => {
  const {
    // params,
    pageNum,
    pageSize,
  } = ctx.request.body as unknown as Common.PaginationParams

  const res = (
    await command(`
  (
    SELECT
      m.id,
      m.name,
      m.updated_at,
      m.parent_id,
      m.\`show\`,
      m.icon,
      m.serial_num,
      m.component,
      m.permission,
      m.type,
      m.path
    FROM
      system_menu m

  )
  ORDER BY
    updated_at DESC;
`)
  ).results.map(lineToHumpObject) as System.Menu[]

  const records = getTreeByList(res, 0)
  const total: number = records.length
  if (pageNum > 1) {
    records.splice((pageNum - 1) * pageSize, pageSize)
  }
  const each = (arr: Common.TreeNode[]) => {
    sort(arr, 'serialNum', 'desc')
    arr.forEach((item) => {
      // item.children = item.actions
      //   ? JSON.parse(item.actions).map((button: Models.TreeNode) => {
      //       return {
      //         ...button,
      //         permission: button.id,
      //       }
      //     })
      //   : item.children
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
