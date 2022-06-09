import { Models } from '../../../../common/typings/model'
import Config from '../../../../config/Config'
import KoaRouter from 'koa-router'
import { Success } from '../../../../core/HttpException'
import validator from '../../../../middlewares/validator'
import editRoleByid from '../../../../common/apiJsonSchema/system/role/edit'
import { verifyTokenPermission } from '../../../../middlewares/verifyToken'
import { command } from '../../../../server/mysql'
import { getUserPermission, updateRoles } from '../../../../server/auth'

const router = new KoaRouter({
  prefix: `${Config.API_PREFIX}v1/system/role`,
})

router.post('/edit', verifyTokenPermission, validator(editRoleByid, 'body'), async (ctx: Models.Ctx) => {
  const { id, name, parentId, describe, serialNum } = ctx.request.body
  await command(`
    UPDATE
    system_role
    SET name = '${name}', parent_id = ${parentId}, \`describe\` = '${describe}', serial_num = ${serialNum}
    WHERE id = ${id}
  `)

  const scope = id
  getUserPermission({
    scope,
    uid: ctx.auth.uid,
  }).then((list) => {
    updateRoles(
      scope,
      new Map([
        ['id', id.toString()],
        ['parentId', parentId.toString()],
        ['permissions', list.map((item) => item.permission).join(',')],
      ])
    )
  })
  throw new Success()
})

export default router
