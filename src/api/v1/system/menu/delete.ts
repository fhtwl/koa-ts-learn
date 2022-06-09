import { Models } from '../../../../common/typings/model'
import KoaRouter from 'koa-router'
import { Success } from '../../../../core/HttpException'
import validator from '../../../../middlewares/validator'
import deleteMenuByIds from '../../../../common/apiJsonSchema/system/menu/deleteMenuByIds'
import Config from '../../../../config/Config'
import { updateRedisRole } from '../../../../server/auth'
import { command } from '../../../../server/mysql'
import { verifyTokenPermission } from '../../../../middlewares/verifyToken'

const router = new KoaRouter({
  prefix: `${Config.API_PREFIX}v1/system/menu`,
})

/*
 * 删除菜单
 * @return
 */
router.get('/delete', verifyTokenPermission, validator(deleteMenuByIds), async (ctx: Models.Ctx) => {
  const { ids } = ctx.request.query
  const idList = (ids as string).split(',')
  let idWhere = ''
  idList.forEach((id, index) => {
    if (index !== 0) {
      idWhere += 'OR '
    }
    idWhere += `id = ${id}`
  })
  await command(`
    DELETE
    FROM
      system_menu
    WHERE
      ${idWhere}
  `)
  updateRedisRole()
  throw new Success()
})

export default router
