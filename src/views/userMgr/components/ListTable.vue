<template>
  <div class="table">
    <el-table
      :data="list"
      border
      highlight-current-row
    >
      <el-table-column align="center" label="id" width="65">
        <template slot-scope="scope">
          <span>
            {{ scope.row.id }}
          </span>
        </template>
      </el-table-column>
      <el-table-column   align="center" label="姓名">
        <template slot-scope="scope">
          <span>
            {{ scope.row.name }}
          </span>
        </template>
      </el-table-column>
      <el-table-column   align="center" label="账号">
        <template slot-scope="scope">
          <span>
            {{ scope.row.username }}
          </span>
        </template>
      </el-table-column>
      <el-table-column width="100" align="center" label="类型">
        <template slot-scope="scope">
          <span>
            {{scope.row.type | getType}}
          </span>
        </template>
      </el-table-column>
      <el-table-column width="200" align="center" label="所属组织">
        <template slot-scope="scope">
          <span>
            {{ scope.row.departmentBh }}
          </span>
        </template>
      </el-table-column>
      <el-table-column  align="center" label="手机号">
        <template slot-scope="scope">
          <span>
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button
            size="small"
            type="success"
            disabled
            class="btn_table_success"
          >
            编辑
          </el-button>
          <el-button
            size="small"
            type="danger"
            disabled
            class="btn_table_danger"
            >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'list-table',
  props: {
    list: {
      type: Array,
      required: true
    }
  },
  components: {},
  data() {
    return {
      type: [
        {
          label: '超管',
          value: 1
        },
        {
          label: '教务',
          value: 2
        },
        {
          label: '教师',
          value: 3
        },
        {
          label: '学生',
          value: 4
        }
      ]
    }
  },
  computed: {},
  mounted() {},
  filters: {
    getType(type) {
      if (type == 1) {
        return '超管'
      }
      if (type == 2) {
        return '教务'
      }
      if (type == 3) {
        return '教师'
      }
      if (type == 4) {
        return '学生'
      }
    }
  },
  methods: {
  }
}
</script>
<style lang='less' scoped>
.el-table {
  margin-top: 20px;
}
</style>
