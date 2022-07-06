import Router from 'koa-router'
import { Models } from '../../../../common/typings/model'
import { Success } from '../../../../core/HttpException'

const router = new Router({
  prefix: '/api/v1/lowCode/design',
})

/*
 * 新增看板
 * @return
 */
router.post('/dataQuery', async (ctx: Models.Ctx) => {
  const data = {
    count: 3,
    data: [
      { cp1xsje: 29825000, gszq: '上海区', hkje: 38823401074 },
      { cp1xsje: 45314500, gszq: '京津区', hkje: 60335683225 },
      { cp1xsje: 16706500, gszq: '西南区', hkje: 21556953785 },
    ],
  }
  throw new Success(data)
})

export default router
