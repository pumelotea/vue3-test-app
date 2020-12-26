/**
 * 框架接口
 */



export const enum MenuType {
  MENU,
  BUTTON,
}

export const enum LinkTarget {
  SELF,
  TAB,
  BLANK
}

export interface MenuItem {
  /**
   * 必须要有的数据
   */
  //菜单id-动态生成
  menuId: string
  //菜单名称
  name: string
  //菜单图标
  icon: string
  //菜单相对路径
  path: string
  //视图组件的路径
  view: string
  //是否为路由；决定了能不能被点击跳转
  isRouter: boolean
  //是否页面开启缓存
  isKeepalive: boolean
  //菜单类型
  type: MenuType
  //是否为外部链接
  externalLink: boolean
  //外部链接的跳转方式
  linkTarget: LinkTarget
  //外部链接的地址
  externalLinkAddress: string
  //是否为隐藏菜单
  hide: boolean
  //是否为主页
  isHome: boolean
  //权限key
  permissionKey:string
  //子级菜单
  children: Array<MenuItem>


  /**
   * 预处理后的数据
   * 使用上面的数据经过预处理后的数据
   */
  //真实的路由路径；会拼接上下层级的相对路径
  routerPath: string
  //展平后的菜单节点路径
  menuPath: Array<MenuItem>
  //面包屑节点数组
  breadcrumb: Array<MenuItem>
  //当前节点下可控按钮列表
  buttonList: Array<MenuItem>
  //当前节点下可控按钮映射表 按钮标识-按钮节点
  buttonsMap: Map<string, MenuItem>

  //其他可扩展属性
  [propName: string]: any
}

export interface Tracker {
  //客户端id
  clientId: string
}

export interface NavItem {
  //页面id；一定会独立生成，不和菜单id等同
  pageId: string
  //页面名称；不一定会使用菜单名称，可以是自定义的名称
  title: string
  //对应的菜单节点
  menuItem: MenuItem
}

/**
 * 通用适配器
 */
export interface Adapter<T> {
  convert: (rawData: any) => Array<T>
}

/**
 * 菜单数据适配器
 */
export interface MenuAdapter<T> {
  convert: (rawData: any) => {
    routeMappingList:T[],
    menuTreeConverted:T[],
    menuIdMappingMap:Map<string, T>
  }
}

/**
 * 导航按钮相关事件
 */
export interface HappyKitNavEvent {
  (navItem: NavItem): void
}

/**
 * 菜单按钮相关事件
 */
export interface HappyKitMenuEvent {
  (menuItem: MenuItem): void
}

export interface CurrentMenuRoute {
  value: null | MenuItem
}

export interface HappyKitFrameworkOption {
  menuAdapter?:MenuAdapter<MenuItem>
  [propName: string]: any
}

/**
 * 框架
 */
export interface HappyKitFramework {
  options:HappyKitFrameworkOption
  //属性
  menuTree: {
    value:Array<MenuItem>
  }
  //导航数据存储
  navigatorList: {
    value:Array<NavItem>
  }
  //路由列表
  routeMappingList: {
    value:Array<MenuItem>
  }
  //菜单Id映射表
  menuIdMappingMap: {
    value:Map<string, MenuItem>
  }
  //当前激活的路由
  currentMenuRoute: CurrentMenuRoute
  //路由初始化标志
  routerInitiated: boolean
  //客户端追踪器
  tracker: Tracker

  //方法
  init: (options?: any) => void
  setMenuTree: (rawData: any, dataAdapter?: MenuAdapter<MenuItem>) => void
  setCurrentMenuRoute: (currentMenuRoute: MenuItem) => void
  getMenuTree: () => {
    value:Array<MenuItem>
  }
  getRouteMappingList: () => {
    value:Array<MenuItem>
  }
  getCurrentMenuRoute: () => CurrentMenuRoute
  getBreadcrumb: (pageId?: string) => Array<MenuItem>
  getTracker: () => Tracker
  refreshClientId: () => string
  getNavList: () => {
    value:Array<NavItem>
  }
  isExistNav:(pageId:string) => boolean
  openNav: (menuItem:MenuItem,title?:string) => void
  closeNav: (type: string, pageId?: string, event?: HappyKitNavEvent) => void
  clickNavItem: (pageId: string, event?: HappyKitNavEvent) => void
  clickMenuItem: (menuId: string, event?: HappyKitMenuEvent) => void
}




