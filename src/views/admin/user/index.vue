<template>
<div class="app-container">
  <div class="flex">
    <el-input @keyup.enter.native="handleFilter" placeholder="姓名" v-model="listQuery.name"> </el-input>
    <el-input @keyup.enter.native="handleFilter" placeholder="组织结构" v-model="listQuery.orgs"> </el-input>
    <el-button class="btn_table_primary" type="primary"  icon="search" @click="handleFilter">搜索</el-button>
    <el-button  v-if="userManager_btn_add" @click="handleCreate" class="btn_table_primary" type="primary" icon="edit">添加</el-button>
  </div>
  <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row >
    <el-table-column align="center" label="序号" width="65"> <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template> </el-table-column>
      <el-table-column  align="center" label="姓名"> <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template> </el-table-column>
      <el-table-column  align="center" label="账户"> <template slot-scope="scope">
          <span>{{scope.row.username}}</span>
        </template> </el-table-column>
      <el-table-column  align="center" label="性别"> <template slot-scope="scope">
          <span>{{scope.row.sex}}</span>
        </template> </el-table-column>
      <el-table-column align="center" label="所属组织"> <template slot-scope="scope">
            <span>{{scope.row.sex}}</span>
          </template> </el-table-column>
    <el-table-column  align="center" label="备注"> <template slot-scope="scope">
          <span>{{scope.row.description}}</span>
        </template> </el-table-column>
      <el-table-column  align="center" label="最后时间"> <template slot-scope="scope">
          <span>{{scope.row.updTime}}</span>
        </template> </el-table-column>
    <el-table-column  align="center" label="最后更新人"> <template slot-scope="scope">
            <span>{{scope.row.updName}}</span>
          </template> </el-table-column>
    <el-table-column align="center" label="操作" > <template slot-scope="scope">
        <el-button v-if="userManager_btn_edit" size="small" type="success" @click="handleUpdate(scope.row)" class="btn_table_success">编辑
        </el-button>
        <el-button v-if="userManager_btn_del" size="small" type="danger" @click="handleDelete(scope.row)" class="btn_table_danger">删除
        </el-button>
      </template> </el-table-column>
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
      <el-form-item label="姓名" prop="name">
        <el-input v-model="form.name" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item label="账户" prop="username">
        <el-input v-if="dialogStatus == 'create'" v-model="form.username" placeholder="请输入账户"></el-input>
        <el-input v-else v-model="form.username" placeholder="请输入账户" readonly></el-input>
      </el-form-item>
      <el-form-item v-if="dialogStatus == 'create' || dialogStatus == 'update'" label="密码" placeholder="请输入密码" prop="password">
        <el-input type="password" v-model="form.password"></el-input>
      </el-form-item>
      <el-form-item label="性别">
        <el-select class="filter-item" v-model="form.sex" placeholder="请选择">
          <el-option v-for="item in  sexOptions" :key="item" :label="item" :value="item"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="描述">
        <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 5}" placeholder="请输入内容" v-model="form.description"> </el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel('form')">取 消</el-button>
      <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')" class="btn_table_primary">保 存</el-button>
      <el-button v-else type="primary" @click="update('form')" class="btn_table_primary">更 新</el-button>
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
} from '@/api/admin/user/index'
import { mapGetters } from 'vuex'
import Pagination from '@/components/Pagination'
import forbidden from '@/utils/comMixin.js'
export default {
  name: 'user',
  mixins: [forbidden],
  components: {
    Pagination
  },
  data() {
    return {
      form: {
        username: undefined,
        name: undefined,
        sex: '男',
        password: undefined,
        description: undefined
      },
      rules: {
        name: [
          {
            required: true,
            message: '请输入用户',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 20,
            message: '长度在 3 到 20 个字符',
            trigger: 'blur'
          }
        ],
        username: [
          {
            required: true,
            message: '请输入账户',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 20,
            message: '长度在 3 到 20 个字符',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: this.dialogStatus == 'create',
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            min: 5,
            max: 20,
            message: '长度在 5 到 20 个字符',
            trigger: 'blur'
          }
        ]
      },
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        name: undefined,
        orgs: undefined
      },
      sexOptions: ['男', '女'],
      dialogFormVisible: false,
      dialogStatus: '',
      userManager_btn_edit: false,
      userManager_btn_del: false,
      userManager_btn_add: false,
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
    this.userManager_btn_edit = this.elements['userManager:btn_edit']
    this.userManager_btn_del = this.elements['userManager:btn_del']
    this.userManager_btn_add = this.elements['userManager:btn_add']
  },
  computed: {
    ...mapGetters([
      'elements'
    ])
  },
  methods: {
    getList() {
      this.listLoading = true
      page(this.listQuery)
        .then(response => {
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
      if (this.listQuery.page > Math.ceil(this.total / val)) return
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
      getObj(row.id)
        .then(response => {
          this.form = response.data
          this.dialogFormVisible = true
          this.form.password = ''
          this.dialogStatus = 'update'
        })
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          delObj(row.id)
            .then(() => {
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
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          addObj(this.form)
            .then(() => {
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
          // this.form.password = undefined
          // console.log(this.form)
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
