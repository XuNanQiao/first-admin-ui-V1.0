<template>
<el-row>
  <el-col :span="24" class="btn_right">
    <!-- <el-button-group> -->
      <el-button class="btn_linear" v-if="groupManager_btn_add" icon="plus" @click="handlerAdd">添加</el-button>
      <el-button class="btn_linear" v-if="groupManager_btn_edit" icon="edit" @click="handlerEdit">编辑</el-button>
      <el-button class="btn_linear" v-if="groupManager_btn_del" icon="delete" @click="handleDelete">删除</el-button>
      <el-button class="btn_linear" v-if="groupManager_btn_resourceManager" @click="handlerAuthority">
        权限分配</el-button>
      <el-button class="btn_linear" v-if="groupManager_btn_userManager" @click="handlerUser">
        关联用户</el-button>
    <!-- </el-button-group> -->
  </el-col>
  <el-col :span="8" class="col-mt">
    <el-input placeholder="输入关键字进行过滤" v-model="filterText"> </el-input>
    <el-tree :expand-on-click-node="false" class="filter-tree" :data="treeData" node-key="id" highlight-current :props="defaultProps" :filter-node-method="filterNode" ref="groupTree" @node-click="getNodeData" default-expand-all> </el-tree>
  </el-col>
  <el-col :span="16" class="col-mt">
    <el-form :label-position="labelPosition" label-width="80px" :model="form" ref="form" :rules="rules">
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" :disabled="formEdit"></el-input>
      </el-form-item>
      <el-form-item label="编码" prop="code">
        <el-input v-model="form.code" :disabled="formEdit"></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model="form.description" :disabled="formEdit"></el-input>
      </el-form-item>
      <el-form-item v-if="formStatus == 'update'">
        <el-button @click="onCancel">取 消</el-button>
        <el-button type="primary" v-if="groupManager_btn_edit" @click="update">更 新</el-button>
      </el-form-item>
      <el-form-item v-if="formStatus == 'create'">
        <el-button @click="onCancel">取 消</el-button>
        <el-button type="primary" v-if="groupManager_btn_add" @click="create">保 存</el-button>
      </el-form-item>
    </el-form>
  </el-col>
  <el-dialog :title="dialogUserName" :visible.sync="dialogUserVisible">
    <group-user :groupId="currentId" @closeUserDialog="closeUserDialog" ref="groupUser"></group-user>
  </el-dialog>
  <el-dialog :title="dialogAuthorityName" size="large" :visible.sync="dialogAuthorityVisible">
    <group-authority :groupId="currentId" @closeAuthorityDialog="closeAuthorityDialog" ref="groupAuthority"></group-authority>
  </el-dialog>
</el-row>
</template>

<script>
import {
  fetchTree,
  getObj,
  addObj,
  delObj,
  putObj
} from '@/api/admin/group/index'
import { mapGetters } from 'vuex'
export default {
  name: 'groupDetail',
  components: {
    'group-user': () => import('./groupUser'),
    'group-authority': () => import('./groupAuthority')
  },
  props: {
    type: {
      default: '1'
    }
  },
  data() {
    return {
      filterText: '',
      list: null,
      total: null,
      formEdit: true,
      formAdd: true,
      formStatus: '',
      dialogUserVisible: false,
      dialogUserName: '关联用户',
      dialogAuthorityVisible: false,
      dialogAuthorityName: '关联资源',
      listQuery: {
        groupType: this.type,
        name: undefined
      },
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      labelPosition: 'right',
      groupManager_btn_edit: false,
      groupManager_btn_del: false,
      groupManager_btn_add: false,
      groupManager_btn_userManager: false,
      groupManager_btn_resourceManager: false,
      form: {
        code: undefined,
        name: undefined,
        description: undefined,
        groupType: this.type
      },
      currentId: -1,
      rules: {
        name: [
          {
            required: true,
            message: '请输入名称',
            trigger: 'blur'
          },
          {
            min: 1,
            // max: 22,
            message: '名称不可为空',
            trigger: 'blur'
          }
        ],
        code: [
          {
            required: true,
            message: '请输入编码',
            trigger: 'blur'
          },
          {
            min: 1,
            // max: 22,
            message: '编码不可为空',
            trigger: 'blur'
          }
        ],
        description: [
          {
            required: true,
            message: '请输入描述',
            trigger: 'blur'
          },
          {
            min: 1,
            // max: 22,
            message: '描述不可为空',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.groupTree.filter(val)
    }
  },
  created() {
    this.getList()
    console.log(this.elements, this.elements['groupManager:btn_del'], this.elements['groupManager:btn_edit'])
    this.groupManager_btn_edit = this.elements['groupManager:btn_edit']
    this.groupManager_btn_del = this.elements['groupManager:btn_del']
    this.groupManager_btn_add = this.elements['groupManager:btn_add']
    this.groupManager_btn_userManager = this.elements['groupManager:btn_userManager']
    this.groupManager_btn_resourceManager = this.elements['groupManager:btn_resourceManager']
  },
  computed: {
    ...mapGetters([
      'elements'
    ])
  },
  methods: {
    getList() {
      fetchTree(this.listQuery).then(data => {
        this.treeData = data
      })
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    getNodeData(data) {
      if (!this.formEdit) {
        this.formStatus = 'update'
      }
      getObj(data.id).then(response => {
        this.form = response.data
      })
      this.currentId = data.id
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
      if (this.form.id) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delObj(this.currentId).then(() => {
            this.getList()
            this.resetForm()
            this.onCancel()
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
          })
        })
      }
    },
    update() {
      putObj(this.form.id, this.form).then(() => {
        this.getList()
        this.$notify({
          title: '成功',
          message: '创建成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    create() {
      const set = this.$refs
        .form.validate(valid => {
          if (valid) {
            addObj(this.form)
              .then((res) => {
                console.log(res)
                if (res.status == 200) {
                  this.getList()
                  this.$notify({
                    title: '成功',
                    message: '创建成功',
                    type: 'success',
                    duration: 2000
                  })
                } else {
                  this.getList()
                  this.$notify({
                    title: '失败',
                    message: '保存失败,用户名已存在',
                    type: 'error',
                    duration: 2000
                  })
                }
              })
          } else {
            return false
          }
        })
    },
    onCancel() {
      this.formEdit = true
      this.formStatus = ''
    },
    resetForm() {
      this.form = {
        parentId: this.currentId,
        code: undefined,
        name: undefined,
        description: undefined,
        groupType: this.type
      }
    },
    handlerUser() {
      if (this.form.id) {
        this.dialogUserVisible = true
        if (this.$refs.groupUser !== undefined) {
          // this.$refs.groupUser.groupId = this.currentId
          this.$refs.groupUser.initUsers()
          this.$refs.groupUser.remoteLeaderMethod()
        }
      }
    },
    handlerAuthority() {
      if (this.form.id) {
        this.dialogAuthorityVisible = true
        if (this.$refs.groupAuthority !== undefined) {
          // this.$refs.groupAuthority.groupId = this.currentId
          this.$refs.groupAuthority.initAuthoritys()
        }
      }
    },
    closeUserDialog() {
      this.dialogUserVisible = false
    },
    closeAuthorityDialog() {
      this.dialogAuthorityVisible = false
    }
  }
}
</script>
<style lang="less" scoped>
.btn_right{
  display: flex;
  justify-content: flex-end;
}

.btn_linear{
  background: linear-gradient(90deg, #1156b0, #1973cc, #55cec7);
  color: #fff;
}
</style>
