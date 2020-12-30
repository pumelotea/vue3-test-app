import { RouteRecordRaw } from 'vue-router'
import { createDefaultRouterInterceptor } from '@/core/factory'
import { RouterInterceptorType } from '@/core/types'
import happyFramework from '@/framework'
// @ts-ignore
import routerData from '@/core/data/routerData'


const beforeInterceptor = createDefaultRouterInterceptor({
  interceptorType:RouterInterceptorType.BEFORE,
  framework:happyFramework,
  dataLoader(){
    return routerData
  },
  dataLoadFailureHandler(){
    console.log('dataLoadFailureHandler console')
  },
  routerInjectOption:{
    parentRoute: {
      name: 'home',
      path: '/home',
      component: () => import('@/views/home'!)
    },
    router: happyFramework.options.app?.config.globalProperties.$router,
    routes: [],
    componentRootPath: 'views'
  }
})
const afterInterceptor = createDefaultRouterInterceptor({
  interceptorType:RouterInterceptorType.AFTER,
  framework:happyFramework
})

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import('@/App.vue'),
    redirect: '/home',
    children: []
  }
]

export const beforeEachHandler = (to: any, from: any, next: any) => {
  beforeInterceptor.filter(to,from,next)
}

// eslint-disable-next-line no-unused-vars
export const afterEachHandler = (to: any, from: any) => {
  afterInterceptor.filter(to,from)
}


export default routes
