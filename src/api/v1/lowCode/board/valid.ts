import Router from 'koa-router'
import { Success } from '../../../../core/HttpException'
import Config from '../../../../config/Config'

const router = new Router({
  prefix: `${Config.API_PREFIX}v1/lowCode/board`,
})

/*
 * 校验该用户是否能访问该看板
 * @return
 */
router.get('/valid.do', async () => {
  const res = {}
  throw new Success(res)
})

export default router
