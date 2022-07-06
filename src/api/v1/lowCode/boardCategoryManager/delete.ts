import Router from 'koa-router'
import { LowCode } from '../../../../common/typings/lowCode'
import { Success } from '../../../../core/HttpException'
import { verifyTokenPermission } from '../../../../middlewares/verifyToken'
import validator from '../../../../middlewares/validator'
import { command } from '../../../../server/mysql'
import deleteBoard from '../../../../common/apiJsonSchema/lowCode/board/delete'
import { Models } from '../../../../common/typings/model'
import Config from '../../../../config/Config'

const router = new Router({
  prefix: `${Config.API_PREFIX}v1/lowCode/boardCategoryManager`,
})

/*
 * 删除看板分类
 * @return
 */
router.get('/delete', verifyTokenPermission, validator(deleteBoard), async (ctx: Models.Ctx) => {
  const { cIds, bIds } = ctx.request.query
  await Promise.all([deleteBoardCategoryByIds(cIds as string), deleteBoardByIds(bIds as string)])
  throw new Success()
})

export default router

/**
 * 根据ids删除分类
 * @param ids
 */
async function deleteBoardCategoryByIds(ids: string) {
  const idList = ids.split(',')
  const res = await Promise.all(
    idList.map((id) => {
      const name = `getBoardCategoryChildList(${id})`
      return command(`
      SELECT
        *
      FROM
        lowcode_board_category
      WHERE
        FIND_IN_SET(
          id,
          ${name}
        )
    `)
    })
  )
  // 获取所有分类的id
  const categoryIds: number[] = []
  res.forEach((data) => {
    categoryIds.push(...data.results.map((item: LowCode.boardCategory) => item.id))
  })

  let categoryIdWhere = ''
  categoryIds.forEach((id, index) => {
    if (index !== 0) {
      categoryIdWhere += ' OR '
    }
    categoryIdWhere += `id = ${id}`
  })

  await Promise.all([
    command(`
      DELETE
      FROM
        lowcode_board_category
      WHERE
        ${categoryIdWhere}
    `),
    command(`
      DELETE
      FROM
      lowcode_board
      WHERE
        ${categoryIdWhere}
    `),
  ])
}

/**
 * 根据ids删除board
 * @param params
 */
async function deleteBoardByIds(ids: string) {
  const idList = ids.split(',')
  let idWhere = ''
  idList.forEach((id, index) => {
    if (index !== 0) {
      idWhere += 'OR '
    }
    idWhere += `id = ${id}`
  })
  await command(`
      DELETE
      FROM
      lowcode_board
      WHERE
        ${idWhere}
    `)
}
