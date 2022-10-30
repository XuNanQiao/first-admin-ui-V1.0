<template>
  <div class="page">
    <div v-if="ieShow">
      <Browserprompt></Browserprompt>
    </div>
    <div v-else class="login-container" v-show="!autoLogin">
      <el-form class="login-form" autocomplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left">
        <img class="logo" src="../../assets/image/logo.png" alt />
        <div class="title-container flex">
          <h3 class="title">账号登录</h3>
        </div>
        <el-form-item prop="username">
          <span class="svg-container ">
            <img src="../../assets/image/user_icon.png" alt />
          </span>
          <el-input name="username" v-model="loginForm.username" autocomplete="off" placeholder="请输入手机号/邮箱/账号" />
        </el-form-item>
        <el-form-item prop="password">
          <span class="svg-container ">
            <img src="../../assets/image/pasword_icon.png" alt="" />
          </span>
          <el-input name="password" :type="passwordType" @keyup.enter.native="handleLogin" v-model="loginForm.password" autocomplete="off" placeholder="请输入登录密码" @focus="clearPassword" />
          <span class="show-pwd" @click="showPwd">
            <span class="svg-container ">
              <img :src="eyeType" alt="" width="20px" />
            </span>
          </span>
          <div class="global_error" v-if="errorPasstext">{{errorPasstext}}</div>
        </el-form-item>
        <div class="captcha">
          <el-form-item prop="code">
            <span class="svg-container s">
              <img src="../../assets/image/yzm_icon .png" alt />
            </span>
            <el-input v-model="loginForm.code" auto-complete="off" placeholder="请输入右侧4位数字" size @keyup.enter.native="handleLogin('loginForm')" @focus="clearCode" />
          </el-form-item>
          <div class="captcha_code" @click.prevent="refreshCode">
            <img :src="codeImg" alt="">
          </div>
        </div>
        <div class="loginBtn">
          <el-button type="primary" :loading="loading" @click.native.prevent="handleLogin">登录
          </el-button>
        </div>
      </el-form>
      <div class="swiper-box">
        <div class="swiper">
          <div class="swiper-wrapper">
            <div class="swiper-slide">
              <img src="../../assets/kxt/1.png" alt="" srcset="">
            </div>
            <div class="swiper-slide">
              <img src="../../assets/kxt/2.png" alt="" srcset="">
            </div>
            <div class="swiper-slide">
              <img src="../../assets/kxt/3.png" alt="" srcset="">
            </div>
          </div>
          <div class="swiper-pagination"></div>
        </div>
      </div>
    </div>
    <div class="auto-login" v-show="autoLogin">
      3s自动跳转，<span @click="cancelLogin">取消</span>
    </div>
  </div>
</template>

