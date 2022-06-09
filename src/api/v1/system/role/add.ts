import { Models } from '../../../../common/typings/model'
import Config from '../../../../config/Config'
import KoaRouter from 'koa-router'
import { Success } from '../../../../core/HttpException'
import validator from '../../../../middlewares/validator'
import addRole from '../../../../common/apiJsonSchema/system/role/addRole'
import { format } from '../../../../common/utils/date'
import { command } from '../../../../server/mysql'
import { verifyTokenPermission } from '../../../../middlewares/verifyToken'
import { updateRedisRole } from '../../../../server/auth'

const router = new KoaRouter({
  prefix: `${Config.API_PREFIX}v1/system/role`,
})

router.post('/add', verifyTokenPermission, validator(addRole, 'body'), async (ctx: Models.Ctx) => {
  const { name, parentId, describe = '', serialNum } = ctx.request.body
  const date = format(new Date())
  const res = await command(`
    INSERT INTO system_role ( name, parent_id, \`describe\`, serial_num, created_at, updated_at )
    VALUES
    ( '${name}', ${parentId}, '${describe}', ${serialNum}, '${date}', '${date}' );
  `)
  updateRedisRole()
  throw new Success(res)
})

export default router
