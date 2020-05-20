import CellsChange from './CellsChange';

class StyleChange {
  constructor(sheet, option) {
    this.sheet             = sheet;
    this.cellsChangeRecode = new CellsChange(sheet, option.area);
    this._record();
  }

  record() {
    this.cellsChangeRecode.record();
    this._record();
  }

  restore() {
    this.cellsChangeRecode.restore();
    _.each(this.tempStyles, (style, sid) => {
      this.sheet.getStyle(sid).setOption(style);
    });
  }

  _record() {
    const sids = {};
    let cells = [];
    _.each(this.cellsChangeRecode.areaCells,_cells=>{
      cells = cells.concat(_cells)
    })

    _.each(cells, cell => {
      if (cell && cell.options && cell.options.s) {
        sids[cell.options.s] = 1;
      }
    });

    this.tempStyles = this.changeStyles;
    this.changeStyles  = _.mapValues(sids, (t,sid) => {
      return _.cloneDeep(this.sheet.getStyle(sid).option);
    });

  }
}

export default StyleChange;
