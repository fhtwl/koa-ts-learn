import nodemailer from 'nodemailer'
import mailerConfing from './mailerConfing'

// 开启一个 SMTP 连接池
const transporter = nodemailer.createTransport(mailerConfing)

export default transporter
