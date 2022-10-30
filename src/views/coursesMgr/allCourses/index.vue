<template>
  <div class='app-container'>
    <div class="flex-align-center">
      <span class="title">编号：</span>
      <el-input @keyup.enter.native="searchCourses" placeholder="请输入编号" v-model="listCourses.Mark"></el-input>
      <span class="title">名称：</span>
      <el-input @keyup.enter.native="searchCourses" placeholder="请输入名称" v-model="listCourses.Name"></el-input>
      <el-button class="filter-item btn_table_primary" type="primary" icon="search" @click="getlist">搜索</el-button>
    </div>
    <el-table border :data="listData" highlight-current-row fit>
      <el-table-column align="center" label="序号" width="65" type="index">
      </el-table-column>
      <el-table-column align="center" label="编号" width="200">
        <template slot-scope="scope">
          <span>{{scope.row.mark}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="名称" width="240">
        <template slot-scope="scope">
          <span>
            {{scope.row.name}}
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="考核方式">
        <template slot-scope="scope">
          <span v-for="(item,index) in scope.row.examStructure" :key="item.testType">
            {{item.testType }}{{item.percent}}%
            <span v-show="!(index == scope.row.examStructure.length-1)">-</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="简介" width="200">
        <template slot-scope="scope">
          <span>
            {{scope.row.moreInfo}}
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="success" size="small" disabled class="btn_table_success">编辑</el-button>
          <el-button type="danger" size="small" disabled class="btn_table_danger">删除</el-button>
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
import { getExamACourse } from '@/api/coursesMgr/index'
import { mapGetters } from 'vuex'
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
      listCourses: {
        Mark: '',
        Name: ''
      },
      btnStartDisabled: true, // 用来判断首页按钮是否禁用
      btnEndDisabled: false, // 用来判断尾页按钮是否禁用
      zys: 0, // 判断总页数
      total: 0, // 页数
      pageIndex: 1,
      pageSize: 10
    }
  },
  computed: {
    ...mapGetters([
      'elements'
    ])
  },
  mounted() {
    this.getlist()
  },
  methods: {
    getlist() {
      getExamACourse(this.listCourses).then(res => {
        this.list = res.data
        this.total = this.list.length
        this.getTableList()
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
    }
  }

}
</script>
<style lang='less' scoped>
.title {
  margin:0 20px;
  &:nth-child(1) {
    margin-left:0 ;
  }
}
.el-input {
  width: 300px !important;
  margin-right: 10px;
}
.el-table{
  margin-top: 20px !important;
}
</style>
