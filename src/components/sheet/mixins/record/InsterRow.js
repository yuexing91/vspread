class InsterRow {
  constructor(sheet, option) {
    this.sheet  = sheet;
    this.option = option;
  }

  record() {

  }

  restore(type) {
    if (type == 'undo') {
      this.sheet.delRow(this.option.curIndex, this.option.num);
    } else {
      this.sheet.insterRow(this.option.curIndex, this.option.num);
    }
  }

}

export default InsterRow;
