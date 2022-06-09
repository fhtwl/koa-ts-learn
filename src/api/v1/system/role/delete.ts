import { Models } from '../../../../common/typings/model'
import Config from '../../../../config/Config'
import KoaRouter from 'koa-router'
import { Success } from '../../../../core/HttpException'
import validator from '../../../../middlewares/validator'
import deleteRoleByIds from '../../../../common/apiJsonSchema/system/role/delete'
import { verifyTokenPermission } from '../../../../middlewares/verifyToken'
import { command } from '../../../../server/mysql'
import { updateRedisRole } from '../../../../server/auth'

const router = new KoaRouter({
  prefix: `${Config.API_PREFIX}v1/system/role`,
})

/*
 * 删除菜单
 * @return
 */
router.get('/delete', verifyTokenPermission, validator(deleteRoleByIds), async (ctx: Models.Ctx) => {
  const { ids } = ctx.request.query
  await command(`
    DELETE
    FROM
    system_role
    WHERE
      FIND_IN_SET(id, '${ids}')
  `)
  updateRedisRole()
  throw new Success()
})

export default router
