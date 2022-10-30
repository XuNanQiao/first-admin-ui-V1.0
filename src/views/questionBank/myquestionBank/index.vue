<template>
  <div class='app-container'>
    <el-table border :data="listData" highlight-current-row fit>
      <el-table-column align="center" label="序号" width="65" type="index">
      </el-table-column>
      <el-table-column align="center" label="题库名称" width="300">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="题库类型" width="100">
        <template slot-scope="scope">
          <span>
            {{scope.row.bankType | getbankType}}
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="所属人" width="300">
        <template slot-scope="scope">
          <span>
            {{scope.row.bankType == '0'? scope.row.username : scope.row.usernameClient}}
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" width="300">
        <template slot-scope="scope">
          <span>
            {{scope.row.startTime}}
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button class="btn_table_success" type="success" v-if="scope.row.bankType == 0"  size="small" @click="goDetail(scope.row)">试题管理</el-button>
          <el-button class="btn_table_primary" type="danger"  v-if="scope.row.bankType == 0" size="small" @click="goShare(scope.row)">分享</el-button>
          <el-button class="btn_table_primary" type="danger"  v-if="scope.row.bankType == 1" size="small" @click="goDetail(scope.row)">查看</el-button>
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
  </div>
</template>

<script>
import { getExamQuestionBankShare } from '@/api/questionBank'
import Pagination from '@/components/Pagination/index'
import forbidden from '@/utils/comMixin'
export default {
  components: {
    Pagination
  },
  mixins: [forbidden],
  data() {
    return {
      list: [],
      listData: [],
      btnStartDisabled: true, // 用来判断首页按钮是否禁用
      btnEndDisabled: false, // 用来判断尾页按钮是否禁用
      zys: 0, // 判断总页数
      total: 0, // 页数
      pageIndex: 1,
      pageSize: 10
    }
  },
  computed: {
  },
  mounted() {
    this.getlist()
  },
  methods: {
    getlist() {
      getExamQuestionBankShare().then(res => {
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
      this.pageSize = val
      this.getTableList()
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.getTableList()
    },
    // 首页按钮
    jumpFirstPage(val) {
      this.handleCurrentChange(val)
    },
    // 尾页按钮
    jumpLastPage(val) {
      this.handleCurrentChange(val)
    },
    goDetail(item) {
      sessionStorage.setItem('bankForm',JSON.stringify(item))
      this.$router.push({
        path: '/questionBank/managetest'
      })
    },
    goShare(item) {
      sessionStorage.setItem('bankForm',JSON.stringify(item))
      this.$router.push({
        path: '/questionBank/share'
      })
    }
  },
  filters: {
    getbankType(type) {
      if (type == 0) {
        return '自建'
      }
      if (type == 1) {
        return '被分享'
      }
    }
  }
}
</script>
<style lang='less' scoped>
.el-table{
  margin-top: 20px !important;
}
</style>
