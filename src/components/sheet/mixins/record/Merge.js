class Merge {
  constructor(sheet, area) {
    this.sheet = sheet;
    this.area  = _.cloneDeep(area);
    this.record();
  }

  record() {
    this.tempAreaMerges = this.areaMerges;
    this.areaMerges     = _.cloneDeep(this.sheet.getAreaMerges(this.area));
  }

  restore() {
    this.sheet.setAreaMergers(this.area, this.tempAreaMerges);
  }
}

export default Merge;
