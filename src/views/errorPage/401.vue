<template>
  <div class="errPage-container">

    <el-row>
      <el-col :span="12">
        <h1 class="text-jumbo text-ginormous">Oops!</h1>
        <h2>你没有权限去该页面</h2>
      </el-col>
    </el-row>

  </div>
</template>

<script>

export default {
  name: 'page401',
  data() {
    return {
    }
  },
  methods: {
    back() {
      if (this.$route.query.noGoBack) {
        this.$router.push({ path: '/dashboard' })
      } else {
        this.$router.go(-1)
      }
    }
  }
}
</script>
