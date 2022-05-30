import { Models } from '../../../../common/typings/model'
import KoaRouter from 'koa-router'
import { lineToHumpObject } from '../../../../common/utils/utils'
import Config from '../../../../config/Config'
import { verifyTokenPermission } from '../../../../middlewares/verifyToken'
import { command } from '../../../../server/mysql'
import { Account } from '../../../../common/typings/account'
import { getPagination } from '../../../../common/utils/result'
import { Success } from '../../../../core/HttpException'
const router = new KoaRouter({
  prefix: `${Config.API_PREFIX}v1/system/user`,
})

router.post('/list', verifyTokenPermission, async (ctx: Models.Ctx) => {
  const {
    // params,
    pageNum,
    pageSize,
  } = ctx.request.body as unknown as Models.BasePaginationQuery

  // roleId 字段，角色，与权限相关
  const res = (
    await command(`
    (
      SELECT
        u.id,
        u.info,
        u.updated_at,
        r.id roleId,
        r.name roleName
      FROM
        system_user as u,
        system_role as r
      WHERE
        u.deleted = 0
      AND
        FIND_IN_SET(r.id , u.role_ids)
        LIMIT ${pageNum - 1}, ${pageSize}
      )
      ORDER BY
        updated_at DESC;
      SELECT FOUND_ROWS() as total;
  `)
  ).results
  const total: number = res[1][0].total
  const list: Account.User[] = []
  for (const key in res[0]) {
    list.push(res[0][key])
  }
  const data = getPagination(
    list.map((item) => {
      item.info = JSON.parse(item.info as unknown as string)
      return lineToHumpObject(item)
    }),
    total,
    pageSize,
    pageNum
  )
  throw new Success(data)
})

export default router
