export const CELL_CONFIG = {
  height: 20,
  width: 64,
  defaultOptions() {
    return {
//      t: 't',//类型
      v: undefined,//实际值
//      f: undefined,//公式
//      s: undefined,//样式序号
    };
  },
};

export const STYLE_CONFIG = {
  styleOptions() {
    return {
      border: undefined,//['top','left','right','bottom']
      backgroundColor: undefined,
      color: undefined,
      fontFamily: undefined,
      fontSize: undefined,
      fontStyle: undefined,
      fontWeight: undefined,
      textDecoration: undefined,
      textAlign: undefined,//水平对齐
      verticalAlign: undefined,//垂直对齐
      textIndent: undefined,//缩进
      whiteSpace: undefined,//自动换行
    };
  },
};

export const GRID_CONFIG = {
  row_clip_size: 15,
  column_clip_size: 15,
};
