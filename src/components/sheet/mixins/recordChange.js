/**
 * 复制粘贴
 * 剪切粘贴
 * 双击修改
 * 笔刷
 * 删除
 * 隐藏/取消隐藏
 * 设置格式
 * 合并/取消合并
 * 调整大小
 * 插入删除 行列
 */
import _ from 'lodash';
import { isNotNullCell } from './cell/cellUtil';
import RecoreFactory from './record';

export default {
  data(){
    return {
      undoList: [],
      redoList: [],
      comboRecord: false,
      comboRecordList: [],
    };
  },

  methods: {
    recordChange(type, options){
      const Record = RecoreFactory.getRecord(type);
      const record = new Record(this, options);
      const list   = this.comboRecord ? this.comboRecordList : this.undoList;
      list.push({
        record,
        selection: _.cloneDeep(this.selection),
      });
      this.redoList = [];
      return record;
    },

    openComboRecord(){
      this.comboRecord = true;
    },

    closeComboRecord(){
      if (!_.isEmpty(this.comboRecordList)) {
        this.undoList.push(this.comboRecordList);
        this.comboRecordList = [];
      }
      this.comboRecord = false;
    },

    undo(){
      if (_.isEmpty(this.undoList)) {
        return;
      }
      const lasts   = this.undoList.pop();
      let selection = null;

      _.eachRight(_.castArray(lasts), last => {
        last.record.record('undo');
        last.record.restore('undo');
        selection = last.selection;
      });
      this.redoList.push(lasts);
      this.setSelectArea(Object.assign({}, selection.start), Object.assign({}, selection.end));
    },

    redo(){
      if (_.isEmpty(this.redoList)) {
        return;
      }
      const lasts   = this.redoList.pop();
      let selection = null;

      _.each(_.castArray(lasts), last => {
        last.record.record('redo');
        last.record.restore('redo');
        selection = last.selection;
      });

      this.undoList.push(lasts);
      this.setSelectArea(Object.assign({}, selection.start), Object.assign({}, selection.end));
    },

    restoreArea(area, areaCells){
      const minArea = this.minArea(area);
      _.$mapRange(minArea.start.rowIndex, minArea.end.rowIndex, rowIndex => {
        const row = this.getRow(rowIndex);
        if (row) {
          const rIndex = rowIndex - area.start.rowIndex;
          let _row     = areaCells[rIndex];
          if (!_row) {
            areaCells[rIndex] = _row = [];
          }
          _.$mapRange(minArea.start.columnIndex, minArea.end.columnIndex, columnIndex => {
            if (row[columnIndex]) {
              const cIndex = columnIndex - area.start.columnIndex;
              if (!_row[cIndex]) {
                _row[cIndex] = {
                  pos: {
                    rowIndex,
                    columnIndex,
                  },
                  options: undefined,
                };
              }
            }
          });
        }
      });
      const cells = _.chain(areaCells).map().flatten().filter().value();
      this.c_setCells(cells);
    },

    getCloneArea(area){
      const minArea = this.minArea(area);
      const rows    = {};
      _.$eachRange(minArea.start.rowIndex, minArea.end.rowIndex, rowIndex => {
        const row = this.getRow(rowIndex);
        if (row) {
          rows[rowIndex - minArea.start.rowIndex] = _.$mapRange(minArea.start.columnIndex, minArea.end.columnIndex, columnIndex => {
            if (isNotNullCell(row[columnIndex])) {
              return {
                pos: {
                  rowIndex,
                  columnIndex,
                },
                options: _.cloneDeep(row[columnIndex]),
              };
            }
          });
        }
      });
      return rows;
    },
  },
};

