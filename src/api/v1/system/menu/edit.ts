import { Models } from '../../../../common/typings/model'
import KoaRouter from 'koa-router'
import { Success } from '../../../../core/HttpException'
import validator from '../../../../middlewares/validator'
import editMenuById from '../../../../common/apiJsonSchema/system/menu/edit'
import Config from '../../../../config/Config'
import { command } from '../../../../server/mysql'
import { updateRedisRole } from '../../../../server/auth'
import { verifyTokenPermission } from '../../../../middlewares/verifyToken'

const router = new KoaRouter({
  prefix: `${Config.API_PREFIX}v1/system/menu`,
})

router.post('/edit', verifyTokenPermission, validator(editMenuById, 'body'), async (ctx: Models.Ctx) => {
  const {
    id,
    type,
    name,
    parentId,
    path = '',
    icon,
    serialNum,
    show,
    component = '',
    permission = '',
  } = ctx.request.body
  await command(`
    UPDATE
      system_menu
    SET
      name = '${name}',
      type = ${type},
      parent_id = ${parentId},
      path = '${path}',
      icon = '${icon}',
      serial_num = ${serialNum},
      \`show\` = ${show},
      component = '${component}',
      permission = '${permission}'
    WHERE id = ${id}
  `)
  updateRedisRole()
  throw new Success()
})

export default router
