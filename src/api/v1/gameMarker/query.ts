import KoaRouter from 'koa-router'
import { Models } from '../../../common/typings/model'
import { command } from '../../../server/mysql'
import { Success } from '../../../core/HttpException'
import Config from '../../../config/Config'

const router = new KoaRouter({
  prefix: `${Config.API_PREFIX}v1/gameMarker`,
})

router.get('/query', async (ctx: Models.Ctx) => {
  // 查询获取所有的菜单(包括菜单目录和按钮)
  const { name = '' } = ctx.query
  const res = (
    await command(`
    SELECT
        code,
        name
    FROM
        game_marker_list
    WHERE
        name like '%${name}%'
  `)
  ).results
  throw new Success(res)
})

export default router
