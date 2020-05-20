import RCChange from './RCChange';

class RCStyleChange {
  constructor(sheet, option) {
    this.sheet    = sheet;
    this.option   = option;
    this.RCChange = new RCChange(sheet, option);
    this._record();
  }

  record() {
    this.RCChange.record();
    this._record();
  }

  _record() {
    this.tempStyles   = this.changeStyles;
    this.changeStyles = _.mapValues(_.groupBy(this.RCChange.changeInfos, 's'), (t, sid) => {
      if (sid == 'undefined') {
        return;
      }
      return _.cloneDeep(this.sheet.getStyle(sid, 'RCStyles').option);
    });
  }

  restore() {
    this.RCChange.restore();
    _.each(this.tempStyles, (style, sid) => {
      if (sid == 'undefined') {
        return;
      }
      this.sheet.getStyle(sid, 'RCStyles').setOption(style);
    });
  }

}

export default RCStyleChange;
