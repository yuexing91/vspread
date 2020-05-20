import CellsChange from './CellsChange';
import Merge from './Merge';

class DelColumn {
  constructor(sheet, option) {
    this.sheet  = sheet;
    this.option = option;
    this.area   = {
      start: {
        rowIndex: 0,
        columnIndex: option.curIndex,
      },
      end: {
        rowIndex: sheet.rowCount,
        columnIndex: option.curIndex + option.num - 1,
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
      this.sheet.insterColumn(this.option.curIndex, this.option.num);
      this.sheet.restoreArea(this.area, this.cellsChangeRecord.areaCells);
      this.sheet.setAreaMergers(this.area, _.cloneDeep(this.mergeRecord.areaMerges));
    } else {
      this.sheet.delColumn(this.option.curIndex, this.option.num);
    }
  }

}

export default DelColumn;
