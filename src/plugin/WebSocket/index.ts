import IO, { Server } from 'socket.io'
import { PluginOptions } from '..'

export default class WebSocket {
  constructor(options: PluginOptions) {
    const port = 9003
    const io = new Server(port, {})
    io.path('/im/')
    io.on('connection', (socket) => {
      console.log('a user connected')

      socket.on('message', (data) => {
        console.log(data)
        socket.send('hi')
      })

      socket.on('disconnect', () => {
        console.log('user disconnected')
      })
    })
  }
}