<script>
import { getImage, check } from '@/api/login.js'
import { isIE } from '@/utils/validate'
import Browserprompt from '@/components/Browserprompt'
import Swiper from 'swiper'
import 'swiper/css/swiper.min.css'
export default {
  components: {
    Browserprompt
  },
  name: 'login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入登录账号'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入密码'))
      } else {
        callback()
      }
    }
    const validateCode = (rule, value, callback) => {
      if (value) {
        var params = {
          uuid: this.uuid,
          code: value
        }
        check(params).then(res => {
          if (res.status == 200) {
            callback()
          } else if (res.status == 7001) {
            callback(new Error('验证码超时，请重新获取'))
          } else if (res.status == 7002) {
            callback(new Error('验证码有误'))
          }
        })
      } else {
        callback(new Error('请填写验证码'))
      }
    }
    return {
      autoLogin: false,
      isShowIcon: false,
      countState: '',
      countTime: 2,
      countText: '',
      ieShow: false, // 浏览器兼容页面提示
      loginForm: {
        username: 'admin',
        password: 'admin',
        code: ''
      },
      loginRules: {
        username: [
          { required: true, trigger: 'blur', validator: validateUsername }
        ],
        password: [
          { required: true, trigger: 'blur', validator: validatePassword }
        ],
        code: [{ required: false, validator: validateCode, trigger: 'blur' }]
      },
      passwordType: 'password',
      eyeImgrul: require('../../assets/image/eye.png'),
      eyeOpenImgrul: require('../../assets/image/eye-open.png'),
      eyeType: '',
      loading: false,
      timer: null,
      codeImg: '',
      uuid: this.generateUUID(),
      errorUserNametext: '',
      errorPasstext: ''
    }
  },
  methods: {
    clearUserName() {
      this.errorUserNametext = ''
      this.$refs['loginForm'].clearValidate(['username'])
    },
    clearPassword() {
      this.errorPasstext = ''
      this.$refs['loginForm'].clearValidate(['password'])
    },
    clearCode() {
      this.$refs['loginForm'].clearValidate(['code'])
    },
    getImg() {
      var params = {
        uuid: this.uuid
      }
      getImage(params).then(res => {
        this.codeImg = window.URL.createObjectURL(res)
      })
    },
    generateUUID() {
      var d = new Date().getTime()
      var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0
        d = Math.floor(d / 16)
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16)
      })
      return uuid
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
        this.eyeType = this.eyeOpenImgrul
      } else {
        this.passwordType = 'password'
        this.eyeType = this.eyeImgrul
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true
          this.$store
            .dispatch('LoginByUsername', this.loginForm)
            .then((res) => {
              this.loading = false
              this.$router.push({ path: '/' })
            })
            .catch((data) => {
              // if (data.status === 1005) {
              //   this.errorUserNametext = '账号输入错误'
              // }
              // if (data.status === 1008) {
              //   this.errorPasstext = '密码输入错误'
              // }
              //if (data.status !== 200) {
              //}
              this.$message.error('账号或密码输入错误')
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    refreshCode() {
      this.uuid = this.generateUUID()
      this.getImg()
    },
    goBackFun() {
      this.$router.push('/firstpage')
    },
    // 路由跳转
    skipRouter() {
      this.$router.push('/register')
    },
    cancelLogin() {
      clearTimeout(this.timer)
      this.autoLogin = false
    }
  },
  mounted() {
    this.eyeType = this.eyeImgrul
    this.getImg()
    var mySwiper = new Swiper('.swiper', {
      loop: true, // 循环模式选项
      autoplay: true, // 可选选项，自动滑动
      speed: 1000, //滑动速度
      // 如果需要分页器
      pagination: {
        el: '.swiper-pagination'
      }
    })
  },
  created() {
    this.ieShow = isIE()
  }
}
</script>

<style rel="stylesheet/less" lang="less" scoped>
@import '../../style/font.less';
.page {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.login-container {
  position: relative;
  height: 100vh;
  background: url('../../assets/image/bg.png') no-repeat;
  background-size: cover;
  .swiper-box {
    position: absolute;
    top: 25%;
    left: 80px;
    width: 600px;
    overflow: hidden;
  }
  .login-form {
    position: absolute;
    top: 25%;
    right: 215px;
    padding: 40px 40px 60px;
    background: #fff;
    .el-input {
      width: 400px;
      /deep/ .el-input__inner {
        height: 54px;
        line-height: 54px;
        background-color: #adaeff;
        color: #fff;
        border: none;
        border-radius: 40px;
        padding-left: 50px;
      }
      /deep/ input::-webkit-input-placeholder {
        color: #fff;
      }

      /deep/ input::-moz-input-placeholder {
        color: #fff;
      }

      /deep/ input::-ms-input-placeholder {
        color: #fff;
      }
    }
  }
  .logo {
    width: 120px;
    height: 40px;
  }
  /deep/ .el-form-item {
    margin: 0 auto 30px;
  }
  /deep/ .el-form-item__content {
    position: relative;
  }
  /deep/ .el-form-item__error {
    left: 20px;
  }
  .svg-container {
    position: absolute;
    left: 20px;
    top: 10px;
    width: 30px;
    z-index: 2;
    img {
      width: 20px;
      height: 20px;
    }
  }

  .title-container {
    position: relative;
    .title {
      font-size: 26px;
      color: #7575fe;
      margin: 20px auto;
      text-align: center;
      font-weight: bold;
    }

    .set-language {
      color: #fff;
      position: absolute;
      top: 5px;
      right: 0px;
    }

    .long {
      width: 1px;
      height: 40px;
      background: #fff;
      position: relative;
      top: -20px;
    }
  }

  .show-pwd {
    // width: 10px;
    // height: 10px;
    position: absolute;
    right: 20px;
    top: 6px;
    font-size: 16px;
    color: #889aa4;
    cursor: pointer;
    user-select: none;
  }
}

// 验证码区域
.captcha {
  margin: 0 auto;
  display: flex;
}
.captcha /deep/ .el-input {
  width: 280px !important;
  /deep/ .el-input__inner {
    width: 280px !important;
  }
}
.captcha /deep/.el-form-item {
  margin: 0 0 30px !important;
}
.captcha_code {
  width: 118px;
  height: 48px;
  border-radius: 40px;
  margin-left: 2px;
  box-sizing: border-box;
  background: #adaeff;
  cursor: pointer;
  img {
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 40px;
  }
}
.loginBtn .el-button {
  width: 400px;
  border-radius: 40px;
  height: 54px;
  background: #7575fe;
  border: none;
  /deep/ span {
    font-size: 20px;
  }
}
input::-ms-reveal {
  display: none;
}

.login-container .el-input input:-webkit-autofill {
  -webkit-text-fill-color: #fff !important;
  box-shadow: 0 0 0px 1000px rgba(255, 255, 255, 0) inset !important;
  background-color: transparent;
  background-image: none;
  transition: background-color 50000s ease-in-out 10s;
}
//
.swiper img {
  width: 600px;
}
.s2 {
  width: 600px;
}
.swiper {
  --swiper-pagination-color: #b1b1ff; /* 两种都可以 */
}
/deep/.swiper-pagination-bullet {
  width: 40px !important;
  height: 20px !important;
  border-radius: 30px;
  margin: 20px 40px 0 !important;
}
</style>
