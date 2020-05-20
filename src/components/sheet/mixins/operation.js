export default {
  methods: {
    //设置边框
    setBorder(border){
      this.setSelctionExpandStyle({ border });
    },
    //设置背景颜色
    setBackground(backgroundColor){
      this.setSelctionExpandStyle({ backgroundColor });
    },
    //设置前景颜色
    setFillColor(color){
      this.setSelctionExpandStyle({ color });
    },
    //设置字体种类
    setFontWeight(fontWeight){
      this.setSelctionExpandStyle({ fontWeight });
    },
    //设置字体种类
    setFontFamily(fontFamily){
      this.setSelctionExpandStyle({ fontFamily });
    },
    //设置字体大小
    setFontSize(fontSize){
      this.setSelctionExpandStyle({ fontSize });
    },
    //设置字体样式
    setFontStyle(fontStyle){
      this.setSelctionExpandStyle({ fontStyle });
    },
    //下划线 删除线
    setTextDecoration(textDecoration){
      this.setSelctionExpandStyle({ textDecoration });
    },
    //设置水平对齐方式
    setTextAlign(textAlign){
      this.setSelctionExpandStyle({ textAlign });
    },
    //设置垂直对齐方式
    setVerticalAlign(verticalAlign){
      this.setSelctionExpandStyle({ verticalAlign });
    },
    setSelctionExpandStyle(option){
      this.setAreaStyle(this.selctionExpand, style => {
        style.setOption(option);
      });
    },
    //设置单元格格式化
    setCellFormat(){
      this.stopAction();
    },
    stopAction(){
      this.curAction = null;
    },
  },
};
