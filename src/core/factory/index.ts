import { HappyKitFramework, LinkTarget, MenuAdapter, MenuItem, MenuType, PageIdFactory } from '../types'
import { deepClone, uuid } from '../utils'
import {RouteLocationRaw ,Router} from 'vue-router'

const md5 = require('js-md5')

/**
 * 工厂
 * 创建核心框架
 * 创建用户框架
 * 创建主题框架
 * 创建axios
 * 创建router
 */

export function createEmptyMenuItem(): MenuItem {
  return {
    menuId: '',
    name: '',
    icon: '',
    path: '',
    view: '',
    isRouter: false,
    isKeepalive: false,
    type: MenuType.MENU,
    externalLink: false,
    linkTarget: LinkTarget.TAB,
    externalLinkAddress: '',
    hide: false,
    isHome: false,
    permissionKey: '',
    children: [],
    routerPath: '',
    menuPath: [],
    breadcrumb: [],
    buttonList: [],
    buttonsMap: new Map<string, MenuItem>()
  }
}

export function createDefaultMenuAdapter(): MenuAdapter<MenuItem> {
  return {
    convert(menuTree: any) {
      const routeMappingList: Array<MenuItem> = []
      const menuIdMappingMap = new Map<string, MenuItem>()
      const menuTreeConverted: Array<MenuItem> = []

      const menuTypeMap: any = {
        menu: MenuType.MENU,
        button: MenuType.BUTTON
      }

      const linkTargetMap: any = {
        _tab: LinkTarget.TAB,
        _self: LinkTarget.SELF,
        _blank: LinkTarget.BLANK
      }

      const forEachTree = (tree: Array<any>, pNode?: MenuItem) => {
        for (let i = 0; i < tree.length; i++) {
          //创建新的节点
          const treeNode = createEmptyMenuItem()
          treeNode.menuId = uuid()
          treeNode.name = tree[i].name || ''
          treeNode.path = tree[i].path || ''
          treeNode.view = tree[i].view || ''
          treeNode.isRouter = tree[i].isRouter || false
          treeNode.isKeepalive = tree[i].isKeepalive || false
          treeNode.type = menuTypeMap[tree[i].type] || MenuType.MENU
          treeNode.externalLink = tree[i].externalLink || ''
          treeNode.linkTarget = linkTargetMap[tree[i].externalLink] || LinkTarget.TAB
          treeNode.externalLinkAddress = tree[i].externalLinkAddress || ''
          treeNode.hide = tree[i].hide || false
          treeNode.isHome = tree[i].isHome || false
          treeNode.permissionKey = tree[i].permissionKey || ''

          if (!pNode) {
            pNode = createEmptyMenuItem()
            menuTreeConverted.push(pNode)
          }
          pNode.children.push(treeNode)
          //拼接路由
          treeNode.routerPath = pNode.routerPath + treeNode.path
          //预先生成菜单节点路径
          const tmpNode = deepClone(treeNode) as MenuItem
          tmpNode.children = []
          tmpNode.menuPath = []
          tmpNode.breadcrumb = []
          treeNode.menuPath = [...pNode.menuPath, tmpNode]
          //breadcrumb
          treeNode.breadcrumb = [...pNode.breadcrumb, tmpNode]

          //记录id映射表
          menuIdMappingMap.set(treeNode.menuId, treeNode)

          if (treeNode.type === MenuType.MENU) {
            if (!treeNode.isRouter) {
              forEachTree(tree[i].children, treeNode)
            } else {
              //收集按钮
              tree[i].children.forEach((e: any) => {
                const btnNode = createEmptyMenuItem()
                btnNode.menuId = uuid()
                btnNode.name = e.name || ''
                btnNode.path = e.path || ''
                btnNode.view = e.view || ''
                btnNode.isRouter = e.isRouter || false
                btnNode.isKeepalive = e.isKeepalive || false
                btnNode.type = menuTypeMap[e.type] || MenuType.MENU
                btnNode.externalLink = e.externalLink || ''
                btnNode.linkTarget = linkTargetMap[e.externalLink] || LinkTarget.TAB
                btnNode.externalLinkAddress = e.externalLinkAddress || ''
                btnNode.hide = e.hide || false
                btnNode.isHome = e.isHome || false
                btnNode.permissionKey = e.permissionKey || ''
                treeNode.buttonList.push(btnNode)
                treeNode.buttonsMap.set(btnNode.permissionKey, btnNode)
              })
              if (
                !treeNode.externalLink ||
                (treeNode.externalLink && treeNode.linkTarget === LinkTarget.TAB)
              ) {
                routeMappingList.push(treeNode)
              }
            }
          }
        }
      }
      forEachTree(menuTree as Array<any>)
      return { routeMappingList, menuTreeConverted: menuTreeConverted[0].children, menuIdMappingMap }
    }
  }
}

export function createDefaultPageIdFactory(framework:HappyKitFramework): PageIdFactory {
  return {
    framework:framework,
    generate(fullPath: string) {
      return md5(fullPath)
    },
    getNextPageId(to:RouteLocationRaw){
      const router:Router = this.framework.options.app?.config.globalProperties.$router
      if (!router){
        throw Error('getNextPageId:router instance is null')
      }
      const route = router.resolve(to)
      return this.generate(route.fullPath)
    }
  }
}
