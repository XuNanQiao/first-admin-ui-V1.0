分页组件使用
1.引用组件
import pagination from "@/components/Pagination";
2调用mixin 实现首尾按钮（禁用、点击）逻辑处理
import forbidden from "@/mixins/index.js";
3.需要组件传递的值
下面btnStartDisabled，btnEndDisabled，pageIndex，zys，jumpFirstPage，jumpLastPage这几个主要是为了控制首页，尾页按钮禁用状态必传值，否则首页尾页一直可点击
父向子传值f开头驼峰写法
子向父to开头驼峰写法
total如果已经获取总长度了就不用total
<pagination
    @toHandleSizeChange="handleSizeChange"
    @toHandleCurrentChange="handleCurrentChange"
    @toJumpFirstPage="jumpFirstPage"
    @toJumpLastPage="jumpLastPage"
    :fTotal="total"
    :fBtnStartDisabled="btnStartDisabled"
    :fBtnEndDisabled="btnEndDisabled"
    :fPageIndex="pageIndex"
    :fZys="zys"
    >
</pagination>
4.全局混入主要是为了在自己的组件不需要再次判断首页尾页按钮禁用情况，如果全局混入有问题直接就把混入的js放在自己的组件内调用
5.分页样式都在组件内，无特殊情况不需要自己组件添加样式
6.在组件内留了插槽
7 后端分页情况下handleSizeChange特殊处理
因框架自身封装问题 @size-change="handleSizeChange" 会调用2次handleSizeChange方法
第一次 当前页码*每页展示条数
第二次 计算完成后 页码 * 每页展示条数 
为了防止第二次返回结果晚于第一次返回结果导致页码展示bug 需手动处理禁止一次 if( this.pageIndex > Math.ceil(this.total/val)) return 
handleSizeChange(val) {
    if( this.pageIndex > Math.ceil(this.total/val)) return 
    this.getPaginationList()  //获取数据的方法
},