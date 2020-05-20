import _ from 'lodash';

import { GRID_CONFIG } from '../../../config/constant';
import { getAreaCutLeftOrTope } from '../../../helpers';

export default {
  data() {
    return {
      temp_data: {},

      contentPos: undefined,

      showHead: true,

      scrollLeft: 0,
      scrollTop: 0,

      fixedHeight: 0,
      fixedWidth: 0,

      plusHeight: 0,
      plusWidth: 0,

      maxHeight: 0,
      maxWidth: 0,

      fixedRowIndex: 0,
      fixedColumnIndex: 0,

      curLayoutArea: {
        start: {
          rowIndex: 0,
          columnIndex: 0,
        },
        end: {
          rowIndex: 0,
          columnIndex: 0,
        },
      },

      blockAreas: {
        lt: null,
        rt: {
          start: {
            rowIndex: 0,
            columnIndex: 0,
          },
          end: {
            rowIndex: 0,
            columnIndex: 0,
          },
        },
        lb: null,
        rb: {
          start: {
            rowIndex: 0,
            columnIndex: 0,
          },
          end: {
            rowIndex: 0,
            columnIndex: 0,
          },
        },
      },

    };
  },

  computed: {

    blockFlows() {
      return _.mapValues(this.blockAreas, area => {
        if (!area) return;
        return {
          rowFlows: createFlows(area.start.rowIndex, area.end.rowIndex, GRID_CONFIG.row_clip_size),
          columnFlows: createFlows(area.start.columnIndex, area.end.columnIndex, GRID_CONFIG.column_clip_size),
        };

      });
    },

    sheetHeight() {
      return this.maxHeight + this.fixedHeight + ( this.showHead ? 20 : 0 );
    },

    sheetWidth() {
      return this.maxWidth + this.fixedWidth + ( this.showHead ? 44 : 0 );
    },

  },

  mounted() {
    ['lt', 'rt', 'lb', 'rb'].forEach(pos => {
      this[`$${ pos }Dom`] = this.$el.querySelector('.grid-' + pos);
    });

    const cRect = this.$el.querySelector('.grid-content').getBoundingClientRect();
    this.contentPos = { top: cRect.top, left: cRect.left, width: cRect.width, height: cRect.height };

    this.updateBlockRect();
    this.$nextTick(() => {
      this.l_scroll();
    });
  },

  methods: {

    getAreaLayoutPos(area, info) {

      info = info || this.s_getSelectionRect(area);

      const h = getAreaCutLeftOrTope(area,
        info.top,
        info.height,
        this.fixedHeight, this.fixedRowIndex,
        this.scrollTop, 'rowIndex');

      const w = getAreaCutLeftOrTope(area,
        info.left,
        info.width,
        this.fixedWidth, this.fixedColumnIndex,
        this.scrollLeft, 'columnIndex');

      return Object.assign(h, w);

    },

    computedRightBottmBlockArea() {
      const rect = this.blockRects.rb;
      const height = Math.max(rect.height, 600);
      const beginTop = this.scrollTop;
      const endTop = this.scrollTop + height;
      const rowRange = createRange(this.fixedRowIndex, beginTop, endTop, GRID_CONFIG.row_clip_size, this.getRowHeight);

      const width = Math.max(rect.width, 600);
      const beginLeft = this.scrollLeft;
      const endLeft = this.scrollLeft + width;
      const colRange = createRange(this.fixedColumnIndex, beginLeft, endLeft, GRID_CONFIG.column_clip_size, this.getColumnWidth);

      const maxRowCount = this.relMaxRowCount;
      const maxColumnCount = this.relMaxColumnCount;

      return {
        start: {
          rowIndex: Math.min(rowRange.start, maxRowCount - GRID_CONFIG.row_clip_size, 0),
          columnIndex: Math.min(colRange.start, maxColumnCount - GRID_CONFIG.column_clip_size, 0),
        },
        end: {
          rowIndex: Math.min(rowRange.end, maxRowCount),
          columnIndex: Math.min(colRange.end, maxColumnCount),
        },
      };

    },

    computedFlows() {
      const rbArea = this.computedRightBottmBlockArea();

      this.curLayoutArea.end.rowIndex = rbArea.end.rowIndex;
      this.curLayoutArea.end.columnIndex = rbArea.end.columnIndex;
      if (this.fixedRowIndex === 0) {
        this.curLayoutArea.start.rowIndex = rbArea.start.rowIndex;
      }
      if (this.fixedColumnIndex === 0) {
        this.curLayoutArea.start.columnIndex = rbArea.start.columnIndex;
      }

      this.l_setPlus(rbArea.start.rowIndex, rbArea.start.columnIndex);
      if (!_.isEqual(this.blockAreas.rb, rbArea)) {
        this.blockAreas.rb = rbArea;
        this.l_setOtherBlock();
        return true;
      }
    },

    freezeWindow(rowIndex, columnIndex) {
      this.fixedRowIndex = rowIndex;
      this.fixedColumnIndex = columnIndex;

      this.blockAreas.rb = {
        start: {
          rowIndex: rowIndex,
          columnIndex: columnIndex,
        },
        end: {
          rowIndex: this.curLayoutArea.end.rowIndex,
          columnIndex: this.curLayoutArea.end.columnIndex,
        },
      };

      this.l_setPlus(rowIndex, columnIndex);
      this.l_setOtherBlock();

      this.$nextTick(() => {
        this.updateBlockRect();
        this.$emit('on-freeze-window', {
          rowIndex, columnIndex,
        });
      });

    },

    reszieLayoutInfo() {
      if (this.__isresize) {
        return;
      }
      this.__isresize = true;
      this.$nextTick(() => {
        this.updateBlockRect();
        this.computedFlows();
        this.__isresize = false;
      });
    },

    updateBlockRect() {
      this.blockRects = {};
      ['lt', 'rt', 'lb', 'rb'].forEach(pos => {
        const sRect = this[`$${ pos }Dom`].getBoundingClientRect();
        this.blockRects[pos] = {
          top: sRect.top,
          left: sRect.left,
          height: sRect.height,
          width: sRect.width,
          bottom: sRect.top + sRect.height,
          right: sRect.left + sRect.width,
        };
      });
    },

    getPointBlock(x, y) {
      return _.findKey(this.blockRects, rect => {
        return _.inRange(x, rect.left, rect.right) && _.inRange(y, rect.top, rect.bottom);
      });
    },

    minArea(area) {
      return {
        start: {
          rowIndex: Math.min(area.start.rowIndex, this.rowCount + 1),
          columnIndex: Math.min(area.start.columnIndex, this.columnCount + 1),
        },
        end: {
          rowIndex: Math.min(area.end.rowIndex, this.rowCount + 1),
          columnIndex: Math.min(area.end.columnIndex, this.columnCount + 1),
        },
      };
    },

    getGridSize(rFlow, cFlow) {
      return {
        width: `${ this.getGapWidth(cFlow.start, cFlow.end) }px`,
        height: `${ this.getGapHeight(rFlow.start, rFlow.end) }px`,
      };
    },

    getPosByPix(x, y) {
      return {
        rowIndex: this.getRowIndexByPix(y),
        columnIndex: this.getColumnIndexByPix(x),
      };
    },

    //根据当前像素获取列号
    getColumnIndexByPix(x) {

      let cur, pos, plus, scroll;

      cur = x;
      pos = this.contentPos.left;
      plus = this.plusWidth;
      scroll = this.scrollLeft;

      let rel = cur - pos;

      let area = this.curLayoutArea;
      if (x > this.fixedWidth + this.contentPos.left) {
        rel = rel + scroll - plus - this.fixedWidth;
        area = this.blockAreas.rb;
      }

      const st = area.start.columnIndex;
      const ed = area.end.columnIndex;

      let s = 0, index = -1;

      for(let i = st; i < ed; i++) {
        const t = this.getColumnWidth(i);
        if (rel > s && rel <= s + t) {
          index = i;
          break;
        }
        s += t;
      }

      if (index != -1) {
        return index;
      }
    },

    //根据当前像素获取行号
    getRowIndexByPix(y) {
      let cur, pos, plus, scroll;

      cur = y;
      pos = this.contentPos.top;
      plus = this.plusHeight;
      scroll = this.scrollTop;

      let rel = cur - pos;
      let area = this.curLayoutArea;
      if (y > this.fixedHeight + this.contentPos.top) {
        rel = rel + scroll - plus - this.fixedHeight;
        area = this.blockAreas.rb;
      }

      const st = area.start.rowIndex;
      const ed = area.end.rowIndex;

      let s = 0, index = -1;

      for(let i = st; i < ed; i++) {
        const x = this.getRowHeight(i);
        if (rel > s && rel <= s + x) {
          index = i;
          break;
        }
        s += x;
      }

      if (index != -1) {
        return index;
      }
    },

    //超出边界的滚动
    boundsScroll(e, option, callback) {
      const { name, dir } = option;

      const fn = (e) => {
        const dirs = {};
        if (dir === 'none') {
          return dirs;
        }

//        const pos  = this.getPointBlock(e.pageX, e.pageY);
        const rect = this.blockRects.rb;
        if (dir != 'row') {
          if (e.pageX <= rect.left - 1) {
            this.$el.scrollLeft -= 30;
            dirs.column = true;
          } else if (e.pageX >= rect.right - 1) {
            this.$el.scrollLeft += 30;
            dirs.column = true;
          }
        }

        if (dir != 'column') {
          if (e.pageY <= rect.top - 1) {
            this.$el.scrollTop -= 15;
            dirs.row = true;
          } else if (e.pageY >= rect.bottom - 1) {
            this.$el.scrollTop += 15;
            dirs.row = true;
          }
        }

        return dirs;
      };

      const t = fn(e);

      if (_.isEmpty(dir) && !_.isEmpty(t) || t[dir]) {
        this.temp_data[`${ name }_event`] = e;
        if (!this.temp_data[name]) {
          this.temp_data[name] = setInterval(() => {
            fn(this.temp_data[`${ name }_event`]);
            callback(this.temp_data[`${ name }_event`]);
          }, 100);
        }
      } else {
        this.clearBoundsScroll(name);
      }

      callback(e);
    },

    clearBoundsScroll(name) {
      if (this.temp_data[name]) {
        clearInterval(this.temp_data[name]);
        this.temp_data[name] = undefined;
      }
    },

    l_scroll() {
      this.scrollLeft = this.$el.scrollLeft;
      this.scrollTop = this.$el.scrollTop;

      this.l_setScroll();

      //确保滚动条同步
      clearTimeout(this.___ut___);
      this.___ut___ = setTimeout(() => {
        this.l_setScroll();
      }, 20);

      const isChange = this.computedFlows();

      this.$nextTick(() => {
        this.maxHeight = Math.max(this.maxHeight, this.$rbDom.scrollHeight - 1);
        this.maxWidth = Math.max(this.maxWidth, this.$rbDom.scrollWidth - 1);
      });

      if (isChange) {
        let t0 = performance.now();
        this.$nextTick(() => {
          console.log('default:' + ( performance.now() - t0 ));
        });
      }
    },

    l_setScroll() {
      this.$rtDom.scrollLeft = this.scrollLeft;
      this.$rbDom.scrollLeft = this.scrollLeft;
      this.$lbDom.scrollTop = this.scrollTop;
      this.$rbDom.scrollTop = this.scrollTop;
    },

    l_setPlus(rowIndex, columnIndex) {
      this.fixedHeight = this.getGapHeight(0, this.fixedRowIndex);
      this.plusHeight = this.getGapHeight(this.fixedRowIndex, rowIndex);
      this.fixedWidth = this.getGapWidth(0, this.fixedColumnIndex);
      this.plusWidth = this.getGapWidth(this.fixedColumnIndex, columnIndex);
    },

    l_setOtherBlock() {
      const { start, end } = this.curLayoutArea;


      this.blockAreas.lt = {
        start: {
          rowIndex: start.rowIndex,
          columnIndex: start.columnIndex,
        },
        end: {
          rowIndex: this.fixedRowIndex,
          columnIndex: this.fixedColumnIndex,
        },
      };

      this.blockAreas.rt = {
        start: {
          rowIndex: start.rowIndex,
          columnIndex: this.blockAreas.rb.start.columnIndex,
        },
        end: {
          rowIndex: this.fixedRowIndex,
          columnIndex: end.columnIndex,
        },
      };

      this.blockAreas.lb = {
        start: {
          rowIndex: this.blockAreas.rb.start.rowIndex,
          columnIndex: start.columnIndex,
        },
        end: {
          rowIndex: end.rowIndex,
          columnIndex: this.fixedColumnIndex,
        },
      };

    },

  },
};

function createRange(min, startSize, endSize, step, getCurSize) {

  let sum = 0, end = 0, start = -1;
  while (true) {
    sum += getCurSize(end + min);
    if (sum >= startSize && start == -1) {
      start = end;
    }
    if (sum >= endSize) {
      break;
    }
    end++;
  }

  let v = start % step || step;
  start = Math.max(start - v, 0);

  v = end % step;

  if (v === 0) {
    end += step;
  } else {
    end += ( step - v ) + step;
  }

  start += min;
  end += min;

  return {
    start, end,
  };
}


function createFlows(start, end, step) {
  const flows = [];
  for(let i = start; i < end; i += step) {
    flows.push({
      start: i,
      end: Math.min(i + step, end),
    });
  }

  return flows;
}
