<template>
  <div>
<!--    <pre>{{routeMappingList.value}}</pre>-->
    <p v-for="e in routeMappingList.value" :key="e.menuId">
      {{e.menuId}} - {{e.name}} - {{e.routerPath}}
    </p>
    <div>
      {{currentRouteMenu.value}}
    </div>
  </div>
</template>

<script lang="ts">
import { createHappyFramework } from '@/core/framework'
import routerData from '@/core/data/routerData'
export default {
  setup() {
    const instance = createHappyFramework()

    let menuTree = instance.getMenuTree()
    let routeMappingList = instance.getRouteMappingList()
    let currentRouteMenu = instance.getCurrentMenuRoute()

    instance.setMenuTree(routerData)


    // setTimeout(()=>{
    //   instance.setCurrentMenuRoute(routeMappingList.value[1])
    // },2000)

    console.log(routeMappingList)

    return {
      menuTree,
      routeMappingList,
      currentRouteMenu
    }
  }
}
</script>
