import CellsChange from './CellsChange';
import Merge from './Merge'

class Copy{
  constructor(sheet, option){
    this.cellsChangeRecord = new CellsChange(sheet,option.tArea)
    this.mergeRecode = new Merge(sheet,option.tArea);
  }

  record() {
    this.cellsChangeRecord.record();
    this.mergeRecode.record();
  }

  restore() {
    this.cellsChangeRecord.restore();
    this.mergeRecode.restore();
  }

}

export default Copy;
