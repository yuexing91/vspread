//api
import { rectSubtract } from '../../../helpers';
import _ from 'lodash';

export default {
  data() {
    return {
      curAction: '',// editer copy cut formatpainter
    };
  },
  methods: {
    //菜单项的合并单元格
    doMergeCell(type) {
      this.stopAction();
      this.openComboRecord();

      const after = Object.assign({}, this.selctionExpand);
      if (this.isMerge(this.selctionExpand)) {
        this.unMergeCell(this.selctionExpand);
      } else {
        this.mergeCell(this.selctionExpand);
        this.setSelectArea(this.selctionExpand.start);
//        if (type == 'center') {
//          this.setTextAlign('center');
//        }
      }

      this.closeComboRecord();

      this.selection = after;
    },
    //开始编辑单元格
    doEditCell() {
      this.curAction = 'editer';
    },
    doCancelEdit() {
      this.curSelectionName = '';
      this.selectionEditer = null;
      this.curAction = null;
    },
    //编辑完成
    doEditCellValue(value) {
      this.recordChange('cellsChange', this.selection);
      this.setCellValue(this.selection.start, value);
    },
    doOpenFormatpainter() {
      this.curAction = 'formatpainter';
      this.selectionCopy = _.cloneDeep(this.selctionExpand);
    },
    // 复制当前选中当前单元格
    doCopySelection() {
      this.curAction = 'copy';
      this.selectionCopy = _.cloneDeep(this.selctionExpand);
    },
    // 复制当前选中当前单元格
    doCutSelection() {
      this.curAction = 'cut';
      this.selectionCopy = _.cloneDeep(this.selctionExpand);
    },
    // 粘贴当前选中的单元格
    doPasteSelection() {
      if (this.selectionCopy != null && ( this.curAction == 'cut' || this.curAction == 'copy' )) {

        const start = Object.assign({}, this.selctionExpand.start);
        const end = {
          rowIndex: start.rowIndex + this.selectionCopy.end.rowIndex - this.selectionCopy.start.rowIndex,
          columnIndex: start.columnIndex + this.selectionCopy.end.columnIndex - this.selectionCopy.start.columnIndex,
        };
        const tArea = { start, end };

        this.recordChange(this.curAction, {
          sArea: this.selectionCopy,
          tArea,
        });

        this.copyToAreaCells(this.selectionCopy, tArea);
        this.copyToAreaMerges(this.selectionCopy, tArea);

        //剪切粘贴 需要清空剪切的部分，要注意粘贴和剪切重叠的区域不用清空
        if (this.curAction == 'cut') {
          const otherAreas = rectSubtract(this.selectionCopy, tArea);
          _.each(otherAreas, area => {
            this.clearAreaCells(area);
            this.removeAreaMerges(area);
          });
          this.curAction = null;
        }
      }
    },
    // 删除当前选中单元格
    doDelSelectionCell() {
      this.stopAction();
    },
    // 删除当前选中单元格值
    doDelSelectionVal() {
      this.stopAction();
      this.recordChange('cellsChange', this.selctionExpand);
      this.eachAreaCell(this.selctionExpand, (cell, pos) => {
        if (cell) {
          this.delCellValue(pos);
        }
      });
    },
    //重做
    doRedo() {
      this.redo();
    },
    //撤销
    doUndo() {
      this.undo();
    },
    //删除列
    doDelColumn() {
      const delColumnNum = this.selctionExpand.end.columnIndex - this.selctionExpand.start.columnIndex + 1;
      this.recordChange('delColumn', {
        curIndex: this.selctionExpand.start.columnIndex,
        num: delColumnNum,
      });
      this.delColumn(this.selctionExpand.start.columnIndex, delColumnNum);
    },
    //插入列
    doInsterColumn() {
      const insterColumnNum = this.selctionExpand.end.columnIndex - this.selctionExpand.start.columnIndex + 1;
      this.recordChange('insterColumn', {
        curIndex: this.selctionExpand.start.columnIndex,
        num: insterColumnNum,
      });
      this.insterColumn(this.selctionExpand.start.columnIndex, insterColumnNum);
    },
    //删除行
    doDelRow() {
      const delRowNum = this.selctionExpand.end.rowIndex - this.selctionExpand.start.rowIndex + 1;
      this.recordChange('delRow', {
        curIndex: this.selctionExpand.start.rowIndex,
        num: delRowNum,
      });
      this.delRow(this.selctionExpand.start.rowIndex, delRowNum);
    },
    //插入行
    doInsterRow() {
      const insterRowNum = this.selctionExpand.end.rowIndex - this.selctionExpand.start.rowIndex + 1;
      this.recordChange('insterRow', {
        curIndex: this.selctionExpand.start.rowIndex,
        num: insterRowNum,
      });
      this.insterRow(this.selctionExpand.start.rowIndex, insterRowNum);
    },
    doHideColumn() {
      this.hideColumn(this.selctionExpand);
    },
    doUnHideColumn() {
      this.unHideColumn(this.selctionExpand);
    },
    doHideRow() {
      this.hideRow(this.selctionExpand);
    },
    doUnHideRow() {
      this.unHideRow(this.selctionExpand);
    },
    //移动光标
    doMoveSelected(direction) {
      const start = Object.assign({}, this.tempMoveSelectionPos);
      switch (direction) {
        case 'up': {
          start.rowIndex--;
          break;
        }
        case 'down': {
          start.rowIndex = this.selection.end.rowIndex + 1;
          break;
        }
        case 'left': {
          start.columnIndex--;
          break;
        }
        case 'right': {
          start.columnIndex = this.selection.end.columnIndex + 1;
          break;
        }
      }

      const maxRowCount = this.relMaxRowCount;
      const maxColumnCount = this.relMaxColumnCount;

      if (_.inRange(start.rowIndex, maxRowCount) && _.inRange(start.columnIndex, maxColumnCount)) {

        const merge = this.getPosOwnerMerge(start);

        if (merge) {
          this.selection = _.cloneDeep(merge);
        } else {
          this.selection = {
            start,
            end: Object.assign({}, start),
          };
        }

        this.$nextTick(() => {
          this.tempMoveSelectionPos = start;
        });
      }
    },
  },
};
