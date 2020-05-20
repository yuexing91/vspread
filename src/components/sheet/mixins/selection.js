//选区相关
import _ from 'lodash';

export default {

  data() {
    return {
      //当前选中的名称  selectionCopy  selectionEditer  selection
      curSelectionName: undefined,
      //复制\剪切的单元格区域
      selectionCopy: undefined,
      //编辑单元格时，公式选中区域
      selectionEditer: undefined,
      //当前选中的区域
      selection: {
        start: { rowIndex: 0, columnIndex: 0 },
        end: { rowIndex: 0, columnIndex: 0 },
      },
      selectedColumnRange: { start: undefined, end: undefined },
      selectedRowRange: { start: undefined, end: undefined },
      isSelectRow: false,
      isSelectColumn: false,
    };
  },

  computed: {
//    isSelectRow(){
//      return this.s_areaIsFullRow(this.selection);
//    },
//    isSelectColumn(){
//      return this.s_areaIsFullColumn(this.selection);
//    },

    //扩选合并单元格的区域
    selctionExpand() {
      const selecion = this.s_computedExtendSelection(this.selection);

      const { start, end } = selecion;

      Object.assign(this.selectedColumnRange, {
        start: Math.min(start.columnIndex, end.columnIndex),
        end: Math.max(start.columnIndex, end.columnIndex),
      });

      Object.assign(this.selectedRowRange, {
        start: Math.min(start.rowIndex, end.rowIndex),
        end: Math.max(start.rowIndex, end.rowIndex),
      });

      return selecion;
    },


    selectionInfo() {
      return this.s_getSelectionRect(this.selctionExpand);
    },


  },

  watch: {
    'selection.start': {
      handler(start) {
        this.tempMoveSelectionPos = start;
      },
      immediate: true,
    },
  },

  methods: {
    setSelectArea(start, end) {
      const selection = this.curSelectionName || 'selection';
      if (!this[selection]) {
        this[selection] = {
          start: {},
          end: {},
        };
      }
      Object.assign(this[selection], {
        start,
        end: end || Object.assign({}, start),
      });
    },

    s_getSelectionRect(selection) {
      const sc = Math.min(selection.start.columnIndex, selection.end.columnIndex);
      const ec = Math.max(selection.start.columnIndex, selection.end.columnIndex);
      const sr = Math.min(selection.start.rowIndex, selection.end.rowIndex);
      const er = Math.max(selection.start.rowIndex, selection.end.rowIndex);

      const rect = {
        width: this.getGapWidth(sc, ec + 1, true),
        left: this.getGapWidth(0, sc),
        height: this.getGapHeight(sr, er + 1, true),
        top: this.getGapHeight(0, sr),
      };

      return rect;
    },

    //选中单元格开始
    s_cellSelectStart: _.throttle(function (e, pos) {
      this.isSelectRow = false;
      this.isSelectColumn = false;
      const selection = this.curSelectionName || 'selection';
      if (e.shiftKey) {
        const s = this[selection] ? this[selection].start : pos;
        this.setSelectArea(s, pos);
      } else {
        this.setSelectArea(pos);
      }

      let options = { name: 'selectCell' };

      const blockName = this.getPointBlock(e.pageX, e.pageY);
      if (blockName == 'lb') {
        options.dir = 'row';
      }
      if (blockName == 'rt') {
        options.dir = 'column';
      }
      if (blockName == 'lt') {
        options.dir = 'none';
      }

      const move = (e) => {
        this.boundsScroll(e, options, e => {
          const pos = this.getPosByPix(e.pageX, e.pageY);
          this.setSelectArea(this[selection].start, _.defaults({}, pos, this[selection].end));
        });
      };

      const up = () => {
        this.clearBoundsScroll('selectCell');
        this.$emit('select-over');
        document.removeEventListener('mousemove', move);
        document.removeEventListener('mouseup', up);
      };

      document.addEventListener('mousemove', move);
      document.addEventListener('mouseup', up);

    }, 10, { leading: false }),

    //选中行或列开始
    s_selectedRowOrColumnStart: _.throttle(function (event, type, pos) {
      if (this.curSelectionName) {
        return;
      }
      const end = Object.assign({}, pos);

      if (type == 'row') {
        end.columnIndex = this.relMaxColumnCount - 1;
      } else {
        end.rowIndex = this.relMaxRowCount - 1;
      }

      this.setSelectArea(pos, end);

      const move = (e) => {
        this.boundsScroll(e, {
          name: 'selectHead',
          dir: type,
        }, e => {
          const index = type == 'column' ? this.getColumnIndexByPix(e.pageX) : this.getRowIndexByPix(e.pageY);
          if (index != -1) {
            this.selection.end[`${ type }Index`] = index;
          }
        });
      };

      const up = () => {
        this.clearBoundsScroll('selectHead');
        this.$emit('select-over');
        document.removeEventListener('mousemove', move);
        document.removeEventListener('mouseup', up);
      };

      document.addEventListener('mousemove', move);
      document.addEventListener('mouseup', up);
    }, 10, { leading: false }),

    /**
     * 判断pos
     * @param pos
     * @returns {boolean}
     * @private
     */
    s_inSelectArea(pos) {
      return _.$inArea(this.selctionExpand, pos);
    },

    //计算扩选区域
    s_computedExtendSelection(selection) {
      let area = _.$getAreaPole(selection);

      //如果是选中了整行，整列 则不需要扩展合并单元格的选中
      if (this.isSelectRow) {
        area.start.columnIndex = 0;
      } else if (this.isSelectColumn) {
        area.start.rowIndex = 0;
      } else {
        expansionAreaMerges(this.merges, area);
      }

      return area;
    },

    //获取当前选中的单元格
    getSelectionCells() {
      return this.getAreaCells(this.selctionExpand);
    },
    //
    getCurCell() {
      return this.getCell(this.selection.start.rowIndex, this.selection.start.columnIndex);
    },
  },

};

//判断当前选中区域是否包含了 合并单元格区域 并且合并单元格的范围超出了当前选取范围
function expansionAreaMerges(merges, area) {
  const merge = _.find(merges, merge => {
    if (merge && _.$isCollision(area, merge)) {
      let flag = false;
      if (merge.start.rowIndex < area.start.rowIndex) {
        area.start.rowIndex = merge.start.rowIndex;
        flag = true;
      }
      if (merge.end.rowIndex > area.end.rowIndex) {
        area.end.rowIndex = merge.end.rowIndex;
        flag = true;
      }
      if (merge.start.columnIndex < area.start.columnIndex) {
        area.start.columnIndex = merge.start.columnIndex;
        flag = true;
      }
      if (merge.end.columnIndex > area.end.columnIndex) {
        area.end.columnIndex = merge.end.columnIndex;
        flag = true;
      }
      return flag;
    }
  });

  if (merge) {
    expansionAreaMerges(merges, area);
  }
}
