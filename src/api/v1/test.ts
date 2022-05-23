import Router from 'koa-router'
import Config from '../../config/Config'
import { Success, ParameterException, AuthFailed } from '../../core/HttpException'
const router = new Router({
  prefix: `${Config.API_PREFIX}v1`, // 路径前缀
})
// 指定一个url和请求方法匹配处理
router
  .get('/test', (ctx) => {
    const { id } = ctx.request.body
    const token = ctx.header['authorization'] || ctx.cookies.get('authorization')
    // 如果没有携带登录信息
    if (!token) {
      throw new AuthFailed('未登录')
    }
    // 如果缺少参数或者参数类型错误
    if (typeof id !== 'number') {
      throw new ParameterException('缺少参数id')
    }
    throw new Success('text')
  })
  .post('/login', (ctx) => {
    ctx.body = '登录'
  })

export default router
