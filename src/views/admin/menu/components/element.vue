<template>
  <div class="app-container calendar-list-container">
    <div class="flex">
      <el-input @keyup.enter.native="handleFilter" class="filter-item input-width-small" placeholder="资源名称" v-model="listQuery.name"> </el-input>
      <el-button class="filter-item btn_table_primary" type="primary" icon="search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item btn-ml btn_table_primary" v-if="menuManager_btn_element_add" @click="handleCreate" type="primary" icon="edit">添加</el-button>
    </div>
    <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row class="table-width">
      <el-table-column align="center" label="id" width="50">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
    <el-table-column align="center" label="资源编码">
      <template slot-scope="scope">
        <span>
          {{scope.row.code}}
        </span>
      </template>
    </el-table-column>
    <el-table-column  align="center" label="资源类型">
      <template slot-scope="scope">
        <span>
          {{scope.row.type}}
        </span>
      </template>
    </el-table-column>
    <el-table-column  align="center" label="资源名称">
      <template slot-scope="scope">
        <span>
          {{scope.row.name}}
        </span>
      </template>
    </el-table-column>
    <el-table-column  align="center" label="资源地址">
      <template slot-scope="scope">
        <span>
          {{scope.row.uri}}
        </span>
      </template>
    </el-table-column>
    <el-table-column  align="center" label="请求类型">
      <template slot-scope="scope">
        <span>
          {{scope.row.method}}
        </span>
      </template>
    </el-table-column>
    <el-table-column align="center" label="描述">
      <template slot-scope="scope">
        <span>
          {{scope.row.description}}
        </span>
      </template>
    </el-table-column>
    <el-table-column fixed="right" align="center" label="操作" width="140">
      <template slot-scope="scope">
        <el-button v-if="menuManager_btn_element_edit" size="small" type="success" @click="handleUpdate(scope.row)" class="btn_table_success">
          编辑
        </el-button>
        <el-button v-if="menuManager_btn_element_del" size="small" type="danger" @click="handleDelete(scope.row)" class="btn_table_danger">
          删除
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
      <el-form-item label="资源编码" prop="code">
        <el-input v-model="form.code" placeholder="请输入资源编码"></el-input>
      </el-form-item>
      <el-form-item label="资源类型" prop="type">
         <el-select class="filter-item" v-model="form.type" placeholder="请输入资源类型">
          <el-option v-for="item in  typeOptions" :key="item" :label="item" :value="item"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="资源名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入资源名称"></el-input>
      </el-form-item>
      <el-form-item label="资源地址" prop="uri">
        <el-input v-model="form.uri" placeholder="请输入资源地址"></el-input>
      </el-form-item>
      <el-form-item label="请求类型" prop="method">
        <el-select class="filter-item" v-model="form.method" placeholder="请输入请求类型">
          <el-option v-for="item in  methodOptions" :key="item" :label="item" :value="item"> </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel('form')">取 消</el-button>
      <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')" class="btn_table_primary">确 定</el-button>
      <el-button v-else type="primary" @click="update('form')" class="btn_table_primary">确 定</el-button>
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
} from '@/api/admin/element/index'
import { mapGetters } from 'vuex'
import Pagination from '@/components/Pagination'
import forbidden from '@/utils/comMixin.js'
export default {
  name: 'menuElement',
  mixins: [forbidden],
  components: {
    Pagination
  },
  // props: {
  //   menuId: {
  //     default: '1'
  //   }
  // },
  data() {
    return {
      methodOptions: ['GET', 'POST', 'PUT', 'DELETE'],
      typeOptions: ['uri', 'button'],
      form: {
        code: undefined,
        type: undefined,
        name: undefined,
        uri: undefined,
        menuId: undefined,
        method: undefined,
        description: undefined
      },
      rules: {
        code: [{
          required: true,
          message: '请输入资源编码',
          trigger: 'blur'
        },
        {
          min: 1,
          max: 100,
          message: '长度在 1 到 100 个字符',
          trigger: 'blur'
        }
        ],
        type: [{
          required: true,
          message: '请输入资源类型',
          trigger: 'blur'
        },
        {
          min: 1,
          max: 100,
          message: '长度在 1 到 100 个字符',
          trigger: 'blur'
        }
        ],
        name: [{
          required: true,
          message: '请输入资源名称',
          trigger: 'blur'
        },
        {
          min: 1,
          max: 100,
          message: '长度在 3 到 100 个字符',
          trigger: 'blur'
        }
        ],
        uri: [{
          required: true,
          message: '请输入',
          trigger: 'blur'
        },
        {
          min: 1,
          max: 100,
          message: '长度在 1 到 100 个字符',
          trigger: 'blur'
        }
        ],
        method: [{
          required: true,
          message: '请输入请求类型',
          trigger: 'blur'
        },
        {
          min: 1,
          max: 100,
          message: '长度在 1 到 100 个字符',
          trigger: 'blur'
        }
        ],
        description: [{
          required: true,
          message: '请输入',
          trigger: 'blur'
        },
        {
          min: 1,
          max: 100,
          message: '长度在 1 到 100 个字符',
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
        menuId: this.menuId
      },
      dialogFormVisible: false,
      dialogStatus: '',
      menuManager_btn_element_add: false,
      menuManager_btn_element_edit: false,
      menuManager_btn_element_del: false,
      menuId: -1,
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
    this.menuManager_btn_element_add = this.elements['menuManager:btn_element_add']
    this.menuManager_btn_element_del = this.elements['menuManager:btn_element_del']
    this.menuManager_btn_element_edit = this.elements['menuManager:btn_element_edit']
  },
  computed: {
    ...mapGetters([
      'elements'
    ])
  },
  methods: {
    getList() {
      this.listLoading = true
      this.listQuery.menuId = this.menuId
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
      const set = this.$refs
      this.form.menuId = this.menuId
      set[formName].validate(valid => {
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
      const set = this.$refs
      set[formName].resetFields()
    },
    update(formName) {
      const set = this.$refs
      this.form.menuId = this.menuId
      set[formName].validate(valid => {
        if (valid) {
          // this.dialogFormVisible = false
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
}
</style>
