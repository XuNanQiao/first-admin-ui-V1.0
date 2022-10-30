<template>
  <div class='app-container'>
    <div class="flex-align-center">
      <span class="title">学期：</span>
      <el-select v-model="searchFrom.TermId" placeholder="请选择学期" clearable filterable>
        <el-option v-for="item in termList" :label="item.name" :value="item.id"></el-option>
      </el-select>
      <span class="title">名称：</span>
      <el-input placeholder="请输入课程名称" v-model="searchFrom.CourseName"></el-input>
      <span class="title">教师：</span>
      <el-input placeholder="请输入教师名称或编号" v-model="searchFrom.UserName"></el-input>
      <span class="title">班级：</span>
      <el-select v-model="searchFrom.DepartmentId" placeholder="请选择班级" clearable filterable>
        <el-option v-for="item in classList" :label="item.fullname" :value="item.id"></el-option>
      </el-select>
      <el-button class="filter-item btn_table_primary" type="primary" icon="search" @click="getList">
        搜索
      </el-button>
    </div>
    <el-table :data="listData" border highlight-current-row fit>
      <el-table-column align="center" label="序号" width="65" type="index">
      </el-table-column>
      <el-table-column align="center" label="学期" width="200">
        <template slot-scope="scope">
          <span>
            {{scope.row.termName}}
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="科目名称" width="200">
        <template slot-scope="scope">
          <span>
            {{scope.row.courseName}}
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="任课老师" width="200">
        <template slot-scope="scope">
          <span>
            {{scope.row.teacherName}}
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="班级">
        <template slot-scope="scope">
          <span>
            {{scope.row.departmentFullname}}
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="200">
        <el-button type="success" size="small" disabled class="btn_table_success">
          编辑
        </el-button>
        <el-button type="danger" size="small" disabled class="btn_table_danger">
          删除
        </el-button>
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
import { getExamATerm, getQueryClass, getTermSubjectQuery } from '@/api/coursesMgr/index'
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
      searchFrom: {
        TermId: '',
        CourseName: '',
        UserName: '',
        DepartmentId: ''
      },
      termList: [],
      classList: [],
      btnStartDisabled: true, // 用来判断首页按钮是否禁用
      btnEndDisabled: false, // 用来判断尾页按钮是否禁用
      zys: 0, // 判断总页数
      total: 0, // 页数
      pageIndex: 1,
      pageSize: 10
    }
  },

  mounted() {
    this.getList()
    this.getExamATerm()
    this.getQueryClass()
  },

  methods: {
    getExamATerm() {
      getExamATerm().then(res => {
        if (res.status == 200) {
          this.termList = res.data
        }
      })
    },
    getQueryClass() {
      getQueryClass().then(res => {
        if (res.status == 200) {
          this.classList = res.data
        }
      })
    },
    getList() {
      getTermSubjectQuery(this.searchFrom).then(res => {
        if (res.status == 200) {
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
.el-select,.el-input {
  width: 300px !important;
  margin-right: 12px;
}
.el-table {
  margin-top: 20px;
}
</style>
