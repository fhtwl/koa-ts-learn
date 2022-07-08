import Config from '../../config/Config'
export default {
  accessKey: Config.QINIU.AK,
  secretKey: Config.QINIU.SK,
  bucket: Config.QINIU.BUCKET, // 七牛云存储空间名
}
