<template>
  <div class="pagination">
    <slot name="head"></slot>
    <el-button type="button" :disabled="fBtnStartDisabled" @click="jumpFirstPage" class="my-btn">首页</el-button>
    <el-pagination ref="pagination" background @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="fPageSize" layout="prev, pager, next,slot,sizes" prev-text="上一页" next-text="下一页" :total="fTotal" :current-page="fPageIndex">
      <el-button type="button" @click="jumpLastPage" class="my-btn" style="margin: 0px 5px" :disabled="fBtnEndDisabled">尾页</el-button>
    </el-pagination>
  </div>
</template>
<script>
export default {
  props: {
    // 可以选中的每页条数
    fPageSize: {
      type: Array,
      default: () => {
        return [10, 20, 30]
      }
    },
    // total总条数
    fTotal: {
      type: Number,
      default: 0
    },
    // 当前页数
    fPageIndex: {
      type: Number,
      default: 1
    },
    // 总页数
    fZys: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      fBtnStartDisabled: true,
      fBtnEndDisabled: true
    }
  },
  computed: {
    isFirstDisabled() {
      return this.fPageIndex === 1
    },
    isLastDisabled() {
      return this.fZys === this.fPageIndex
    }
  },
  watch: {
    fPageIndex() {
      this.computedDisabled()
    },
    fZys() {
      this.computedDisabled()
    }
  },
  mounted() {
    this.computedDisabled()
  },
  methods: {
    computedDisabled() {
      this.fBtnStartDisabled = this.isFirstDisabled
      this.fBtnEndDisabled = this.isLastDisabled
    },
    //   每页条数
    handleSizeChange(val) {
      this.$emit('toHandleSizeChange', val)
    },
    // 页码
    handleCurrentChange(val) {
      this.$emit('toHandleCurrentChange', val)
    },
    // 首页按钮
    jumpFirstPage() {
      this.$emit('toJumpFirstPage', 1)
    },
    // 尾页按钮
    jumpLastPage() {
      this.$emit('toJumpLastPage', this.fZys)
    }
  }
}
</script>
<style rel="stylesheet/less" lang="less">
@import '../../style/font.less';
.pagination {
  display: flex;
  * {
    font-size: @font14!important;
  }
}
</style>
<style rel="stylesheet/less" lang="less" scoped>
// 分页样式
/deep/ .el-pagination.is-background .btn-next,
/deep/ .el-pagination.is-background .btn-prev,
/deep/ .el-pagination.is-background .el-pager li {
  // width: 40px;
  height: 40px;
  line-height: 40px;
  background: #ffffff;
  border: 1px solid #ededed;
  border-radius: 4px;
}
/deep/ .el-pagination.is-background .btn-next,
/deep/ .el-pagination.is-background .btn-prev,
/deep/ .el-pagination.is-background .el-pager li {
  padding: 0px 15px;
  height: 44px;
  background: #ffffff;
  border: 1px solid #ededed;
  border-radius: 4px;
  line-height: 0;
  vertical-align: middle;
}
/deep/ .my-btn {
  padding: 0px 10px;
  height: 44px;
  line-height: 0px;
  background: #ffffff;
  border: 1px solid #ededed;
  border-radius: 4px;
  vertical-align: middle;
  color: #606266;
}
/deep/ .my-btn:hover {
  color: #606266;
}
/deep/ .el-pagination.is-background .el-pager li {
  line-height: 44px;
  color: #999;
  font-weight: 400;
}
/deep/ .el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: #5c7fff;
}
/deep/ .el-pagination .el-select .el-input .el-input__inner {
  line-height: 44px;
  height: 44px;
}
/deep/ .el-button.is-disabled {
  color: #c0c4cc;
}
/deep/ .el-pagination {
  padding: 0;
}
/deep/ .el-pagination__sizes,
/deep/ .el-pagination .el-select .el-input {
  margin: 0;
}
</style>
