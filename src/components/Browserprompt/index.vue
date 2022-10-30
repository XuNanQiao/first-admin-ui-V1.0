<template>
  <div id="browserPromt">
    <div class="content">
      <h1>浏览器版本太低</h1>
      <h3>为保障使用顺畅和安全，建议您使用以下浏览器</h3>
      <div class="module">
        <a :href="item.path" v-for="(item, index) in downLoad" :key="index"  target="_blank">
          <img class="logo" :src="item.imgSrc" alt="" />
          <p>{{ item.name }}</p>
        </a>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      baseImg: require('@/assets/image/base.png'),
      downLoad: [
        {
          name: 'Chrome浏览器最新版',
          imgSrc: require('@/assets/image/chrome.png'),
          path: 'https://www.google.cn/chrome/'
        },
        {
          name: '360浏览器最新版',
          imgSrc: require('@/assets/image/360.png'),
          path: 'http://browser.360.cn/'
        },
        {
          name: 'Edge浏览器最新版',
          imgSrc: require('@/assets/image/Edge.png'),
          path: 'https://www.microsoft.com/zh-cn/edge'
          // path: "https://microsoft-edge.softonic.cn/"
        }
      ]
    }
  }
}
</script>
<style scoped rel="stylesheet/less" lang="less">
    @import '../../style/font.less';
#browserPromt {
    // min-height: 100%;
  height: 100vh;
  width: 100%;
  background: #f3f7fd url("../../assets/image/base.png") center 300px no-repeat;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  .content {
    width: 90%;
    height: 790px;
    background: #fff;
    h1 {
      height: 36px;
      font-size: 36px;
      font-weight: 400;
      color: @c333;
      margin: 180px 0px 35px;
    }
    h3 {
      height: 25px;
      font-size: 24px;
      font-weight: 400;
      color: @c333;
      margin: 0px 0px 70px;
    }
    .module {
      width: 60%;
      margin: 0 auto;
      display: flex;
      justify-content: space-around;
      img.logo {
        height: 110px;
        width: 110px;
      }
      p {
        height: 20px;
        font-size: 20px;
        font-weight: 400;
        color: @c666;
        margin: 11px 0px 0px;
      }
    }
  }
}
</style>
