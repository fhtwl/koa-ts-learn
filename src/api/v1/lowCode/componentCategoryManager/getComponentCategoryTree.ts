import Router from 'koa-router'
import { Success } from '../../../../core/HttpException'
import { command } from '../../../../server/mysql'
import { getTreeByList } from '../../../../common/utils/utils'
import verifyToken from '../../../../middlewares/verifyToken'

const router = new Router({
  prefix: '/api/v1/lowCode/componentCategoryManager',
})

/*
 * 获取分类树形结构
 * @return
 */
router.get('/getComponentCategoryTree', verifyToken, async () => {
  const rootId = 0
  const res = await command(`
    SELECT
      *
    FROM
      component_category
  `)

  // const list = res.results[0][name].split(',')
  throw new Success(getTreeByList(res.results, rootId))
})

export default router

// interface Child {
//   parentId: number | string
//   children: Child[]
//   [props: string]: any
// }

// function getChild(id: number | string, orginization: Child[], newArray: Child[] = []) {
//   for (let i = 0; i < orginization.length; i++) {
//     undefined
//     if (orginization[i].parentid === id) {
//       undefined
//       newArray.push(orginization[i])
//       getChild(orginization[i].id, orginization)
//     } else {
//       continue
//     }
//   }
// }
