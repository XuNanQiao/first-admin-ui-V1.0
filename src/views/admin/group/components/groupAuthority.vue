<template>
    <el-row>
        <el-col :span="24">
            <el-button class="btn_table_primary" type="primary" v-if="groupManager_menu" @click="update">保存</el-button>
        </el-col>
        <el-col :span="8" class="col-mt">
            <el-input placeholder="输入关键字进行过滤" v-model="filterText"> </el-input>
            <el-tree :expand-on-click-node="fasle" class="filter-tree" check-strictly :node-key="getTreeNodeKey" :data="treeData" show-checkbox node-key="id" highlight-current :props="defaultProps" :filter-node-method="filterNode" ref="menuTree" @node-click="getNodeData" default-expand-all>
            </el-tree>
        </el-col>
        <el-col :span="16" class="col-mt">
            <el-table ref="elementTable" :data="list" border fit highlight-current-row @select-all="handleSelectAll" @select="handleSelectionChange" class="table-width">
                <el-table-column v-if="groupManager_element" type="selection" align="center"> </el-table-column>
                <el-table-column align="center" label="资源名称"><template slot-scope="scope">
                        <span>
                            {{scope.row.name}}</span>
                    </template>
                </el-table-column>
                <el-table-column  align="center" label="资源编码"><template slot-scope="scope">
                        <span>
                            {{scope.row.code}}</span>
                    </template>
                </el-table-column>
                <el-table-column  align="center" label="资源类型"><template slot-scope="scope">
                        <span>
                            {{scope.row.type}}</span>
                    </template>
                </el-table-column>
                <el-table-column  align="center" label="资源地址"><template slot-scope="scope">
                        <span>
                            {{scope.row.uri}}</span>
                    </template>
                </el-table-column>
                <el-table-column  align="center" label="请求类型"><template slot-scope="scope">
                        <span>
                            {{scope.row.method}}</span>
                    </template>
                </el-table-column>
            </el-table>
        </el-col>

    </el-row>

</template>
<script>
import {
  fetchTree
} from '@/api/admin/menu/index'
import {
  page
} from '@/api/admin/element/index'
import {
  removeElementAuthority,
  addElementAuthority,
  getElementAuthority,
  modifyMenuAuthority,
  getMenuAuthority,
  removeElementAuthorityBatch,
  addElementAuthorityBatch
} from '@/api/admin/group/index'
import { mapGetters } from 'vuex'
export default {
  name: 'groupAuthority',
  props: {
    groupId: {
      default: '1'
    }
  },
  data() {
    return {
      filterText: '',
      list: null,
      total: null,
      listQuery: {
        name: undefined
      },
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      groupManager_menu: false,
      groupManager_element: false
      //   currentId: -1
    }
  },
  watch: {
    filterText(val) {
      this.$refs.menuTree.filter(val)
    }
  },
  created() {
    this.getList()
    this.groupManager_menu = this.elements['groupManager:menu']
    this.groupManager_element = this.elements['groupManager:element']
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
        this.initAuthoritys()
      })
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    getNodeData(data) {
      this.listQuery.menuId = data.id
      page(this.listQuery).then(response => {
        this.list = response.data.rows
        getElementAuthority(this.groupId).then(data => {
          const obj = {}
          for (let i = 0; i < this.list.length; i++) {
            obj[this.list[i].id] = this.list[i]
          }
          const toggle = {}
          for (let i = 0; i < data.data.length; i++) {
            const id = data.data[i]
            if (obj[id] !== undefined && toggle[id] === undefined) {
              this.$refs.elementTable.toggleRowSelection(obj[data.data[i]])
              toggle[id] = true
            }
          }
        })
      })
      this.currentId = data.id
      this.showElement = true
    },
    getTreeNodeKey(node) {
      return node.id
    },
    handleSelectAll(selection) {
      let addFlag = false
      if (selection && selection.length > 0) {
        addFlag = true
      }
      const elementIds = []
      for (let i = 0; i < this.list.length; i++) {
        const row = this.list[i]
        elementIds.push(row.id)
      }
      removeElementAuthorityBatch(this.groupId, {
        elementIds: elementIds.join(',')
      }).then(() => {
        if (addFlag) {
          addElementAuthorityBatch(this.groupId, {
            elementIds: elementIds.join(',')
          })
        }
      })
    },
    handleSelectionChange(val, row) {
      let flag = true
      for (let i = 0; i < val.length; i++) {
        if (val[i].id === row.id) {
          addElementAuthority(this.groupId, {
            menuId: this.currentId,
            elementId: row.id
          })
          flag = false
          break
        }
      }
      if (flag) {
        removeElementAuthority(this.groupId, {
          menuId: this.currentId,
          elementId: row.id
        })
      }
    },
    update() {
      this.$emit('closeAuthorityDialog')
      const nodes = this.$refs.menuTree.getCheckedNodes()
      const ids = []
      for (let i = 0; i < nodes.length; i++) {
        ids.push(nodes[i].id)
      }
      modifyMenuAuthority(this.groupId, {
        menuTrees: ids.join()
      }).then(() => {
        this.$notify({
          title: '成功',
          message: '保存成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    initAuthoritys() {
      getMenuAuthority(this.groupId).then(data => {
        const result = []
        for (let i = 0; i < data.data.length; i++) {
          result.push(data.data[i].id)
        }
        this.$refs.menuTree.setCheckedKeys(result)
      })
    }
  }
}
</script>
