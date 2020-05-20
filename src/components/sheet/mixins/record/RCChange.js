class RCChange {
  constructor(sheet, option) {
    this.sheet  = sheet;
    this.option = option;
    this.record();
  }

  record() {
    const area = this.option.area;
    let infos  = [];

    if (this.option.type == 'row') {
      infos = this.sheet.rows.slice(area.start.rowIndex, area.end.rowIndex + 1);
    } else {
      infos = this.sheet.columns.slice(area.start.columnIndex, area.end.columnIndex + 1);
    }

    this.tempInfos  = this.changeInfos
    this.changeInfos  = _.cloneDeep(infos);
  }

  restore() {
    const area = this.option.area;
    if (this.option.type == 'row') {
      this.sheet.rows.splice(area.start.rowIndex,
        area.end.rowIndex - area.start.rowIndex + 1,
        ...this.tempInfos);
    } else {
      this.sheet.columns.splice(area.start.columnIndex,
        area.end.columnIndex - area.start.columnIndex + 1,
        ...this.tempInfos);
    }
  }
}

export default RCChange;
