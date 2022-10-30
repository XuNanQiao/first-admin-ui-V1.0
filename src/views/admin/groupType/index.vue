<template>
<div class="app-container calendar-list-container">
  <div class="flex">
    <el-input @keyup.enter.native="handleFilter" placeholder="姓名或账户" v-model="listQuery.name"> </el-input>
    <el-button class="filter-item btn_table_primary" type="primary"  icon="search" @click="handleFilter">搜索</el-button>
    <el-button class="filter-item btn-ml btn_table_primary" v-if="groupTypeManager_btn_add" @click="handleCreate" type="primary" icon="edit">添加</el-button>
  </div>
  <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row >
    <el-table-column align="center" label="id" width="65">
      <template slot-scope="scope">
        <span>
          {{scope.row.id}}
        </span>
      </template>
    </el-table-column>
    <el-table-column width="120px" align="center" label="编码">
      <template slot-scope="scope">
        <span>
          {{scope.row.code}}
        </span>
      </template>
    </el-table-column>
    <el-table-column width="120px" align="center" label="类型名称">
      <template slot-scope="scope">
        <span>
          {{scope.row.name}}
        </span>
      </template>
    </el-table-column>
    <el-table-column width="200px" align="center" label="描述">
      <template slot-scope="scope">
        <span>
          {{scope.row.description}}
        </span>
      </template>
    </el-table-column>
        <el-table-column width="200px" align="center" label="最后更新时间">
          <template slot-scope="scope">
            <span>
              {{scope.row.updTime}}
            </span>
          </template>
    </el-table-column>
        <el-table-column width="200px" align="center" label="最后更新人">
          <template slot-scope="scope">
            <span>
              {{scope.row.updName}}
            </span>
          </template>
    </el-table-column>
        <el-table-column  align="center" label="最后更新主机">
          <template slot-scope="scope">
            <span>
              {{scope.row.updHost}}
            </span>
          </template>
    </el-table-column>
    <el-table-column align="center" label="操作" width="200">
      <template slot-scope="scope">
        <el-button v-if="groupTypeManager_btn_edit" size="small" type="success" @click="handleUpdate(scope.row)" class="btn_table_success">
          编辑
        </el-button>
        <el-button v-if="groupTypeManager_btn_del" size="small" type="danger" @click="handleDelete(scope.row)" class="btn_table_danger">删除
        </el-button>
      </template>
    </el-table-column>
  </el-table>
  <div v-show="!listLoading" class="pagination-container">
      <Pagination
      @toHandleSizeChange="handleSizeChange"
      @toHandleCurrentChange="handleCurrentChange"
      @toJumpFirstPage="jumpFirstPage"
      @toJumpLastPage="jumpLastPage"
      :fTotal="total"
      :fBtnStartDisabled="btnStartDisabled"
      :fBtnEndDisabled="btnEndDisabled"
      :fPageIndex="listQuery.page"
      :fZys="zys"
    >
    </Pagination>
  </div>
  <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
    <el-form :model="form" :rules="rules" ref="form" label-width="100px">
      <el-form-item label="编码" prop="code">
        <el-input v-model="form.code" placeholder="请输入编码"></el-input>
      </el-form-item>
      <el-form-item label="类型名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入类型名称"></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model="form.description" placeholder="请输入描述"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel('form')" >取 消</el-button>
      <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')" class="btn_table_success">保 存</el-button>
      <el-button v-else type="primary" @click="update('form')" class="btn_table_success">更 新</el-button>
    </div>
  </el-dialog>
</div>
</template>

<script>
import {
  page,
  addObj,
  getObj,
  delObj,
  putObj
} from '@/api/admin/groupType/index'
import { mapGetters } from 'vuex'
import Pagination from '@/components/Pagination'
import forbidden from '@/utils/comMixin.js'
export default {
  name: 'groupType',
  mixins: [forbidden],
  components: {
    Pagination
  },
  data() {
    return {
      form: {
        code: undefined,
        name: undefined,
        description: undefined
      },
      rules: {
        code: [{
          required: true,
          message: '请输入编码',
          trigger: 'blur'
        }, {
          min: 3,
          max: 20,
          message: '长度在 3 到 20 个字符',
          trigger: 'blur'
        }],
        name: [{
          required: true,
          message: '请输入类型名称',
          trigger: 'blur'
        }, {
          min: 3,
          max: 20,
          message: '长度在 3 到 20 个字符',
          trigger: 'blur'
        }],
        description: [{
          required: true,
          message: '请输入描述',
          trigger: 'blur'
        }, {
          min: 3,
          max: 20,
          message: '长度在 3 到 20 个字符',
          trigger: 'blur'
        }]
      },
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        name: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      groupTypeManager_btn_edit: false,
      groupTypeManager_btn_del: false,
      groupTypeManager_btn_add: false,
      textMap: {
        update: '编辑',
        create: '创建'
      },
      tableKey: 0,
      btnStartDisabled: true, // 用来判断首页按钮是否禁用
      btnEndDisabled: false, // 用来判断尾页按钮是否禁用
      zys: 0, // 判断总页数
      total: 0 // 页数
    }
  },
  created() {
    this.getList()
    this.groupTypeManager_btn_edit = this.elements['groupTypeManager:btn_edit']
    this.groupTypeManager_btn_del = this.elements['groupTypeManager:btn_del']
    this.groupTypeManager_btn_add = this.elements['groupTypeManager:btn_add']
  },
  computed: {
    ...mapGetters([
      'elements'
    ])
  },
  methods: {
    getList() {
      this.listLoading = true
      page(this.listQuery).then(response => {
        this.list = response.data.rows
        this.total = response.data.total
        this.listLoading = false
        this.zys = Math.ceil(this.total / this.listQuery.limit) // 获取总页数
        this.forbidden(this.zys, this.listQuery.page)
      })
    },
    handleFilter() {
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    // 首页按钮
    jumpFirstPage(val) {
      this.listQuery.page = val
      this.handleCurrentChange(val)
    },
    // 尾页按钮
    jumpLastPage(val) {
      this.listQuery.page = val
      this.handleCurrentChange(val)
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    handleUpdate(row) {
      getObj(row.id).then(response => {
        this.form = response.data
        this.dialogFormVisible = true
        this.dialogStatus = 'update'
      })
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delObj(row.id).then(() => {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          const index = this.list.indexOf(row)
          this.list.splice(index, 1)
        })
      })
    },
    create(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          addObj(this.form).then(() => {
            this.dialogFormVisible = false
            this.getList()
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        } else {
          return false
        }
      })
    },
    cancel(formName) {
      this.dialogFormVisible = false
      this.$refs[formName].resetFields()
    },
    update(formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false
          this.form.password = undefined
          putObj(this.form.id, this.form).then(() => {
            this.dialogFormVisible = false
            this.getList()
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        } else {
          return false
        }
      })
    },
    resetTemp() {
      this.form = {
        username: undefined,
        name: undefined,
        sex: '男',
        password: undefined,
        description: undefined
      }
    }
  }
}
</script>
<style lang="less" scoped>
.el-input {
  width: 300px !important;
  margin-right: 10px;
}
.el-table {
  margin-top: 20px;
}
</style>

