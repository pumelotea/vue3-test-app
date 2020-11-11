const routes = [
  {
    path:'/',
    component:()=>import('@/App.vue'),
    redirect:'/home',
    children:[
      {
        path:'/home',
        component:()=>import('@/views/Home.vue'),
      }
    ]
  }
]

export const beforeEachHandler = (to, from, next)=>{
  next()
}

// eslint-disable-next-line no-unused-vars
export const afterEachHandler = (to, from) => {}


export default routes
