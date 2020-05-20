import { CELL_CONFIG } from '../../../config/constant';

//调整宽高
export default {
  data(){
    return {
      resizeState: false,
      resizeInfo: {
        type: 'row',
        index: -1,
      },
      resizeGap: 0,
    };
  },

  computed: {
    resizeLineStyle(){
      const index = this.resizeInfo.index;
      if (index == -1) {
        return [];
      }
      if (this.resizeInfo.type == 'row') {
        const top = this.getGapHeight(index, 0) - 1;
        return [
          { top: `${top}px` },
          { top: `${top + this.resizeGap}px` },
        ];
      } else {
        const left = this.getGapWidth(index, 0) - 1;
        return [
          { left: `${left}px` },
          { left: `${left + this.resizeGap}px` },
        ];
      }
    },
    resizeClass(){
      return ['resize-line', `resize-line-${this.resizeInfo.type}`];
    },
  },

  watch: {},

  methods: {
    /***
     * 设置行高
     * @param rowIndex
     */
    setRowHeight(rowIndex, height){
      const rowInfo = _.$getArrayItem(this.rows, rowIndex, { hpx: height });
      if (rowInfo.h) {
        rowInfo.h = undefined;
      }
      return this.$set(rowInfo, 'hpx', height);
    },
    /***
     * 获取行高
     * @param rowIndex
     */
    getRowHeight(rowIndex){
      const rowInfo = this.getRowInfos(rowIndex);
      if (rowInfo) {
        if (rowInfo.h) {
          return 0;
        }
        return rowInfo.hpx || CELL_CONFIG.height;
      }
      return CELL_CONFIG.height;
    },
    /***
     * 获取rowIndex1与rowIndex2之间的距离
     * @param rowIndex1
     * @param rowIndex2
     */
    getGapHeight(rowIndex1, rowIndex2, isLimit, maxHeight){
      let start = Math.min(rowIndex1, rowIndex2);
      let end   = Math.max(rowIndex1, rowIndex2);

      if (isLimit) {
        const area = this.curLayoutArea;
        end        = Math.min(end, area.end.rowIndex);
      }

      let top = 0;

      while (start < end) {
        if (start == this.rows.length) {
          top += (end - this.rows.length) * CELL_CONFIG.height;
          break;
        }
        top += maxHeight ? Math.min(this.getRowHeight(start), maxHeight) : this.getRowHeight(start);
        start++;
      }

      return top;
    },
    /***
     * 设置行高
     * @param index
     */
    setColumnWidth(index, width){
      const columnInfo = _.$getArrayItem(this.columns, index, { wpx: width });
      if (columnInfo.h) {
        columnInfo.h = undefined;
      }
      return this.$set(columnInfo, 'wpx', width);
    },
    /***
     * 获取列宽
     * @param columnIndex
     */
    getColumnWidth(columnIndex){
      const columnInfo = this.getColumnInfos(columnIndex);
      if (columnInfo) {
        if (columnInfo.h) {
          return 0;
        }
        return columnInfo.wpx || CELL_CONFIG.width;
      }
      return CELL_CONFIG.width;
    },
    /***
     * 获取columnIndex1与columnIndex2之间的距离
     * @param columnIndex1
     * @param columnIndex2
     */
    getGapWidth(columnIndex1, columnIndex2, isLimit, maxWidth){
      let start = Math.min(columnIndex1, columnIndex2);
      let end   = Math.max(columnIndex1, columnIndex2);
      if (isLimit) {
        const area = this.curLayoutArea;
        end        = Math.min(end, area.end.columnIndex);
      }

      let top = 0;
      while (start < end) {
        if (start == this.columns.length) {
          top += (end - this.columns.length) * CELL_CONFIG.width;
          break;
        }
        top += maxWidth ? Math.min(this.getColumnWidth(start), maxWidth) : this.getColumnWidth(start);
        start++;
      }
      return top;
    },
    s_resizeRowOrColumnStart(type, index){
      this.resizeInfo.type  = type;
      this.resizeInfo.index = index;
      if (type == 'row') {
        this.resizeGap = this.getRowHeight(index);
      } else {
        this.resizeGap = this.getColumnWidth(index);
      }
      this.resizeState = true;

      let start = -1;
      const cs  = this.resizeGap;

      const f1 = _.throttle((e) => {
        const t = type == 'row' ? e.pageY : e.pageX;
        if (start == -1) {
          start = t;
          return;
        }
        this.resizeGap = Math.max(cs + t - start, 2);
      }, 10);

      const f2 = () => {
        if (cs != this.resizeGap) {
          this.recordChange(`RCChange`, {
            type,
            area: {
              start: {
                rowIndex: index,
                columnIndex: index,
              },
              end: {
                rowIndex: index,
                columnIndex: index,
              },
            },
          });
          if (type == 'row') {
            this.setRowHeight(index, this.resizeGap);
          } else {
            this.setColumnWidth(index, this.resizeGap);
          }
        }
        this.resizeState      = true;
        this.resizeInfo.index = -1;
        document.removeEventListener('mousemove', f1);
        document.removeEventListener('mouseup', f2);
      };

      document.addEventListener('mousemove', f1);
      document.addEventListener('mouseup', f2);
    },
    getAreaSize(area){
      return {
        width: this.getGapWidth(area.start.columnIndex, area.end.columnIndex + 1),
        height: this.getGapHeight(area.start.rowIndex, area.end.rowIndex + 1),
      };
    },
  },
};
