import { Models } from '../../../../common/typings/model'
import KoaRouter from 'koa-router'
import { Success } from '../../../../core/HttpException'
import validator from '../../../../middlewares/validator'
import addMenu from '../../../../common/apiJsonSchema/system/menu/add'
import Config from '../../../../config/Config'
import { command } from '../../../../server/mysql'
import { format } from '../../../../common/utils/date'
import { verifyTokenPermission } from '../../../../middlewares/verifyToken'
import { updateRedisRole } from '../../../../server/auth'

const router = new KoaRouter({
  prefix: `${Config.API_PREFIX}v1/system/menu`,
})

router.post('/add', verifyTokenPermission, validator(addMenu, 'body'), async (ctx: Models.Ctx) => {
  const { type, name, parentId, path = '', icon, serialNum, show, component = '', permission } = ctx.request.body
  const date = format(new Date())
  await command(`
    INSERT INTO system_menu ( name, parent_id, path, icon, type, serial_num, \`show\`, component, permission,  created_at, updated_at )
    VALUES
    ( '${name}', ${parentId}, '${path}', '${icon}', ${type}, ${serialNum}, ${show}, '${component}', '${permission}', '${date}', '${date}' );
  `)
  updateRedisRole()
  throw new Success()
})

export default router
