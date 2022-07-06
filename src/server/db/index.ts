// const mongoClient = require('mongodb').MongoClient
// const ObjectId = require('mongodb').ObjectId
import dbConfing from './dbConfing'
import { DataBaseFailed } from '../../core/HttpException'
import { lineToHumpObject, humpToLineObject } from '../../common/utils/utils'
import { ObjectId, MongoClient } from 'mongodb'
import { Models } from '../../common/typings/model'

interface DBCommandOption {
  dbName: string
  collectionName: string
  isPagination: boolean
  pageSize: number
  pageNum: number
}
function connect(callback: Common.Fun) {
  MongoClient.connect(dbConfing.url)
    .then((client: MongoClient) => {
      console.log(client)

      callback(client)
      // (err: { message: string }, client: any) => {
      //   if (err) {
      //     throw new DataBaseFailed('数据库连接出错' + ':' + err.message)
      //   }
      //   callback(client)
      // }
    })
    .catch((error) => {
      throw new DataBaseFailed(`数据库连接出错:${error.message}`)
    })
}

/*
 * 数据库查询
 * @param command 过滤条件
 * @param option 表明和集合名
 */
export async function command(command: Common.Params = {}, option: DBCommandOption): Promise<Models.Result> {
  try {
    return new Promise<Models.Result>(async (resolve, reject) => {
      connect(async (client: any) => {
        const col = client.db(option.dbName).collection(option.collectionName)
        let total = 0
        const page = (data: any) => {
          if (option.isPagination) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return data.skip((option.pageNum - 1) * option.pageSize).limit(option.pageSize)
          } else {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return data
          }
        }
        const query = col.find(humpToLineObject(command))

        total = await query.count()
        page(query)
          .toArray()
          .then((items: any[]) => {
            client?.close()
            const result: Models.Result = {
              msg: 'ok',
              state: 1,
              // results: items,
              results: {
                list: items.map(lineToHumpObject),
                total: option.isPagination ? total : undefined,
              },
            }
            resolve(result)
          })
          .catch(reject)
      })
    })
  } catch (err) {
    // console.log(command)
    throw new DataBaseFailed()
  }
}

export function getDbId(id?: string | number | ObjectId | Buffer | Uint8Array | undefined): ObjectId {
  return new ObjectId(id)
}
