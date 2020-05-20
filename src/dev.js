import Vue from 'vue';
import WorkBook from './index';

Vue.config.productionTip = false;

const options = {
  // 行的信息
  rows: [
    {
      hpx: 100,
      h: false,
      s: 's1',
    },
  ],
  // 列的信息
  columns: [
    {
      wpx: 100,
      h: false,
      s: 's1',
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
        v: 123,
        s: 's2',
      },
      null,
      {
        v: undefined,
        fs: 'A1+1',
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
    };
  },
  template: '<WorkBook :options="options" menu autoCreate/>',
  components: { WorkBook },
});
