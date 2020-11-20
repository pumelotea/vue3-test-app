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
import {timeFormat,deepClone} from '@/common/utils'

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
      console.log(timeFormat('2020/11/18 10:37:51'),'==========','2020/11/18 10:37:51')
      console.log(timeFormat('2020-11-18 10:37:51'),'==========','2020-11-18 10:37:51')
      console.log(timeFormat(time.toDateString()),'==========',time.toDateString())
      console.log(timeFormat(time.toISOString()),'==========',time.toISOString())
      console.log(timeFormat(time.toLocaleDateString()),'==========',time.toLocaleDateString())
      console.log(timeFormat(time.toLocaleString()),'==========',time.toLocaleString())
      console.log(timeFormat(time.toTimeString()),'==========',time.toTimeString())
      console.log(timeFormat(time.getTime()),'==========',time.getTime())
      console.log(timeFormat(time.toString()),'==========',time.toString())


      let a = {
        a:1,
        b:2,
        c:3,
        d:{
          a:{
            d:'123'
          }
        }
      }
      const c = a
      const b = deepClone(a)
      console.log(b === a,c===a)
      console.log(b)
      console.log(a)
      console.log(JSON.stringify(a) === JSON.stringify(b))

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
