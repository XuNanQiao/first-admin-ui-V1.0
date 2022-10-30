<template>
  <div class="page">
    <div class="header">
      <h1 class="logo">
        <img src="@/assets/kxt/header-logo.png" alt="">
      </h1>
      <div class="nav">
        <template v-for="item in permission_routers">
          <router-link v-if="!item.hidden" :to="item.path" :key="item.name">
            <span v-if="item.meta && item.meta.title">
              {{item.meta.title}}
            </span>
          </router-link>
        </template>
      </div>
      <div ref="loginout" class="loginout" @click.stop="showlist = !showlist">
        <!-- <i class="el-icon-user-solid avatar"></i> -->
        <img src="@/assets/kxt/user_icon.png" alt="" class="user_img">
        <el-popover trigger="hover" placement="top" v-if="username && username.length > 6">
          <span>{{username}}</span>
          <div slot="reference">
            <span class="username" slot="reference">{{username}}</span>
          </div>
        </el-popover>
        <span v-else>{{username}}</span>
        <i class="el-icon-caret-bottom"></i>
        <div class="list" v-show="showlist" @click="logout">
          <img src="@/assets/kxt/exit.png" alt="" class="exit_img" />
          <div class="item">退出登录</div>
        </div>
      </div>
    </div>
    <div class="navSub" v-if="childrenRouter.length > 1">
      <template v-for="itemSub in childrenRouter">
        <router-link v-if="!itemSub.hidden" :to="itemSub.path" :key="itemSub.name">
          <span v-if="itemSub.meta && itemSub.meta.title">{{itemSub.meta.title}}</span>
        </router-link>
      </template>
      <div class="line"></div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  components: {
  },
  data() {
    return {
      showlist: false,
      path: ''
    }
  },
  computed: {
    ...mapGetters(['permission_routers', 'name', 'addRouters']),
    username() {
      if (this.name) {
        return this.name
      } else {
        return ''
      }
    },
    childrenRouter() {
      const tempPath = '/' + this.$route.path.split('/')[1]
      let childrenRouter = []
      this.permission_routers.filter(item => {
        if (item.path === tempPath && item.children) {
          childrenRouter = item.children
        }
      })
      return childrenRouter
    }
  },
  watch: {
    $route: {
      immediate: true,
      handler(val) {
        const tempPath = `/${val.path.split('/')[1]}`
        if (!this.$route.path.split('/')[2]) { // 一级菜单默认跳转
          this.childrenRouter.length ? this.$router.push(tempPath + '/' + this.childrenRouter[0].path) : ''
        }
      }
    }

  },
  mounted() {
    var routers = this.addRouters
    this.path = '/' + this.$route.path.split('/')[1]
    window.addEventListener('click', this.clickOther)
    if (routers && this.path == '/') {
        this.$router.push({
        path: routers[0].path,
        });
    }
  },
  methods: {
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        this.$router.replace('/login')
      })
    },
    clickOther() {
      this.showlist = false
    }
  },
  beforeDestroy() { // 实例销毁之前对点击事件进行解绑
    window.removeEventListener('click', this.clickOther)
  }
}
</script>
<style lang="less" scoped>
.page {
  width: 100%;
  .header {
    width: 100%;
    height: 82px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #7676ff;
    h1 {
      margin: 0;
    }
    .logo {
      width: 204px;
      height: 60px;
      margin-left: 44px;
      img {
        width: 136px;
        height: 58px;
      }
    }
    .nav {
      flex: 1;
      position: relative;
      margin-right: 40px;
      display: flex;
      justify-content: flex-start;
      color: #ffffff;
      a {
        position: relative;
        height: 82px;
        line-height: 82px;
        // margin-left: 40px;
        font-size: 20px;
        span {
          padding: 10px 20px;
        }
      }
      .isactive {
        border-bottom: 2px solid #55cec7;
        background: #d4d6ff;
      }
      .router-link-active {
        // border-bottom: 2px solid #55cec7;
        // background: #d4d6ff;
        // color: #7474ff;
        span {
          background: #d4d6ff;
          color: #7474ff;
          border-radius: 25px;
        }
      }
    }
  }
  //退出登录
  .loginout {
    width: 200px;
    margin-right: 10px;
    display: flex;
    align-items: center;
    position: relative;
    cursor: pointer;
    i {
      &.avatar {
        font-size: 32px;
      }
      font-size: 22px;
      color: #fff;
    }
    .user_img {
      width: 36px;
      height: 36px;
      margin-right: 10px;
    }
    span {
      font-size: 20px;
      color: #ffffff;
      &.username {
        margin-left: 10px;
        max-width: 100px;
        display: block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    img {
      width: 22px;
      height: 22px;
      vertical-align: middle;
    }
    .list {
      position: absolute;
      left: -7px;
      top: 58px;
      font-size: 18px;
      color: #7676ff;
      background: #fff;
      border: 1px solid #eee;
      text-align: center;
      line-height: 34px;
      padding: 20px;
      z-index: 100;
      .exit_img {
        width: 22px;
        height: 22px;
        margin-right: 3px;
        vertical-align: text-bottom;
      }
      .item {
        display: inline-block;
        cursor: pointer;
        margin-bottom: 12px;
        &:last-child {
          margin-bottom: 0px;
        }
        // &:hover {
        //   background: rgba(122, 217, 251, 0.6);
        // }
      }
    }
  }
  .navSub {
    text-align: left;
    width: 90%;
    margin: 30px auto 0;
    a {
      padding: 15px 0;
      color: #666;
      margin-right: 40px;
    }

    .router-link-active {
      border-bottom: 1.5px solid #1973cc;
      background: rgba(122, 217, 251, 0);
    }
    .line {
      width: 100%;
      height: 2px;
      background: linear-gradient(90deg, #1973cc, #1973cc, #55cec7);
      opacity: 0.25;
      margin-top: 18px;
    }
  }
}
</style>
