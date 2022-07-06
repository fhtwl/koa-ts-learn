import Router from 'koa-router'
import { Models } from '../../../../common/typings/model'
import { Success } from '../../../../core/HttpException'
import { getPagination } from '../../../../common/utils/result'
import { command } from '../../../../server/db'
import { verifyTokenPermission } from '../../../../middlewares/verifyToken'
import validator from '../../../../middlewares/validator'
import pagination from '../../../../common/apiJsonSchema/common/pagination'
import { ObjectId } from 'mongodb'
import Config from '../../../../config/Config'
import { getDbId } from '../../../../server/db'
const router = new Router({
  prefix: `${Config.API_PREFIX}v1/lowCode/dataSourceCategoryManager`,
})

type ColType = 48 | 32 | 16 // 48 日期,32 number, 16 string

interface dataSourceField {
  enable: boolean
  fieldGroupType: 0
  id: string
  name: string
  size: number
  transferName: string
  type: ColType
  usable: true
}

interface DataSourceInfo<T> {
  data: Array<T>
  fields: dataSourceField[]
  name: string
  _id: ObjectId
  parentId: string
}

type DbId = null | ObjectId

/*
 * 获取数据源
 * @return
 */
router.post('/list', verifyTokenPermission, validator(pagination, 'body'), async (ctx: Models.Ctx) => {
  const { params, pageNum, pageSize } = ctx.request.body
  const { name, parentId } = params
  const { list: dataSourceList, total: dataSourceTotal } = await getList(
    'ts_db',
    'data_source',
    pageNum,
    pageSize,
    parentId ? new ObjectId(parentId) : null,
    name
  )
  const { list: dataSourceCategoryList, total: dataSourceCategoryTotal } = await getList(
    'ts_db',
    'data_source_category',
    pageNum,
    pageSize,
    parentId ? getDbId(parentId) : null,
    name
  )
  const records = [
    ...dataSourceCategoryList.map((item: DataSourceInfo<any>) => {
      return {
        name: item.name,
        id: item._id.toString(),
        parentId: item.parentId,
        type: 2,
      }
    }),
    ...dataSourceList.map((item: DataSourceInfo<any>) => {
      return {
        name: item.name,
        id: item._id.toString(),
        parentId: item.parentId,
        type: 1,
      }
    }),
  ]
  const data = getPagination(records, dataSourceTotal + dataSourceCategoryTotal, pageSize, pageNum)
  throw new Success(data)
})

async function getList(
  dbName: string,
  collectionName: string,
  pageNum: number,
  pageSize: number,
  parentId: DbId,
  name?: string
) {
  const filter = { name, parentId }
  if (!name) {
    delete filter.name
  }

  const res: {
    list: []
    total: number
  } = (
    await command(filter, {
      dbName,
      collectionName,
      pageNum,
      pageSize,
      isPagination: true,
    })
  ).results
  return res
}

export default router
