import Router from 'koa-router'
import { Models } from '../../../../common/typings/model'
import svgCaptcha from 'svg-captcha'
import { Buffer } from '../../../../core/HttpException'
import Config from '../../../../config/Config'

const router = new Router({
  prefix: `${Config.API_PREFIX}v1/system/common`,
})
/*
 * 获取验证码
 * @return { image } 返回图片
 */
router.get('/code', async (ctx: Models.Ctx) => {
  const captcha: svgCaptcha.CaptchaObj = svgCaptcha.createMathExpr({
    size: 6, //验证码长度
    fontSize: 45, //验证码字号
    ignoreChars: '0o1i', // 过滤掉某些字符， 如 0o1i
    noise: 1, //干扰线条数目
    width: 100, //宽度
    // heigth:40,//高度
    color: true, //验证码字符是否有颜色，默认是没有，但是如果设置了背景颜色，那么默认就是有字符颜色
    background: '#cc9966', //背景大小
  })

  ctx.session!.code = captcha.text //把验证码赋值给session
  throw new Buffer(captcha.data, 'image/svg+xml', captcha.text)
})

export default router
