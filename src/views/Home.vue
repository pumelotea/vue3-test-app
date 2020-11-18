<template>
  <div>
    Home-{{data.sum}}
    <demo-com @demo-click="addAction" :name="String(count)">
        <template v-slot:default="{xxx}">
          {{xxx}}
        </template>
    </demo-com>
    <div>
      <button @click="addAction">ADD {{count}}</button>
    </div>
  </div>
</template>

<script lang="ts">
import DemoCom from '@/components/DemoCom.vue'
import {timeFormat} from '@/common/utils'

import { defineComponent } from 'vue'
// eslint-disable-next-line no-unused-vars
import { onMounted, getCurrentInstance, reactive, ref } from 'vue'

export default defineComponent({
  name: 'Home',
  components: {
    DemoCom
  },
  setup() {
    const self = getCurrentInstance()
    const ctx = (self as any).ctx
    const count = ref(0)
    const data = reactive({
      sum: 0
    })

    const addAction = (event: any) => {
      console.log(event)
      count.value++
      data.sum += count.value

      ctx.$bus.emit('ok','asdjaksjdkjajskd')
    }

    onMounted(async () => {
      ctx.$bus.on('ok',(msg:any)=>console.log(msg))
      // await ctx.$api.login("123123","123123")

      let time = new Date()
      console.log(timeFormat(time),'==========',time)
      console.log(timeFormat(time.toDateString()),'==========',time.toDateString())
      console.log(timeFormat(time.toISOString()),'==========',time.toISOString())
      console.log(timeFormat(time.toLocaleDateString()),'==========',time.toLocaleDateString())
      console.log(timeFormat(time.toLocaleString()),'==========',time.toLocaleString())
      console.log(timeFormat(time.toTimeString()),'==========',time.toTimeString())
      console.log(timeFormat(time.getTime()),'==========',time.getTime())
      console.log(timeFormat(time.toString()),'==========',time.toString())
    })

    return {
      count,
      data,
      addAction
    }
  }
})
</script>

<style lang="scss" scoped>
.aa {
  .v {
    color: aliceblue;
  }
}
</style>
