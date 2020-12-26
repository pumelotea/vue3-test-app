import { reactive } from 'vue'
import { uuid,deepClone } from '../utils'
import {
  HappyKitFramework,
  HappyKitFrameworkOption,
  HappyKitMenuEvent,
  HappyKitNavEvent,
  LinkTarget,
  MenuAdapter,
  MenuItem,
  MenuType
} from '../types'
const md5 = require('js-md5')

function createEmptyMenuItem(): MenuItem {
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

const defaultMenuAdapter: MenuAdapter<MenuItem> = {
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
    return { routeMappingList, menuTreeConverted:menuTreeConverted[0].children, menuIdMappingMap }
  }
}

/**
 * 创建核心框架
 * @param options
 */
export function createHappyFramework(options?: any): HappyKitFramework {

  const frameworkInstance: HappyKitFramework = {
    options: {},
    menuTree: reactive({value:[]}),
    navigatorList: reactive({value:[]}),
    routeMappingList: reactive({value:[]}),
    menuIdMappingMap: reactive({value:new Map<string, MenuItem>()}),
    currentMenuRoute: reactive({ value: null }),
    routerInitiated: false,
    tracker: {
      clientId: ''
    },
    init(options?: HappyKitFrameworkOption) {
      this.options = options || {
        menuAdapter:defaultMenuAdapter
      }
    },
    setMenuTree(rawData: any, dataAdapter?: MenuAdapter<MenuItem>) {
      if (!dataAdapter){
        dataAdapter = this.options.menuAdapter
      }

      if (!dataAdapter){
        console.error('MenuAdapter not found')
        return
      }

      const {
        routeMappingList,
        menuTreeConverted,
        menuIdMappingMap
      } = dataAdapter.convert(rawData)
      this.menuTree.value = menuTreeConverted
      this.routeMappingList.value = routeMappingList
      this.menuIdMappingMap.value = menuIdMappingMap
    },
    setCurrentMenuRoute(currentMenuRoute: MenuItem | null) {
      this.currentMenuRoute.value = currentMenuRoute
    },
    getMenuTree() {
      return this.menuTree
    },
    getRouteMappingList() {
      return this.routeMappingList
    },
    getCurrentMenuRoute() {
      return this.currentMenuRoute
    },
    getBreadcrumb(pageId?: string) {
      //不传pageId的情况会获取激活的路由所对应的面包屑
      if (!pageId) {
        if (!this.currentMenuRoute.value) {
          return []
        }
        return this.currentMenuRoute.value.breadcrumb
      }
      //正常传递pageId的情况会根据pageId查找对应的菜单的面包屑
      const menuItems = this.navigatorList.value.filter(e => e.pageId == pageId)
      if (menuItems.length === 0) {
        return []
      }
      return menuItems[0].menuItem.breadcrumb
    },
    getTracker() {
      return this.tracker
    },
    refreshClientId() {
      const id = uuid()
      this.tracker.clientId = id
      //持久化
      localStorage.setItem('clientId', id)
      return id
    },
    getNavList() {
      return this.navigatorList
    },
    isExistNav(pageId:string){
      return this.navigatorList.value.filter(e=>e.pageId === pageId).length > 0
    },
    //TODO
    openNav(menuItem: MenuItem, title?: string){
      this.navigatorList.value.push({
        pageId:'',
        title:title || menuItem.name,
        menuItem:menuItem
      })
    },
    closeNav(type: string, pageId?: string, event?: HappyKitNavEvent) {
    },
    clickNavItem(pageId: string, event?: HappyKitNavEvent) {
    },
    clickMenuItem(menuId: string, event?: HappyKitMenuEvent) {
    }
  }
  frameworkInstance.init(options)
  return frameworkInstance
}
