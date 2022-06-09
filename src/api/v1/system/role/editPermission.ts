import { Models } from '../../../../common/typings/model'
import Config from '../../../../config/Config'
import KoaRouter from 'koa-router'
import { Success } from '../../../../core/HttpException'
import validator from '../../../../middlewares/validator'
import editRolePermissionById from '../../../../common/apiJsonSchema/system/role/editPermission'
import { verifyTokenPermission } from '../../../../middlewares/verifyToken'
import { command } from '../../../../server/mysql'

const router = new KoaRouter({
  prefix: `${Config.API_PREFIX}v1/system/role`,
})

router.post(
  '/editPermission',
  verifyTokenPermission,
  validator(editRolePermissionById, 'body'),
  async (ctx: Models.Ctx) => {
    const { ids, roleId } = ctx.request.body
    await command(`
    UPDATE
    system_role
    SET menu_ids = '${ids}'
    WHERE id = ${roleId}
  `)

    throw new Success()
  }
)

export default router
