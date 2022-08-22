import { HttpException } from '../../core/HttpException'
import transporter from './transporter'
interface MailOptions {
  from?: string // 发件人
  to: string // 收件人
  subject: string // 主题
  text: string // plain text body
  html: string // html body
}

/**
 * 发送邮件
 * @param { MailOptions } mailOptions
 * @returns
 */
export async function sendEmail({ from = '"Fhtwl" <1121145488@qq.com>', to, subject, text, html }: MailOptions) {
  return new Promise((resolve, reject) => {
    const mailOptions = {
      from,
      to,
      subject,
      text,
      html,
    }
    mailOptions.from = from
    mailOptions.to = to
    mailOptions.subject = subject
    mailOptions.text = text
    mailOptions.html = html
    transporter.sendMail(mailOptions).then((res: { response: string | string[] }) => {
      if (res.response.indexOf('250') > -1) {
        resolve(true)
      } else {
        reject()
      }
    })
  }).catch((error) => {
    throw new HttpException(error.msg)
  })
}
