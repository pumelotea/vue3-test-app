import { RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import('@/App.vue'),
    redirect: '/home',
    children: [
      {
        path: '/home',
        component: () => import('@/views/home/index.vue')
      },
      {
        path: '/game',
        component: () => import('@/views/game/index.vue')
      }
    ]
  }
]

export const beforeEachHandler = (to: any, from: any, next: any) => {
  next()
}

// eslint-disable-next-line no-unused-vars
export const afterEachHandler = (to: any, from: any) => {
}


export default routes
