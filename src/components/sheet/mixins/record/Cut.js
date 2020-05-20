import Copy from './Copy';
class Cut {
  constructor(sheet, option) {
    this.sCopy = new Copy(sheet, {
      tArea: option.sArea,
    });
    this.tCopy = new Copy(sheet, {
      tArea: option.tArea,
    });
  }

  record() {
    this.sCopy.record();
    this.tCopy.record();
  }

  restore() {
    this.sCopy.restore();
    this.tCopy.restore();
  }
}

export default Cut;
