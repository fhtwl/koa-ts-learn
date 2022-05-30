import { Menu } from './menu'

export namespace Role {
  interface Role {
    id: number
    menuList: Menu.Menu[]
    parentId: number
    name: string
  }
}
