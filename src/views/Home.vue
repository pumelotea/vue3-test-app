<template>
  <div>
    Home
    <demo-com></demo-com>
  </div>
</template>

<script lang="">
import DemoCom from "@/components/DemoCom"
// eslint-disable-next-line no-unused-vars
import {onMounted,getCurrentInstance} from 'vue'
export default {
  name: "Home",
  components:{
    DemoCom
  },
  setup(){
  }
}
</script>

<style scoped>

</style>
