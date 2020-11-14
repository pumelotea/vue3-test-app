<template>
  <div>
    Home-{{data.sum}}
    <demo-com @demo-click="addAction" :name="String(count)"></demo-com>
    <div>
      <button @click="addAction">ADD {{count}}</button>
    </div>
  </div>
</template>

<script lang="ts">
import DemoCom from '@/components/DemoCom.vue'

import { defineComponent } from 'vue'
// eslint-disable-next-line no-unused-vars
import { onMounted, getCurrentInstance, reactive, ref } from 'vue'

export default defineComponent({
  name: 'Home',
  components: {
    DemoCom
  },
  setup() {
    // const self = getCurrentInstance()
    const count = ref(0)
    const data = reactive({
      sum: 0
    })

    const addAction = (event: any) => {
      console.log(event)
      count.value++
      data.sum += count.value

    }

    onMounted(async () => {
      // await (self as any).ctx.$api.login("123123","123123")
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
