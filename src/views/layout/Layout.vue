<template>
  <div class="app-wrapper">
    <div class="main-container">
      <navbar />
      <app-main />
    </div>
  </div>
</template>

<script>
import { Navbar, AppMain } from './components'
import {
  mapGetters
} from 'vuex'

export default {
  name: 'layout',
  components: {
    Navbar,
    AppMain
  },
  computed: {
    ...mapGetters(['permission_routers'])
  }
}
</script>

<style rel="stylesheet/less" lang="less" scoped>
    .app-wrapper {
        position: relative;
        min-height: 100%;
        width: 100%;
        background: #fff;
    }
</style>
