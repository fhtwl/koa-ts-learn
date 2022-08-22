import { Models } from '../../../../common/typings/model'
import KoaRouter from 'koa-router'
import { Success, ParameterException } from '../../../../core/HttpException'
import validator from '../../../../middlewares/validator'
import Config from '../../../../config/Config'
import verifyToken from '../../../../middlewares/verifyToken'
import editPassword from '../../../../common/apiJsonSchema/system/user/editPassword'
import verificationCodeValidator from '../../../../middlewares/verificationCodeValidator'
import { command } from '../../../../server/mysql'
import { sendEmail } from '../../../../server/mailer'
const router = new KoaRouter({
  prefix: `${Config.API_PREFIX}v1/system/user`,
})

/**
 * 更新用户详情
 */
router.post(
  '/editPassword',
  verifyToken,
  validator(editPassword, 'body'),
  verificationCodeValidator,
  async (ctx: Models.Ctx) => {
    const id = ctx.auth?.uid
    const { password, emailCode } = ctx.request.body
    if (ctx.session!.emailCode !== emailCode) {
      throw new ParameterException('邮箱验证码错误')
    }
    await command(`
      UPDATE
        system_user
      SET password = '${password}'
      WHERE id = ${id}
  `)
    throw new Success()
  }
)

/**
 * 发送邮件
 */
router.post('/editPassword/email', verifyToken, async (ctx: Models.Ctx) => {
  const id = ctx.auth?.uid
  const res = await command(`
      SELECT
        *
      FROM
        system_user
      WHERE
        id = ${id}
  `)
  const user: System.User = res.results[0]
  const code = (Math.random() * 1000000).toFixed()
  ctx.session!.emailCode = code
  // 发送邮件
  await sendEmail({
    from: '"FHTWL" <1121145488@qq.com>',
    to: user.email,
    subject: '验证码',
    text: '验证码',
    html: `
          <div >
              <p>您正在修改FHTWL低代码平台用户名为<b>${user.userName}</b>的密码，
              验证码为：</p>
              <p style="color: green;font-weight: 600;margin: 0 6px;text-align: center; font-size: 20px">
                ${code}
              </p>
              <p>请在修改密码页面填写该邮箱验证码</p>
          </div>
      `,
  })

  throw new Success()
})

export default router
