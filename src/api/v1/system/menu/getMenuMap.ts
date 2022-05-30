import { Models } from '../../../../common/typings/model'
import KoaRouter from 'koa-router'
import { Success } from '../../../../core/HttpException'
import { lineToHumpObject, getTreeByList, sort } from '../../../../common/utils/utils'
import { Menu } from '../../../../common/typings/menu'
import Config from '../../../../config/Config'
import verifyToken from '../../../../middlewares/verifyToken'
import { command } from '../../../../server/mysql'

const router = new KoaRouter({
  prefix: `${Config.API_PREFIX}v1/system/menu`,
})

router.get('/getMenuMap', verifyToken, async () => {
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
      m.type
    FROM
      system_menu m

  )
  ORDER BY
    updated_at DESC;
`)
  ).results.map(lineToHumpObject) as Menu.Menu[]

  const records = getTreeByList(res, 0)
  const each = (arr: Models.TreeNode[]) => {
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
