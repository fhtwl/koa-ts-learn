import { Models } from '../../../../common/typings/model'
import KoaRouter from 'koa-router'
import { lineToHumpObject } from '../../../../common/utils/utils'
import Config from '../../../../config/Config'
import { verifyTokenPermission } from '../../../../middlewares/verifyToken'
import { command } from '../../../../server/mysql'
import { getPagination } from '../../../../common/utils/result'
import { Success } from '../../../../core/HttpException'
const router = new KoaRouter({
  prefix: `${Config.API_PREFIX}v1/system/user`,
})

interface RetUser extends System.User {
  roleNames?: string
}

router.post('/list', verifyTokenPermission, async (ctx: Models.Ctx) => {
  const {
    // params,
    pageNum,
    pageSize,
  } = ctx.request.body as unknown as Common.PaginationParams

  // roleId 字段，角色，与权限相关
  const res = (
    await command(`
    (
      SELECT
        u.id,
        u.info,
        u.updated_at,
        u.role_ids,
        u.email,
        u.user_name,
        r.name roleNames
      FROM
        system_user as u,
        system_role as r
      WHERE
        u.deleted = 0
        AND FIND_IN_SET(r.id , u.role_ids)
        LIMIT ${pageNum - 1}, ${pageSize}
      )
      ORDER BY
        updated_at DESC;
      SELECT FOUND_ROWS() as total;
  `)
  ).results
  const total: number = res[1][0].total
  const list: RetUser[] = []
  for (const key in res[0]) {
    const xItem = res[0][key]
    const oldItem = list.find((item) => item.id === xItem.id)
    if (oldItem) {
      oldItem.roleNames = `${oldItem.roleNames},${xItem.roleNames}`
    } else {
      list.push(xItem)
    }
  }
  const data = getPagination(
    list.map((item) => {
      item.info = JSON.parse(item.info as unknown as string)
      return lineToHumpObject({ ...item, roleIds: undefined })
    }),
    total,
    pageSize,
    pageNum
  )
  throw new Success(data)
})

export default router
