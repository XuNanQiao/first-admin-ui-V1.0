<template>
  <div class="app-container">
    <el-tabs class="tabs-mt" v-model="activeName">
      <el-tab-pane v-for="item in tabMapOptions" :label="item.name" :key='item.id' :name="item.code">
        <keep-alive>
          <tab-pane v-if='activeName==item.code' :type='item.id'></tab-pane>
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import tabPane from './components/groupDetail'
import {
  getAllGroupTypes
} from '@/api/admin/group/index'
export default {
  name: 'group',
  components: {
    tabPane
  },
  data() {
    return {
      tabMapOptions: [
      ],
      activeName: 'role'
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      getAllGroupTypes().then(data => {
        this.tabMapOptions = data
      })
    }
  }
}
</script>

