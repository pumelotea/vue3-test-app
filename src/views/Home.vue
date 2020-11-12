<template>
  <div>
    Home
    <demo-com></demo-com>
  </div>
</template>

<script lang="ts">
import DemoCom from "@/components/DemoCom.vue"

import {defineComponent} from 'vue'
// eslint-disable-next-line no-unused-vars
import {onMounted, getCurrentInstance,reactive} from 'vue'

export default defineComponent({
  name: "Home",
  components: {
    DemoCom
  },
  setup() {
    const self = getCurrentInstance()
    console.log(self)
    onMounted(async ()=>{
      await (self as any).ctx.$api.login("123123","123123")
    })
  }
})
</script>

<style scoped>

</style>
