<template>
  <section class="app-main" style="min-height: 100%">
    <transition name="fade" mode="out-in">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
  }
}
</script>

<style rel="stylesheet/less" lang="less" scoped>
.app-main {
  margin: 40px auto 0;
  width: 90%;
  padding-bottom: 20px;
}
</style>
