import { RouteRecordRaw } from 'vue-router'
import { createDefaultRouterInterceptor } from '@/core/factory'
import { RouterInterceptorType } from '@/core/types'

//导入框架实例
import happyFramework from '@/framework'
// @ts-ignore
import routerData from '@/core/data/routerData'

//创建默认的拦截器
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
    routes: [],
    viewLoader(view){
      return ()=>import(`@/views${view}`)
    }
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
  //使用拦截器
  beforeInterceptor.filter(to,from,next)
}

// eslint-disable-next-line no-unused-vars
export const afterEachHandler = (to: any, from: any) => {
  //使用拦截器
  afterInterceptor.filter(to,from)
}


export default routes
