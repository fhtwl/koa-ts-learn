import KoaRouter from 'koa-router'
import { getTreeByList, lineToHumpObject, sort } from '../../../../common/utils/utils'
import Config from '../../../../config/Config'
import { command } from '../../../../server/mysql'
import { Success } from '../../../../core/HttpException'
import verifyToken from '../../../../middlewares/verifyToken'
const router = new KoaRouter({
  prefix: `${Config.API_PREFIX}v1/system/role`,
})

router.get('/getRoleMap', verifyToken, async () => {
  const res = (
    await command(`
      (SELECT
        id,
        name,
        \`describe\`,
        updated_at,
        parent_id,
        serial_num
      FROM
        system_role)
      ORDER BY
      updated_at DESC;

  `)
  ).results.map(lineToHumpObject)
  const records = getTreeByList(res, 0)
  const each = (arr: Common.TreeNode[]) => {
    sort(arr, 'serialNum', 'desc')
    arr.forEach((item) => {
      if (item.children) {
        each(item.children)
      }
    })
  }
  each(records)
  throw new Success(records)
})

export default router
