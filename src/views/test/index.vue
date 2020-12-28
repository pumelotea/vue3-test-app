<template>
  <div>
    <p v-for="e in routeMappingList.value" :key="e.menuId">
      <a @click="goto(e.menuId)">{{e.menuId}} - {{e.name}} - {{e.routerPath}}</a>
    </p>
    <p>当前路由</p>
    <div v-if="currentRouteMenu.value">
      【{{currentRouteMenu.value.title}}】
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
import { createHappyFramework } from '@/core/framework'
// @ts-ignore
import routerData from '@/core/data/routerData'
import { NavCloseType } from '@/core/types'

export default {
  setup() {
    const instance = createHappyFramework()

    const menuTree = instance.getMenuTree()
    const routeMappingList = instance.getRouteMappingList()
    const currentRouteMenu = instance.getCurrentMenuRoute()
    const navList = instance.getNavList()

    instance.setMenuTree(routerData)

    const goto = (menuId:string) =>{
      instance.clickMenuItem(menuId,menuItems => {
        console.log('需要跳转1',menuItems)
      })
    }

    const tp:any = [NavCloseType.ALL,NavCloseType.LEFT,NavCloseType.RIGHT,NavCloseType.OTHER,NavCloseType.SELF]

    const closeNav = (type:number,pageId?:string) => {
      instance.closeNav(tp[type],pageId,(removedNavs,needNavs) => {
        console.log('已经移除1',removedNavs)
        console.log('需要跳转3',needNavs)
      })
    }

    const navClick = (pageId:string) => {
      instance.clickNavItem(pageId,(a,b)=>{
        console.log('需要跳转2',b)
      })
    }

    return {
      menuTree,
      navList,
      routeMappingList,
      currentRouteMenu,
      goto,
      closeNav,
      navClick
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
