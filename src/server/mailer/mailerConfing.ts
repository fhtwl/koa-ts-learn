import { email } from '../../ak'

export default {
  service: 'qq', //使用了内置传输发送邮件 查看支持列表：https://nodemailer.com/smtp/well-known/
  port: 456, // SMTP 端口
  auth: {
    user: '1121145488@qq.com', // 邮箱
    pass: email.pass, // 这里密码不是邮箱密码，是你设置的smtp授权码
  },
  secureConnection: true, // 使用 SSL
}
