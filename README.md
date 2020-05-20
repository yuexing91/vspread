# v-spread

> vue.js版的在线电子表格

## 开始

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:4000
npm run dev

# build for production with minification
npm run build

```

##

```js
import vspread from 'vspread'
//选项
const options = {
  // 行的信息
  rows: [
    {
      hpx: 100,//行高
      h: false,//是否隐藏
      s: 's1', //对应RCStyles中的样式ID
    },
  ],
  // 列的信息
  columns: [
    {
      wpx: 100,//列宽
      h: false,//是否隐藏
      s: 's1',//对应RCStyles中的样式ID
    },
  ],
  // 合并单元格的信息
  merges: [
    {
      start: {
        rowIndex: 0,
        columnIndex: 0,
      },
      end: {
        rowIndex: 1,
        columnIndex: 1,
      },
    },
  ],
  // 单元格信息
  cells: {
    0: [
      {
        v: 123, //单元格的值
        s: 's2',//样式ID
      },
      null,
      {
        s: 's2',
        fs: 'A1',//公式
      },
    ],
  },
  // 样式信息
  styles: {
    s2: {
      'border': 'blrt',
      'backgroundColor': '#ffff00',
      'color': '#ff1400',
      'fontFamily': '微软雅黑',
      'fontSize': 12,
      'fontStyle': 'italic',
      'fontWeight': 'bold',
      'textDecoration': 'underline',
      'textAlign': 'center',
      'verticalAlign': 'middle',
      'whiteSpace': 'normal',
    },
  },
  //行列样式
  RCStyles: {
    s1: {
      'border': undefined,
      'backgroundColor': undefined,
      'color': '#ff1400',
      'fontFamily': '微软雅黑',
      'fontSize': 12,
      'fontStyle': 'italic',
      'fontWeight': 'bold',
      'textDecoration': 'underline',
      'textAlign': 'center',
      'verticalAlign': 'middle',
      'whiteSpace': 'normal',
    },
  },
  //行的数量
  rowCount: 200,
  //列的数量
  columnCount: 20,
  //允许的最大行
  maxRowCount: 10000,
  //允许的最大列
  maxColumnCount: 200,
};

new Vue({
  el: '#app',
  data() {
    return {
      options,
      //是否显示菜单
      menu:true,
      //是否自动补齐行列
      autoCreate:true
    };
  },
  template: '<vspread :options="options" :menu="menu" :autoCreate="autoCreate"/>',
  components: { vspread },
});
```

## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2020-present, yuexing91
