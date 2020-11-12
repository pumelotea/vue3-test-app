<template>
  <div>
    Home
    <demo-com></demo-com>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import DemoCom from "../components/DemoCom.vue"
// eslint-disable-next-line no-unused-vars
import {onMounted,getCurrentInstance} from 'vue'
export default defineComponent({
  name: "Home",
  components:{
    DemoCom
  },
  setup(){
  }
})
</script>

<style scoped>

</style>
