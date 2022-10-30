<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container btn_right">
      <div class="btn_linear" v-if="menuManager_btn_add" icon="plus" @click="handlerAdd">添加</div>
      <div
        class="btn_linear btn_l20 "
        v-if="menuManager_btn_edit"
        icon="edit"
        @click="handlerEdit"
      >编辑</div>
      <div
        class="btn_linear btn_l20"
        v-if="menuManager_btn_del"
        icon="delete"
        @click="handleDelete"
      >删除</div>
    </div>
    <el-row>
      <el-col :span="8" class="col-mt input_size">
        <el-input class="col_mt_input" placeholder="输入关键字进行过滤" v-model="filterText"></el-input>
        <el-tree
          class="filter-tree"
          :data="treeData"
          node-key="id"
          highlight-current
          :props="defaultProps"
          :filter-node-method="filterNode"
          ref="menuTree"
          @node-click="getNodeData"
          default-expand-all
          :expand-on-click-node="false"
        ></el-tree>
      </el-col>
      <el-col :span="16" class="col-mt">
        <el-card class="box-card">
          <el-form
            :label-position="labelPosition"
            label-width="80px"
            :model="form"
            ref="form"
            :rules="rules"
          >
            <el-form-item label="路径编码" prop="code">
              <el-input v-model="form.code" :disabled="formEdit" placeholder="请输入路径编码"></el-input>
            </el-form-item>
            <el-form-item label="标题" prop="title">
              <el-input v-model="form.title" :disabled="formEdit" placeholder="请输入标题"></el-input>
            </el-form-item>
            <el-form-item label="父级节点" prop="parentId">
              <el-input v-model="form.parentId" :disabled="formEdit" placeholder="请输入父级节点" readonly></el-input>
            </el-form-item>
            <el-form-item label="图标" prop="icon">
              <!-- <el-input v-model="form.icon" :disabled="formEdit" placeholder="请输入图标"></el-input> -->
              <el-select
                class="filter-item"
                v-model="form.icon"
                :disabled="formEdit"
                placeholder="请选择图标"
              >
                <el-option
                  v-for="item in iconOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <svg-icon
                v-if="form.icon"
                :icon-class="form.icon"
                style="width: 1.5em; height: 1.5em"
              ></svg-icon>
            </el-form-item>

            <!--外部菜单的URL地址,内部菜单可不填-->
            <el-form-item label="资源路径" prop="href">
              <el-input v-model="form.href" :disabled="formEdit" placeholder="请输入资源路径"></el-input>
            </el-form-item>
            <el-form-item label="资源类型" prop="type">
              <el-select
                class="filter-item"
                v-model="form.type"
                :disabled="formEdit"
                placeholder="请输入资源类型"
              >
                <el-option v-for="item in typeOptions" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="排序" prop="orderNum">
              <el-input v-model="form.orderNum" :disabled="formEdit" placeholder="请输入排序"></el-input>
            </el-form-item>
            <el-form-item label="描述" prop="description">
              <el-input v-model="form.description" :disabled="formEdit" placeholder="请输入描述"></el-input>
            </el-form-item>
            <el-form-item label="前端组件" prop="attr1">
              <el-input v-model="form.attr1" :disabled="formEdit" placeholder="请输入描述"></el-input>
            </el-form-item>
            <el-form-item v-if="formStatus == 'update'">
              <el-button @click="onCancel">取 消</el-button>
              <el-button type="primary" @click="update">更 新</el-button>
            </el-form-item>
            <el-form-item v-if="formStatus == 'create'">
              <el-button @click="onCancel">取 消</el-button>
              <el-button type="primary" @click="create">保 存</el-button>
            </el-form-item>
          </el-form>
        </el-card>
        <el-card class="box-card">
          <span class="font18">按钮或资源</span>
          <menu-element :menuId="currentId" ref="menuElement"></menu-element>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  fetchTree,
  getObj,
  addObj,
  delObj,
  putObj
} from '@/api/admin/menu/index'
import { mapGetters } from 'vuex'
export default {
  components: {
    'menu-element': () => import('./element')
  },
  data() {
    return {
      isShowIcon: false,
      countState: '',
      countTime: 2,
      countText: '',
      rules: {
        code: [
          {
            required: true,
            message: '请输入路径编码',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 30,
            message: '长度在 3 到 30 个字符',
            trigger: 'blur'
          }
        ],
        title: [
          {
            required: true,
            message: '请输入标题',
            trigger: 'blur'
          },
          {
            min: 2,
            max: 30,
            message: '长度在 2到 30 个字符',
            trigger: 'blur'
          }
        ],
        icon: [
          {
            required: true,
            message: '请输入图标',
            trigger: 'blur'
          }
        ],
        type: [
          {
            required: true,
            message: '请输入资源类型',
            trigger: 'blur'
          }
        ],
        attr1: [
          {
            required: true,
            message: '请输入前端组件',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 30,
            message: '长度在 3到 30 个字符',
            trigger: 'blur'
          }
        ]
      },
      filterText: '',
      list: null,
      total: null,
      formEdit: true,
      formAdd: true,
      formStatus: '',
      showElement: false,
      typeOptions: ['menu', 'dirt'],
      listQuery: {
        name: undefined
      },
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      labelPosition: 'right',
      form: {
        code: undefined,
        title: undefined,
        parentId: undefined,
        href: undefined,
        icon: undefined,
        orderNum: undefined,
        description: undefined,
        path: undefined,
        enabled: undefined,
        type: undefined,
        attr1: undefined
      },
      currentId: -1,
      menuManager_btn_add: false,
      menuManager_btn_edit: false,
      menuManager_btn_del: false,
      iconOptions: [
        {
          value: 'category',
          label: 'category'
        },
        {
          value: 'delete',
          label: 'delete'
        },
        {
          value: 'edit',
          label: 'edit'
        },
        {
          value: 'form',
          label: 'form'
        },
        {
          value: 'viewlist',
          label: 'viewlist'
        },
        {
          value: 'account',
          label: 'account'
        },
        {
          value: 'add',
          label: 'add'
        },
        {
          value: 'client',
          label: 'client'
        },
        {
          value: 'office',
          label: 'office'
        },
        {
          value: 'gerenzhongxin',
          label: 'gerenzhongxin'
        },
        {
          value: 'accountfilling',
          label: 'accountfilling'
        },
        {
          value: 'setting',
          label: 'setting'
        },
        {
          value: 'fa-user',
          label: 'fa-user'
        },
        {
          value: 'fa-users',
          label: 'fa-users'
        },
        {
          value: 'group',
          label: 'group'
        },
        {
          value: 'group_fill',
          label: 'group_fill'
        },
        {
          value: 'setup_fill',
          label: 'setup_fill'
        },
        {
          value: 'smallscreen_fill',
          label: 'smallscreen_fill'
        },
        {
          value: 'quanxian',
          label: 'quanxian'
        },
        {
          value: 'service',
          label: 'service'
        },
        {
          value: 'quanxian1',
          label: 'quanxian1'
        }
      ]
    }
  },
  watch: {
    filterText(val) {
      this.$refs.menuTree.filter(val)
    }
  },
  mounted() {},
  created() {
    this.getList()
    this.menuManager_btn_add = this.elements['menuManager:btn_add']
    this.menuManager_btn_del = this.elements['menuManager:btn_del']
    this.menuManager_btn_edit = this.elements['menuManager:btn_edit']
  },
  computed: {
    ...mapGetters(['elements'])
  },
  methods: {
    getList() {
      fetchTree(this.listQuery).then((data) => {
        this.treeData = data
      })
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    getNodeData(data) {
      this.$refs['form'].clearValidate() // 移除上次校验的结果
      if (!this.formEdit) {
        this.formStatus = 'update'
      }
      getObj(data.id)
        .then((response) => {
          this.form = response.data
        })
        .catch((error) => {
          console.log(error)
        })
      this.currentId = data.id
      this.showElement = true
      this.$refs.menuElement.menuId = data.id
      this.$refs.menuElement.listQuery.page = 1
      this.$refs.menuElement.getList()
    },
    handlerEdit() {
      if (this.form.id) {
        this.formEdit = false
        this.formStatus = 'update'
      }
    },
    handlerAdd() {
      this.resetForm()
      this.formEdit = false
      this.formStatus = 'create'
    },
    handleDelete() {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delObj(this.currentId).then(() => {
          this.getList()
          this.resetForm()
          this.onCancel()
          this.isShowIcon = true
          this.countText = '删除成功！'
          this.countState = 'success'
        })
      })
    },
    update() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          putObj(this.form.id, this.form).then(() => {
            this.getList()
            this.isShowIcon = true
            this.countText = '更新成功！'
            this.countState = 'success'
          })
        }
      })
    },
    create() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          addObj(this.form).then((res) => {
            if (res.status == 200) {
              this.getList()
              this.isShowIcon = true
              this.countText = '创建成功！'
              this.countState = 'success'
            }
            this.getList()
            this.isShowIcon = true
            this.countText = res.message
            this.countState = 'error'
          })
        }
      })
    },
    onCancel() {
      this.formEdit = true
      this.formStatus = ''
    },
    resetForm() {
      this.form = {
        code: undefined,
        title: undefined,
        parentId: this.currentId,
        href: undefined,
        icon: undefined,
        orderNum: undefined,
        description: undefined,
        path: undefined,
        enabled: undefined
      }
    }
  }
}
</script>
<style lang="less" scoped>
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

.btn_right {
  display: flex;
  justify-content: flex-end;
}

.btn_l20 {
  margin-left: 20px;
}

.input_size /deep/ .el-input--medium .el-input__inner {
  height: 50px;
}

.col-mt {
  background-color: #fff;

  /deep/ .el-form-item__label {
    font-size: 18px;
  }

  /deep/ .el-input--medium .el-input__inner {
    font-size: 18px;
  }

  /deep/ .el-tree-node__label {
    font-size: 18px;
  }

  /deep/ .el-tree-node__content {
    padding: 18px 0;
  }

  .col_mt_input {
    padding: 15px 22px 10px 23px;
    background: #fff;
  }
}

.font18 {
  font-size: 18px;
}

.app-container {
  padding: 0px 20px !important;
}
</style>
