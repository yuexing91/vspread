import _ from 'lodash';

export default {
  methods: {
    getRowInfos(start, end){
      if (_.isUndefined(end)) {
        return this.rows[start];
      }
      return _.$mapRange(start, end, j => {
        return this.rows[j];
      });
    },

    getColumnInfos(start, end){
      if (_.isUndefined(end)) {
        return this.columns[start];
      }
      return _.$mapRange(start, end, j => {
        return this.columns[j];
      });
    },

//    copyRow(curRowIndex, insterRowNum){
//      this.insterRow(curRowIndex + 1, insterRowNum, true);
//    },

    // 在cur行前面插入n行
    insterRow(curRowIndex, insterRowNum, copy){
      this.stopAction();
      let refresh = false;

      // 计算合并单元格的变化
      _.each(this.merges, merge => {
        if (_.isEmpty(merge)) return;
        if (curRowIndex > merge.start.rowIndex && curRowIndex <= merge.end.rowIndex) {
          merge.end.rowIndex += insterRowNum;
        } else if (curRowIndex <= merge.start.rowIndex) {
          merge.start.rowIndex += insterRowNum;
          merge.end.rowIndex += insterRowNum;
          refresh = true;
        }
      });

      // 更新行单元格的索引
      this.cells.splice(curRowIndex, 0, ...Array(insterRowNum));

      // 删除行信息
      this.rows.splice(curRowIndex, 0, ...Array(insterRowNum));
      this.rowCount += insterRowNum;
      // 刷新合并单元格信息
      if (refresh) {
        this.m_refreshMerge();
      }
      this.$emit('on-row-change', {
        cur: curRowIndex,
        num: insterRowNum,
        copy,
      });
    },
    // 删除行
    delRow(curRowIndex, delRowNum){
      this.stopAction();
      let refresh = false;
      const ms    = [];

      // 计算合并单元格的变化
      _.each(this.merges, merge => {
        if (_.isEmpty(merge)) return;
        if (curRowIndex >= merge.start.rowIndex && curRowIndex <= merge.end.rowIndex) {
          merge.end.rowIndex -= delRowNum;
          if (_.isEqual(merge.start, merge.end) || merge.end.rowIndex < merge.start.rowIndex) {
            merge._del = true;
            refresh    = true;
          } else {// 删除过后，还是合并的单元格
            ms.push(merge);
          }
        } else if (curRowIndex <= merge.start.rowIndex) {
          merge.start.rowIndex -= delRowNum;
          merge.end.rowIndex -= delRowNum;
          refresh = true;
        }
      });

      // 删除行
      const cells = {};
      _.each(this.cells, (row, index) => {
        index = parseInt(index);
        if (index < curRowIndex || index >= curRowIndex + delRowNum) {
          if (index > curRowIndex) {
            cells[index - delRowNum] = row;
          } else {
            cells[index] = row;
          }
        }
      });
      this.cells.splice(curRowIndex, delRowNum);
      // 删除过后，还是合并的单元格，需要单元格
      _.each(ms, m => {
        this.c_addCell(m.start.rowIndex, m.start.columnIndex);
      });

      // 删除行信息
      this.rows.splice(curRowIndex, delRowNum);
      this.rowCount -= delRowNum;
      if (refresh) {
        this.m_refreshMerge();
      }
      this.$emit('on-row-change', {
        cur: curRowIndex,
        num: -delRowNum,
      });
    },
    // 在cur列前面插入n列
    insterColumn(curColumnIndex, insterColumnNum = 1){
      this.stopAction();
      let refresh = false;

      // 计算合并单元格的变化
      _.each(this.merges, merge => {
        if (_.isEmpty(merge)) return;
        if (curColumnIndex > merge.start.columnIndex && curColumnIndex <= merge.end.columnIndex) {
          merge.end.columnIndex += insterColumnNum;
        } else if (curColumnIndex <= merge.start.columnIndex) {
          merge.start.columnIndex += insterColumnNum;
          merge.end.columnIndex += insterColumnNum;
          refresh = true;
        }
      });

      // 更新单元格的索引
      _.each(this.cells, row => {
        if (row) {
          row.splice(curColumnIndex, 0, ...Array(insterColumnNum));
        }
      });
      this.columns.splice(curColumnIndex, 0, ...Array(insterColumnNum));
      this.columnCount += insterColumnNum;
      if (refresh) {
        this.m_refreshMerge();
      }
      this.$emit('on-column-change', {
        cur: curColumnIndex,
        num: insterColumnNum,
      });
    },
    // 删除列
    delColumn(curColumnIndex, delColumnNum = 1){
      this.stopAction();
      let refresh = false;
      const ms    = [];
      _.each(this.merges, merge => {
        if (_.isEmpty(merge)) return;
        if (curColumnIndex >= merge.start.columnIndex && curColumnIndex <= merge.end.columnIndex) {
          merge.end.columnIndex -= delColumnNum;
          if (_.isEqual(merge.start, merge.end) || merge.end.columnIndex < merge.start.columnIndex) {
            merge._del = true;
            refresh    = true;
          } else {
            // 删除过后，还是合并的单元格
            ms.push(merge);
          }
        } else if (curColumnIndex <= merge.start.columnIndex) {
          merge.start.columnIndex -= delColumnNum;
          merge.end.columnIndex -= delColumnNum;
          refresh = true;
        }
      });
      _.each(this.cells, row => {
        if (row) {
          row.splice(curColumnIndex, delColumnNum);
        }
      });
      _.each(ms, m => {
        this.c_addCell(m.start.rowIndex, m.start.columnIndex);
      });
      this.columns.splice(curColumnIndex, delColumnNum);
      this.columnCount -= delColumnNum;
      if (refresh) {
        this.m_refreshMerge();
      }
      this.$emit('on-column-change', {
        cur: curColumnIndex,
        num: -delColumnNum,
      });
    },
    hideColumn(area){
      this.recordChange('RCChange', {
        area,
        type: 'column',
      });
      _.$eachRange(area.start.columnIndex, area.end.columnIndex, index => {
        const column = _.$getArrayItem(this.columns, index, { h: true });
        this.$set(column, 'h', true);
      });
    },
    unHideColumn(area){
      this.recordChange('RCChange', {
        area,
        type: 'column',
      });
      _.$eachRange(area.start.columnIndex, area.end.columnIndex, index => {
        if (_.get(this.columns[index], 'h')) {
          this.columns[index].h = undefined;
        }
      });
    },
    hideRow(area){
      this.recordChange('RCChange', {
        area,
        type: 'row',
      });
      _.$eachRange(area.start.rowIndex, area.end.rowIndex, index => {
        const row = _.$getArrayItem(this.rows, index, { h: true });
        this.$set(row, 'h', true);
      });
    },
    unHideRow(area){
      this.recordChange('RCChange', {
        area,
        type: 'row',
      });
      _.$eachRange(area.start.rowIndex, area.end.rowIndex, index => {
        if (_.get(this.rows[index], 'h')) {
          this.rows[index].h = undefined;
        }
      });
    },
  },
};
