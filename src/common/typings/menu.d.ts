import { Models } from './model'

export namespace Menu {
  interface Menu extends Models.TreeNode {
    name: string
    id: number
    title: string
    show: 0 | 1
    icon: string | undefined
    component: string
    redirect: string | undefined
    parentId: number
    path: string | undefined
    hideChildren: 0 | 1
    children: Menu[]
    serialNum: number
    permission: string
    type: MenuType
  }

  type MenuType = 1 | 2 | 3
}
