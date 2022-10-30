<template>
<div class="app-container calendar-list-container">
  <el-row>
    <el-col :span="6" class="col-mt">
      <el-tree
        class="filter-tree"
        :data="treeData"
        node-key="id"
        highlight-current
        :props="defaultProps"
        ref="menuTree"
        @node-click="getNodeData"
        default-expand-all
        :expand-on-click-node="false"
        >
      </el-tree>
    </el-col>
    <el-col :span="18"  class="col-mt">
      <el-card class="box-card">
      <el-form :label-position="labelPosition" label-width="80px" :model="form" ref="form">
        <el-form-item label="名称" prop="name">
            <el-input v-model="form.name" :disabled="formEdit"  placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="编码" prop="bh">
            <el-input v-model="form.bh" :disabled="formEdit"  placeholder="请输入编码"></el-input>
        </el-form-item>
        <el-form-item label="父级节点" prop="parentId">
            <el-input v-model="form.parentId" :disabled="formEdit" placeholder="请输入父级节点" readonly></el-input>
        </el-form-item>
        <el-form-item label="描述"   prop="description">
            <el-input v-model="form.description" :disabled="formEdit" placeholder="请输入描述"></el-input>
        </el-form-item>
      </el-form>
      </el-card>
    </el-col>
  </el-row>
</div>
</template>

<script>
import {
  getDepartmentsByToken
} from '@/api/orgMgr/admin/index'
import { mapGetters } from 'vuex'
export default {
  name: 'adminMenu',
  components: {
  },
  data() {
    return {
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      labelPosition: 'right',
      formEdit:true,
      form: {
        name: undefined,
        bh: undefined,
        parentId: undefined,
        description: undefined,
      },
    }
  },
  watch: {
  },
  computed: {
    ...mapGetters([
      'elements'
    ])
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      getDepartmentsByToken().then(data => {
        this.treeData = data
      })
    },
    getNodeData(data) {
      this.form = data
    },
   
  }
}
</script>

