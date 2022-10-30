<template>
  <div class='app-container'>
    <div class="name">当前题库名称：{{bankForm.name}}
      <span  class="el-icon-back back" @click="goback">返回题库列表</span>
    </div>
    
    <div class="flex-between">
      <div class="font14">已分享列表 </div>
      <el-button class="btn_table_primary" type="primary"  @click="getShareForm">分享</el-button>
    </div>
    <el-table border :data="listData" highlight-current-row fit>
      <el-table-column align="center" label="序号" width="65" type="index">
      </el-table-column>
      <el-table-column align="center" label="题库名称" width="300">
        <template slot-scope="scope">
          <span>
            {{scope.row.name}}
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="分享对象" width="300">
        <template slot-scope="scope">
          <span>
            {{scope.row.usernameClient}}
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="时间范围" width="300">
        <template slot-scope="scope">
          <span>
            {{scope.row.endTime}}
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container" v-if="total > 0">
      <Pagination 
        @toHandleSizeChange="handleSizeChange"
        @toHandleCurrentChange="handleCurrentChange"
        @toJumpFirstPage="jumpFirstPage"
        @toJumpLastPage="jumpLastPage"
        :fTotal="total"
        :fBtnStartDisabled="btnStartDisabled"
        :fBtnEndDisabled="btnEndDisabled"
        :fPageIndex="pageIndex"
        :fZys="zys"
      >
      </Pagination>
    </div>
    <el-dialog title="分享" :visible.sync="addDialog" @close="closeDialog">
      <el-select v-model="shareForm.usernameClient" placeholder="请选择分享对象">
        <el-option v-for="item in shareTeacherList" :key="item.id" :label="item.username" :value="item.username"></el-option>
      </el-select>
      <div slot="footer" class="dialog-footer">
          <el-button @click="closeDialog">取消</el-button>
          <el-button type="primary" class="btn_table_primary" @click="suerShare">确定</el-button>
        </div>
    </el-dialog>
  </div>
</template>

<script>
import {getExamQuestionBankShareByUserName,getUsersByTeacher,InsertQuestionbankshare} from '@/api/questionBank'
import Pagination from '@/components/Pagination/index'
import forbidden from "@/utils/comMixin"
export default {
  components: {
    Pagination,
  },
  mixins:[forbidden],
  data() {
    return {
      list: [],
      listData: [],
      btnStartDisabled: true, //用来判断首页按钮是否禁用
      btnEndDisabled: false, //用来判断尾页按钮是否禁用
      zys: 0, //判断总页数
      total: 0, // 页数
      pageIndex:1,
      pageSize:10,
      bankForm:{}, //题库信息
      shareForm :{
        name:'',
        courseId:'',
        usernameClient:''
      },
      addDialog:false,
      shareTeacherList:[],
    }
  },
  mounted() {
    this.bankForm = JSON.parse(sessionStorage.getItem('bankForm'))
    this.getlist()
  },
  methods: {
    closeDialog() {
      this.addDialog = false
      this.shareForm.usernameClient = ''
    },
    suerShare() {
      this.shareForm.name = this.bankForm.name
      this.shareForm.courseId = this.bankForm.courseId
      if(this.shareForm.usernameClient) {
        InsertQuestionbankshare(this.shareForm).then(res=>{
          if(res.status == 200) {
            this.closeDialog()
            this.getlist()
          }
        })
      }
    },
    getShareForm() {
      getUsersByTeacher().then(res =>{
        if(res.status == 200) {
          this.shareTeacherList = res.data
          this.addDialog = true
        }
      })
    },
    goback() {
      this.$router.go(-1)
    },
    getlist() {
      getExamQuestionBankShareByUserName().then(res => {
        if(res.status == 200) {
          this.list = res.data
          this.total = this.list.length
          this.getTableList()
        }
      })
    },
    getTableList() {
      this.zys = Math.ceil(this.total / this.pageSize) // 获取总页数
      // 调用混入方法判断首页尾页按钮禁用的方法
      this.forbidden(this.zys, this.pageIndex)
      this.listData = this.list.slice(
        (this.pageIndex - 1) * this.pageSize,
        this.pageSize * this.pageIndex
      )
    },
    handleSizeChange(val) {
      this.pageSize = val;
    },
    handleCurrentChange(val) {
      this.pageIndex = val;
    },
    // 首页按钮
    jumpFirstPage(val) {
      this.handleCurrentChange(val);
    },
    // 尾页按钮
    jumpLastPage(val) {
      this.handleCurrentChange(val);
    },
  },
}
</script>
<style lang='less' scoped>
.back {
  cursor: pointer;
  margin-left: 10px;
  color: #5c7fff;
}
.name {
  font-size: 18px;
  margin-bottom: 40px;
}
.title {
  margin:0 20px;
  &:nth-child(1) {
    margin-left:0 ;
  }
}
.el-input,.el-select {
  width: 300px !important;
  margin-right: 10px;
}
.el-table{
  margin-top: 40px !important;
}
</style>
