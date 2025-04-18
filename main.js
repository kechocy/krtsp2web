const RTSP2web = require('./lib/rtsp2web')

// 服务端长连接占据的端口号；你也可以不传，默认是：9999
let port = 9999

// 创建一个RTSP2web服务实例出来
new RTSP2web({
  port,
  audio: false
})