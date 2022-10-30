let forbidden = {
  data() {
    return {
    }
  },
  created() {
   
  },
  methods: {
    forbidden(totalPage = 1, pageNumber = 1) {
      if (totalPage == 1) {
        //只有1页数据首页尾页禁用
        this.btnStartDisabled = true;
        this.btnEndDisabled = true;
      } else if (pageNumber == 1) {
        //点击第一页首页禁用
        this.btnStartDisabled = true;
        this.btnEndDisabled = false;
      } else if (totalPage == pageNumber) {
        //点击最后一页尾页禁用
        this.btnStartDisabled = false;
        this.btnEndDisabled = true;
      } else {
        this.btnStartDisabled = false;
        this.btnEndDisabled = false;
      }
    }
  }
}
export default forbidden;