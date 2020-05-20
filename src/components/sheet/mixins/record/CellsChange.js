import _ from 'lodash';

class CellsChange {
  constructor(sheet, area) {
    this.sheet = sheet;
    this.area  = _.cloneDeep(area);
    this.record();
  }

  record() {
    this.tempAreaCells = this.areaCells;
    this.areaCells     = this.sheet.getCloneArea(this.area);
  }

  restore() {
    this.sheet.restoreArea(this.area, this.tempAreaCells);
  }

}

export default CellsChange;
