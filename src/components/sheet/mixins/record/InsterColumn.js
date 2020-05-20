class InsterColumn {
  constructor(sheet, option) {
    this.sheet  = sheet;
    this.option = option;
  }

  record() {

  }

  restore(type) {
    if (type == 'undo') {
      this.sheet.delColumn(this.option.curIndex, this.option.num);
    } else {
      this.sheet.insterColumn(this.option.curIndex, this.option.num);
    }
  }

}

export default InsterColumn;
