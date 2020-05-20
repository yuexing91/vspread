import CellsChange from './CellsChange';
import Merge from './Merge';

class MergeCell{
  constructor(sheet, area){
    this.mergeRecode = new Merge(sheet,area)
    this.cellsChangeRecode = new CellsChange(sheet,area)
  }

  record() {
    this.mergeRecode.record();
    this.cellsChangeRecode.record();
  }

  restore() {
    this.mergeRecode.restore();
    this.cellsChangeRecode.restore();
  }
}

export default MergeCell;
