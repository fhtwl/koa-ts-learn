import Koa from 'koa'
import http from 'http'
import initCore from './core/Init'
import Config from './config/Config'
// 创建koa实例
const app = new Koa()
// 创建服务器
const server: http.Server = new http.Server(app.callback())

// 执行初始化
initCore(app, server)
// 监听端口
app.listen(Config.HTTP_PORT, () => {
  console.log('run success')
  console.log(`app started at port ${Config.HTTP_PORT}...`)
  console.log(process.env.NODE_ENV)
})
