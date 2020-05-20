import CellsChange from './CellsChange';
import Merge from './Merge';

class DelRow {
  constructor(sheet, option) {
    this.sheet  = sheet;
    this.option = option;
    this.area   = {
      start: {
        rowIndex: option.curIndex,
        columnIndex: 0,
      },
      end: {
        rowIndex: option.curIndex + option.num - 1,
        columnIndex: sheet.columnCount,
      },
    };

    this.cellsChangeRecord = new CellsChange(sheet, this.area);
    this.mergeRecord       = new Merge(sheet, this.area);
  }

  record() {
//    this.cellsChangeRecord.record();
  }

  restore(type) {
    if (type == 'undo') {
      this.sheet.insterRow(this.option.curIndex, this.option.num);
      this.sheet.restoreArea(this.area, this.cellsChangeRecord.areaCells);
      this.sheet.setAreaMergers(this.area, _.cloneDeep(this.mergeRecord.areaMerges));
    } else {
      this.sheet.delRow(this.option.curIndex, this.option.num);
    }
  }

}

export default DelRow;
