import Router from 'koa-router'
import { Models } from '../../../../../common/typings/model'
import Config from '../../../../../config/Config'
import { Success } from '../../../../../core/HttpException'
import verifyToken from '../../../../../middlewares/verifyToken'
import { upload } from '../../../../../server/qiniu'
import formidable from 'formidable'

const router = new Router({
  prefix: `${Config.API_PREFIX}v1/system/common/upload`,
})

const resourcePath = '/resource/'

/*
 * 上传图片
 */
router.post('/img', verifyToken, async (ctx: Models.Ctx) => {
  const file = ctx.request.files?.img as unknown as formidable.File

  const res = await upload(file)

  throw new Success({
    path: `${resourcePath}${res.key}`,
    name: file.originalFilename,
    mimetype: file.mimetype,
    size: file.size,
  })
})

export default router
