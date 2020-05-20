import _ from 'lodash';

class Resize {
  constructor(sheet, option) {
    this.sheet  = sheet;
    this.option = option;
    this.record();
  }

  record() {
    this.tempSizeInfo = this.sizeInfo;
    const obj         = this.sheet[`${this.option.type}s`];
    this.sizeInfo     = _.cloneDeep(obj[this.option.index]);
  }

  restore() {
    _.$setArrayItem(this.sheet[`${this.option.type}s`], this.option.index, this.tempSizeInfo);
  }
}

export default Resize;
