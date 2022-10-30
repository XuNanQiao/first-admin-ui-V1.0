<template>
  <div class='app-container'>
    <div class="flex-end">
      <!-- <el-button class="filter-item btn_table_primaty" type="primary" @click="dialogFormVisible = true">
        添加
      </el-button> -->
    </div>
    <el-table :data="listData" border highlight-current-row fit>
      <el-table-column align="center" label="序号" width="65" type="index">
      </el-table-column>
      <el-table-column align="center" label="学期" width="300">
        <template slot-scope="scope">
          <span>
            {{scope.row.termName}}
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="科目名称" width="300">
        <template slot-scope="scope">
          <span>
            {{scope.row.courseName}}
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
    <el-dialog title="添加课程" :visible.sync="dialogFormVisible" @close="closeDialog">
      <el-form :model="addform" :rules="rules" ref="addform" label-width="100px">
        <el-form-item label="资源类型" prop="type">
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="success" @click="closeDialog">取 消</el-button>
        <el-button type="primary" class="btn_table_primary">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getExamATerm, getQueryClass, getTermSubjectQuery, getTeacherByExamACourseTerm, InstallExamACourseTerm } from '@/api/coursesMgr/index'
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
      termList: [],
      classList: [],
      btnStartDisabled: true, // 用来判断首页按钮是否禁用
      btnEndDisabled: false, // 用来判断尾页按钮是否禁用
      zys: 0, // 判断总页数
      total: 0, // 页数
      pageIndex: 1,
      pageSize: 10,
      dialogFormVisible: false,
      addform: {},
      rules: {}
    }
  },

  mounted() {
    this.getList()
  },

  methods: {
    closeDialog() {
      this.$refs.addform.resetFields()
      this.dialogFormVisible = false
    },
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
      getTeacherByExamACourseTerm().then(res => {
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
