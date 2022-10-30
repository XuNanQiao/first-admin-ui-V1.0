<template>
<div class="app-container calendar-list-container">
  <div class="filter-container">
    <!-- <el-button-group>
      <el-button class="btn_table_primary" type="primary"  icon="plus" disabled>添加</el-button>
      <el-button class="btn_table_primary" type="primary"  icon="edit" disabled>编辑</el-button>
      <el-button class="btn_table_primary" type="primary"  icon="delete" disabled>删除</el-button>
    </el-button-group> -->
  </div>
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
    <el-col :span="17" :offset="1" class="col-mt">
      <div class="flex">
        <el-input @keyup.enter.native="handleFilter" placeholder="姓名" v-model="listQuery.Name"> </el-input>
        <el-input @keyup.enter.native="handleFilter" placeholder="账户" v-model="listQuery.UserName"> </el-input>
        <el-button class="filter-item btn_table_primary" type="primary"  icon="search" @click="handleFilter">搜索</el-button>
      </div>
      <list-table :list="listData"></list-table>
      <div class="pagination-container" v-if="total > 0">
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
    </el-col>
  </el-row>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination/index'
import listTable from '../components/ListTable'
import {
  getDepartmentsByToken, getUsersByDpmt
} from '@/api/orgMgr/admin/index'
import { mapGetters } from 'vuex'
import forbidden from '@/utils/comMixin'
export default {
  name: 'educationMenu',
  components: {
    listTable,
    Pagination
  },
  mixins: [forbidden],
  data() {
    return {
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      listQuery: {
        Name: '',
        UserName: '',
        DepartmentBh: '',
        Type: 2
      },
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
      this.listQuery.DepartmentBh = data.bh
      var params = {
        DepartmentBh: this.listQuery.DepartmentBh,
        Type: this.listQuery.Type
      }
      getUsersByDpmt(params).then(res => {
        if (res.status == 200) {
          this.list = res.data
          this.total = this.list.length
          this.getTableList()
        }
      })
    },
    handleFilter() {
      var params = {
        DepartmentBh: this.listQuery.DepartmentBh,
        Type: this.listQuery.Type,
        Name: this.listQuery.Name,
        UserName: this.listQuery.UserName
      }
      getUsersByDpmt(params).then(res => {
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

<style lang="less" scoped>
.el-input {
  width: 300px !important;
  margin-right: 10px;
}
</style>
