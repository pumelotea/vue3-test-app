<template>
  <div>
    <p v-for="e in routeMappingList.value" :key="e.menuId">
      <a @click="goto(e.menuId)">{{e.menuId}} - {{e.name}} - {{e.routerPath}}</a>
    </p>
    <p>面包屑</p>
    <span>{{breadcrumb}}</span>
    <p>当前路由</p>
    <div v-if="currentRouteMenu.value">
      【{{currentRouteMenu.value.title}}】
    </div>
    <div>
      <button @click="openNav('dash-1111')">open1</button>
      <button @click="openNav('dash-2222')">open2</button>
      <button @click="openNav('dash-3333')">open3</button>
    </div>
    <button @click="closeNav(0)">关闭全部 </button>
    <button @click="closeNav(1)">关闭左侧 </button>
    <button @click="closeNav(2)">关闭右侧 </button>
    <button @click="closeNav(3)">关闭其他 </button>
    <div v-for="e in navList.value" :key="e.pageId">
      <button @click="closeNav(4,e.pageId)">CLOSE</button> <a :style="currentRouteMenu.value?.pageId===e.pageId?'color:red':''" @click="navClick(e.pageId)">{{e.title}}</a>
    </div>
  </div>
</template>

<script lang="ts">

import { computed ,getCurrentInstance} from 'vue'
// @ts-ignore
import routerData from '@/core/data/routerData'
import { HappyKitFramework, NavCloseType } from '@/core/types'

export default {
  setup() {
    const self = getCurrentInstance()
    const ctx = (self as any).ctx
    const instance = ctx.$happykit as HappyKitFramework

    const menuTree = instance.getMenuTree()
    const routeMappingList = instance.getRouteMappingList()
    const currentRouteMenu = instance.getCurrentMenuRoute()
    const navList = instance.getNavList()

    const breadcrumb = computed(()=>{
      return currentRouteMenu.value?.menuItem.breadcrumb.map((e:any)=>e.name).join('/')
    })

    instance.setMenuTree(routerData)

    const goto = (menuId:string) =>{
      instance.clickMenuItem(menuId,(menuItems:any) => {
        console.log('需要跳转1',menuItems)
      })
    }

    const tp:any = [NavCloseType.ALL,NavCloseType.LEFT,NavCloseType.RIGHT,NavCloseType.OTHER,NavCloseType.SELF]
    const closeNav = (type:number,pageId?:string) => {
      instance.closeNav(tp[type],pageId,(removedNavs:any,needNavs:any) => {
        console.log('已经移除1',removedNavs)
        console.log('需要跳转3',needNavs)
      })
    }

    const navClick = (pageId:string) => {
      instance.clickNavItem(pageId,(a:any,b:any)=>{
        console.log('需要跳转2',b)
      })
    }

    const openNav = (title:string)=>{
      instance.openNav('/dashboard?id=1&title='+title,routeMappingList.value[0],title)
    }

    return {
      menuTree,
      navList,
      routeMappingList,
      currentRouteMenu,
      breadcrumb,
      goto,
      closeNav,
      navClick,
      openNav
    }
  }
}
</script>
<style>
p {
  margin: 0;
}

a {
  cursor: pointer;
}

a:hover{
  color: blue;
}
</style>
