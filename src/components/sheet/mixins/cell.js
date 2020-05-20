import _ from 'lodash';
import { isNullCell, isOnlyValueCell } from './cell/cellUtil';
import { CELL_CONFIG } from '../../../config/constant';

export default {

  methods: {
    getRow(rowIndex){
      return this.cells[rowIndex];
    },

    setRow(rowIndex, columnSizeOrRow){
      let _row = this.cells[rowIndex];
      if (_row) {
        if (_row.length < columnSizeOrRow) {
          _row.length = columnSizeOrRow;
        }
      } else {
        _row = Array(+columnSizeOrRow);
        this.$set(this.cells, rowIndex, _row);
      }
      return _row;
    },

    //遍历一个区域
    eachAreaCell(area, iteratee){
      const cells = this.getAreaExistCells(area);
      _.each(cells, cell => {
        iteratee(cell.options, cell.pos);
      });
    },

    /**
     * 获取一个单元格
     * @param rowIndex
     * @param columnIndex
     * @returns {*}
     */
    getCell(rowIndex, columnIndex){
      const row = this.getRow(rowIndex);
      return row ? row[columnIndex] : null;
    },

    getPosCell(pos){
      return this.getCell(pos.rowIndex, pos.columnIndex);
    },

    /***
     * 获取范围内的单元格
     * @returns rows 行列的二维数组
     */
    getAreaCells(area){
      const { start, end } = this.minArea(area);
      return _.$mapRange(start.rowIndex, end.rowIndex, i => {
        return this.getRowCells(i, start.columnIndex, end.columnIndex);
      });
    },

    /***
     * 获取范围内的单元格
     * @return cells 一维的数组 位置信息存在pos属性中
     */
    getAreaExistCells(area){
      const cells = [];

      _.$eachArea(this.minArea(area), rowIndex => this.getRow(rowIndex), (columnIndex, rowIndex, row) => {
        if (row && !isNullCell(row[columnIndex])) {
          cells.push({
            pos: {
              rowIndex,
              columnIndex,
            },
            options: row[columnIndex],
          });
        }
      });

      return cells;
    },

    /***
     * 获取指定行的范围内出单元格
     * @param rowIndex
     * @param startColumnIndex
     * @param endColumnIndex
     * @returns {*}
     */
    getRowCellsLimit(rowIndex, startColumnIndex, endColumnIndex){
      const col1 = startColumnIndex,
            col2 = Math.min(endColumnIndex, this.columnCount);
      const row  = this.getRow(rowIndex);
      if (row) {
        return _.$mapRange(col1, col2, j => {
          return row[j];
        });
      } else {
        return Array(col2 - col1 + 1);
      }
    },

    /***
     * 获取指定行的范围内出单元格
     * @param rowIndex
     * @param startColumnIndex
     * @param endColumnIndex
     * @returns {*}
     */
    getRowCells(rowIndex, startColumnIndex, endColumnIndex){
      const row = this.getRow(rowIndex);
      if (row) {
        return _.$mapRange(startColumnIndex, endColumnIndex, j => {
          return row[j];
        });
      } else {
        return Array(Math.abs(endColumnIndex - startColumnIndex) + 1);
      }
    },

    /**
     * 找出一个区域内，实际存在单元格最大rownum
     * @param area
     */
    findAreaMaxRowNum(area){
      const { start, end } = this.minArea(area);
      for(let i = end.rowIndex; i >= start.rowIndex; i--) {
        const row = this.getRow(i);
        if (row) {
          for(let j = start.columnIndex; j <= end.columnIndex; j++) {
            if (row[j]) {
              return i;
            }
          }
        }
      }
      return end.rowIndex - 1;
    },

    /**
     * 找出一个区域内，实际存在单元格最大columnIndex
     * @param area
     */
    findAreaMaxColumnNum(area){
      const { start, end } = this.minArea(area);
      for(let columnIndex = end.columnIndex; columnIndex >= start.columnIndex; columnIndex--) {
        for(let rowIndex = start.rowIndex; rowIndex <= end.rowIndex; rowIndex++) {
          const row = this.getRow(rowIndex);
          if (row && row[columnIndex]) {
            return columnIndex;
          }
        }
      }
      return end.columnIndex - 1;
    },

    /***
     * 从sArea复制单元格到tArea，不复制合并规则
     * @param sArea
     * @param tArea
     */
    copyToAreaCells(sArea, tArea){
      const sMaxRowIndex = this.findAreaMaxRowNum(sArea);
      const tMaxRowIndex = this.findAreaMaxRowNum(tArea);

      const sMaxColumnIndex = this.findAreaMaxColumnNum(sArea);
      const tMaxColumnIndex = this.findAreaMaxColumnNum(tArea);

      const maxRowIndex   = Math.max(tArea.start.rowIndex + (sMaxRowIndex - sArea.start.rowIndex), tMaxRowIndex);
      const maxColumnSize = Math.max(tArea.start.columnIndex + (sMaxColumnIndex - sArea.start.columnIndex), tMaxColumnIndex);

      const _sArea = _.defaults({
        end: {
          rowIndex: sMaxRowIndex,
          columnIndex: sMaxColumnIndex,
        },
      }, sArea);

      tArea = _.defaults({
        end: {
          rowIndex: maxRowIndex,
          columnIndex: maxColumnSize,
        },
      }, tArea);

      this.fillAreaCells(sArea, this.getAreaCells(_sArea), tArea, cell => {
        return _.cloneDeep(cell);
      });
    },

    //填充单元格
    fillAreaCells(sArea, sRows, tArea, iterator){
      const rowLen    = Math.abs(sArea.end.rowIndex - sArea.start.rowIndex) + 1;
      const columnLen = Math.abs(sArea.end.columnIndex - sArea.start.columnIndex) + 1;

      const cells = [];

      _.$eachArea(tArea, null, (columnIndex, rowIndex) => {
        let columnNum = Math.abs(columnIndex - tArea.start.columnIndex) % columnLen;
        let rowNum    = Math.abs(rowIndex - tArea.start.rowIndex) % rowLen;

        let t1 = 1;
        if (sArea.end.rowIndex < sArea.start.rowIndex) {
          t1 = -1;
        }
        let t2 = 1;
        if (sArea.end.columnIndex < sArea.start.columnIndex) {
          t2 = -1;
        }

        let oldRowIndex      = sArea.start.rowIndex + rowNum * t1;
        const oldColumnIndex = sArea.start.columnIndex + columnNum * t2;

        const row = sRows[rowNum];

        let cell = _.cloneDeep(_.get(row, columnNum));

        const s = this.mixinStyles(_.get(cell, 's'), oldRowIndex, oldColumnIndex);

        if (s) {
          if (!_.isPlainObject(cell)) {
            cell = { v: cell };
          }
          cell.s = s;
        }

        cells.push({
          pos: {
            rowIndex,
            columnIndex,
          },
          options: iterator(cell, { columnIndex, rowIndex, columnNum, rowNum }),
        });

      });
      this.c_setCells(cells);
    },
//    //填充单元格
//    fillAreaCells(sArea, tArea, iterator){
//      const sRows     = this.getAreaCells(sArea);
//      const rowLen    = Math.abs(sArea.end.rowIndex - sArea.start.rowIndex) + 1;
//      const columnLen = Math.abs(sArea.end.columnIndex - sArea.start.columnIndex) + 1;
//
//      const cells = [];
//
//      _.$eachArea(tArea, null, (columnIndex, rowIndex) => {
//        const columnNum = Math.abs(columnIndex - tArea.start.columnIndex) % columnLen;
//        const rowNum    = Math.abs(rowIndex - tArea.start.rowIndex) % rowLen;
//
//        const columnBatch = parseInt(Math.abs(columnIndex - tArea.start.columnIndex) / columnLen);
//        const rowBatch    = parseInt(Math.abs(rowIndex - tArea.start.rowIndex) / rowLen);
//
//        const row = sRows[rowNum];
//        cells.push({
//          pos: {
//            rowIndex,
//            columnIndex,
//          },
//          options: iterator(_.get(row, columnNum), { columnIndex, rowIndex, columnNum, rowNum, columnBatch, rowBatch }),
//        });
//
//      });
//      this.c_setCells(cells);
//    },

    /***
     * 清空一个区域内的单元格
     * @param area
     * @param retainFirst 是否保留第一个单元格
     */
    clearAreaCells(area, retainFirst){
      const length = area.end.columnIndex - area.start.columnIndex + 1;
      const empty  = Array(length);
      area         = this.minArea(area);
      _.$eachRange(area.start.rowIndex, area.end.rowIndex, rowIndex => {
        const row = this.getRow(rowIndex);
        if (row && row.length > area.start.columnIndex) {
          if (area.start.rowIndex == rowIndex && retainFirst) {
            row.splice(area.start.columnIndex + 1, length - 1, ...Array(length - 1));
          } else {
            row.splice(area.start.columnIndex, length, ...empty);
          }
        }
      });
    },

    setCellValue(pos, val){
      this.c_addCell(pos.rowIndex, pos.columnIndex);
      if (_.$isFormula(val)) {
        this.setCellFormula(pos, val);
        this.computedCellFormula(pos);
      } else {
        this.f_relieveCellFormula(pos);
        this.c_setCellV(pos, val);
      }
    },

    setCellAttribute(pos, cell, key, val){
      if (isOnlyValueCell(cell)) {
        this.c_setCell({
          pos,
          options: {
            [key]: val,
            v: cell,
          },
        });
      } else {
        this.$set(cell, key, val);
      }
    },

    delCellValue(pos){
      this.setCellValue(pos, undefined);
    },

    c_setLastNum(rowIndex, columnIndex){
      this.rowCount    = Math.max(this.rowCount, rowIndex);
      this.columnCount = Math.max(this.columnCount, columnIndex);
    },

    /***
     * 增加一个单元格
     * @param rowIndex
     * @param columnIndex
     */
    c_addCell(rowIndex, columnIndex){
      let row = this.getRow(rowIndex);
      if (_.isUndefined(row)) {
        row = this.setRow(rowIndex, columnIndex + 1);
      }
      if (isNullCell(row[columnIndex])) {
        const m = this.getPosOwnerMerge({ rowIndex, columnIndex });
        if (!m || (m.start.rowIndex == rowIndex && m.start.columnIndex == columnIndex)) {
          _.$setArrayItem(row, columnIndex, CELL_CONFIG.defaultOptions());
        }
        this.c_setLastNum(_.get(m, 'end.rowIndex') || rowIndex, _.get(m, 'end.columnIndex') || columnIndex);
      }
    },
    /***
     * 待优化 优化方案为使用矩阵相减法 将合并的区域剔除
     * @param area
     */
    c_addCells(area){

      if (_.isEqual(this.getMerge(area.start), area)) {
        return;
      }

      const merges = [];

      _.$eachArea(area, rowIndex => {
        return this.getRow(rowIndex) || [];
      }, (columnIndex, rowIndex, row) => {
        const merge = this.getMerge({
          rowIndex, columnIndex,
        });
        if (merge) {
          merges.push(merge);
        } else if (isNullCell(row[columnIndex])) {
          const _merge = _.find(merges, merge => {
            return _.$inArea(merge, { rowIndex, columnIndex });
          });
          if (!_merge) {
            this.c_addCell(rowIndex, columnIndex);
          }
        }
      });
    },

    c_setCellV(pos, val){
      const cell = this.getPosCell(pos);

      if (isOnlyValueCell(cell)) {
        if (cell !== val) {
          this.c_setCell({
            pos,
            options: val,
          });

          this.$emit('on-cellval-change', {
            pos,
            cell: val,
          });
        }
      } else {
        if (cell.v !== val) {
          cell.v = val;
          this.$emit('on-cellval-change', {
            pos,
            cell,
          });
        }
      }
    },

    c_setCells(cells){
      _.each(cells, cell => {
        this.c_setCell(cell);
      });
    },

    c_setCell(cell){
      const pos = cell.pos;
      let row   = this.getRow(pos.rowIndex);
      if (row == null) {
        row = this.setRow(pos.rowIndex, pos.columnIndex);
      }

      this.c_setLastNum(pos.rowIndex, pos.columnIndex);

      _.$setArrayItem(row, pos.columnIndex, cell.options);

      if (cell.options && cell.options.f) {
        this.f_setCellFormula(pos, cell.options.f, cell.options);
        this.computedCellFormula(pos, cell.options);
      } else {
        this.$emit('on-cellval-change', {
          pos,
          cell: cell.options,
        });
      }
    },

    c_clearCell(pos){
      const { rowIndex, columnIndex } = pos;
      const row                       = this.getRow(rowIndex);
      if (row && row.length > columnIndex) {
        row.splice(columnIndex, 1, undefined);
      }
    },

  },
};
