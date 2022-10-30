<template>
  <div class="app-container calendar-list-container">
    <el-form :model="from_passChange" ref="from_passChange" label-width="100px">
      <div class="pass_box">
        <el-form-item label="旧密码：" prop="oldPassword">
          <el-input
            type="password"
            @blur="checkPass(from_passChange.oldPassword)"
            @change="checkPass(from_passChange.oldPassword)"
            class="pass_input"
            :maxlength="8"
            v-model="from_passChange.oldPassword"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <span class="xing">*</span>
        <span class="error_text" v-show="error_text1">请输入旧密码！</span>
        <span class="error_text" v-show="error_text2">旧密码错误，请查证后重新输入！</span>
      </div>
      <div class="pass_box mr20">
        <el-form-item label="新密码：" prop="newPassword">
          <el-input
            type="password"
            @blur="inputPass(from_passChange.newPassword)"
            @change="inputPass(from_passChange.newPassword)"
            @input="inputPass(from_passChange.newPassword)"
            class="pass_input"
            :maxlength="8"
            v-model="from_passChange.newPassword"
            placeholder="请输入8位字符，必须含大小写字母和数字"
          ></el-input>
        </el-form-item>
        <span class="xing">*</span>
        <span class="error_text" v-show="error_text5">请输入新密码！</span>
        <span class="error_text" v-show="error_text6">请输入8位字符，必须含大小写字母和数字！</span>
        <span class="error_text" v-show="error_text7">与旧密码相同，请重新设置！</span>
      </div>
      <div class="pass_box mr20">
        <el-form-item label="确认新密码：" prop="confirmNewPassword">
          <el-input
            @keyup.enter.native="passOkChange"
            type="password"
            @blur="inputFunction(from_passChange.confirmNewPassword)"
            @change="inputFunction(from_passChange.confirmNewPassword)"
            @input="inputFunction(from_passChange.confirmNewPassword)"
            class="pass_input"
            :maxlength="8"
            v-model="from_passChange.confirmNewPassword"
            placeholder="请输入新密码"
          ></el-input>
        </el-form-item>
        <span class="xing">*</span>
        <span class="error_text" v-show="error_text3">请输入确认新密码！</span>
        <span class="error_text" v-show="error_text4">两次密码不一致，请重新输入！</span>
      </div>
    </el-form>
    <div class="btn_linear pass_btn" @click="passOkChange">确 认</div>
  </div>
</template>

<script>
import { updatePassObj } from '@/api/admin/menu/index'
export default {
  data() {
    return {
      isShowIcon: false,
      countState: '',
      countTime: 2,
      countText: '',
      error_text1: false,
      error_text2: false,
      error_text3: false,
      error_text4: false,
      error_text5: false,
      error_text6: false,
      error_text7: false,
      from_passChange: {
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      }
    }
  },
  components: {
  },
  methods: {
    // 修改密码
    passOkChange() {
      if (this.error_text6) {
        return false
      }
      this.$refs['from_passChange'].validate((valid) => {
        if (valid) {
          if (this.from_passChange.oldPassword !== '') {
            if (
              this.from_passChange.confirmNewPassword ===
              this.from_passChange.newPassword
            ) {
              updatePassObj(this.from_passChange).then((res) => {
                if (res.status === 200 && res.message === '处理成功') {
                  this.isShowIcon = true
                  this.countText = '修改成功！'
                  this.countState = 'success'
                  setTimeout(() => {
                    this.$emit('passIndexLink', true)
                  }, 2000)
                  this.from_passChange = {
                    oldPassword: '',
                    newPassword: '',
                    confirmNewPassword: ''
                  }
                } else if (
                  res.status === 500 &&
                  res.message === '旧密码输入错误'
                ) {
                  this.error_text2 = true
                  this.error_text1 = false
                } else if (
                  res.status === 500 &&
                  res.message === '两次输入的新密码不一致'
                ) {
                  this.error_text4 = true
                  this.error_text3 = false
                } else {
                  this.isShowIcon = true
                  this.countText = res.message
                  this.countState = 'error'
                }
              })
            } else {
              return false
            }
          } else {
            this.error_text1 = true
            this.error_text2 = false
          }
        }
      })
    },
    // input输入检测判断
    checkPass(value) {
      if (!value) {
        this.error_text2 = false
        this.error_text1 = true
      } else {
        this.error_text1 = false
      }
    },
    inputPass(e) {
      if (e.length > 0 && e === this.from_passChange.oldPassword) {
        this.error_text7 = true
        this.error_text5 = false
        this.error_text6 = false
      } else if (
        e.length > 0 &&
        e === e.replace(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8}$/)
      ) {
        this.error_text6 = true
        this.error_text5 = false
        this.error_text7 = false
      } else if (!e) {
        this.error_text5 = true
        this.error_text6 = false
        this.error_text7 = false
      } else {
        this.error_text5 = false
        this.error_text6 = false
        this.error_text7 = false
      }
    },
    inputFunction(e) {
      if (e.length > 0 && e !== this.from_passChange.newPassword) {
        this.error_text3 = false
        this.error_text4 = true
      } else if (!e) {
        this.error_text3 = true
        this.error_text4 = false
      } else {
        this.error_text3 = false
        this.error_text4 = false
      }
    }
  }
}
</script>
<style lang="less" scoped>
.pass_result {
  width: 100%;
  height: 100%;
  padding: 170px 0 150px 0;
  box-sizing: border-box;
  background: #fff;
  .pass_bigBox {
    width: 43%;
    margin: 0 auto;
    .pass_box {
      position: relative;
      display: flex;
      /deep/ .el-form-item__content {
        margin-left: 125px !important;
      }
      /deep/ .el-form-item__label {
        width: 125px !important;
        font-size: 18px;
        line-height: 51px;
        font-weight: normal;
      }
      /deep/ .el-form-item__error {
        color: #fc4f1dff;
        font-size: 16px;
        padding-top: 5px;
      }
      .pass_input {
        /deep/ .el-input__inner {
          width: 430px;
          height: 51px;
          font-size: 18px;
          border: 3px solid #e7ecef;
          border-radius: 4px;
        }
      }
      // 去掉验证前面的*
      /deep/ .el-form-item.is-required .el-form-item__label:before,
      /deep/ .el-icon-upload:before {
        content: "";
      }
      // input后面加星号
      .xing {
        font-size: 36px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #ff3a4c;
        margin: 10px 0px 0px 20px;
      }
    }
    .error_text {
      position: absolute;
      top: 55px;
      left: 125px;
      color: #fc4f1dff;
      font-size: 16px;
    }
    .pass_btn {
      margin: 60px 0 0 125px;
      width: 430px;
      height: 60px;
      font-size: 22px;
      line-height: 60px;
      background: linear-gradient(90deg, #1156b0, #1973cc, #55cec7);
      box-shadow: 0px 5px 10px 0px rgba(9, 50, 110, 0.4);
      border: 2px solid linear-gradient(90deg, #1973cc, #55cec7) 2 2;
    }
  }
  .change_pass {
    cursor: pointer;
    float: right;
    margin: 10px 44px 0 0;
    color: #1973cc;
  }
}

.mr20 {
  margin-top: 20px;
}

.btn_linear {
  width: 120px;
  height: 46px;
  font-size: 18px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #ffffff;
  text-align: center;
  line-height: 46px;
  cursor: pointer;
  background: linear-gradient(90deg, #1156b0, #1973cc, #55cec7);
  border-radius: 4px;
}

.app-container {
  padding: 0px 20px !important;
}
</style>
