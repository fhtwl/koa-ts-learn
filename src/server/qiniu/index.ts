import qiniu from 'qiniu'
import formidable from 'formidable'
import qiniuConfig from './qiniuConfig'
interface RespBody {
  key: string
  hash: string
  size: number
  bucket: string
  mimeType: string
}

const { accessKey, secretKey, bucket } = qiniuConfig

const putPolicy = new qiniu.rs.PutPolicy({
  scope: bucket,
  // 上传成功后返回数据键值对参数设置
  returnBody: '{"key":"$(key)","hash":"$(etag)","size":$(fsize),"bucket":"$(bucket)", "mimeType":"$(mimeType)"}',
})

/**
 * 获取上传凭证
 * @returns
 */
export function updateToken() {
  const mac = new qiniu.auth.digest.Mac(accessKey, secretKey)
  return putPolicy.uploadToken(mac)
}

/**
 * 上传
 * @param file
 * @returns
 */
export async function upload(file: formidable.File): Promise<RespBody> {
  return new Promise((resolve, reject) => {
    const config: qiniu.conf.Config = new qiniu.conf.Config({
      useHttpsDomain: true, // 是否使用https域名
      useCdnDomain: true, // 上传是否使用cdn加速
    })
    const formUploader = new qiniu.form_up.FormUploader(config) //  生成表单上传的类
    const putExtra = new qiniu.form_up.PutExtra() //  生成表单提交额外参数
    formUploader.putFile(
      updateToken(),
      `upload/${file.originalFilename}`, // 默认上传到upload文件夹下
      file.filepath,
      putExtra,
      function (respErr, respBody, respInfo) {
        if (respErr) {
          console.log(respErr)
          reject(respErr)
        }
        if (respInfo.statusCode == 200) {
          resolve(respBody)
        } else {
          console.log(respInfo.statusCode)
          reject(respBody)
        }
      }
    )
  })
}
