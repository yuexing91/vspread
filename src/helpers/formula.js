import _ from 'lodash';

const REF_REG_G = /R(\[-?\d+\])?C(\[-?\d+\])?/g;

_.mixin({
  $isFormula(str){
    return str && str.startsWith('=') && str.length > 1;
  },
  $replaceFormulaRefs(formula, iteratee){
    const reg = /R(\[-?\d+\])?C(\[-?\d+\])?:R(\[-?\d+\])?C(\[-?\d+\])?|R(\[-?\d+\])?C(\[-?\d+\])?/ig;
    return formula.replace(reg, function () {
      let type, pos;
      if (arguments[0].indexOf(':') != -1) {
        type = 'area';
        pos  = {
          start: {
            rowIndex: _.$matchNumber(arguments[1]),
            columnIndex: _.$matchNumber(arguments[2]),
          },
          end: {
            rowIndex: _.$matchNumber(arguments[3]),
            columnIndex: _.$matchNumber(arguments[4]),
          },
        };
      } else {
        type = 'cell';
        pos  = {
          rowIndex: _.$matchNumber(arguments[5]),
          columnIndex: _.$matchNumber(arguments[6]),
        };
      }
      return iteratee(type, pos, arguments[0]);
    });
  },

  $compileFormula(formula){
    const code = _.$replaceFormulaRefs(formula, (type, pos, ref) => {
      return ref.replace(/\[|\]/g, '').replace(/-/g, '_');
    });
    return code;
  },
  $formulaRefToIndex(formulaRef){
    const match       = formulaRef.replace(/_/g, '-').match(/R(-?\d+)?C(-?\d+)?/);
    const rowIndex    = match[1] ? +match[1] : 0;
    const columnIndex = match[2] ? +match[2] : 0;

    return {
      rowIndex,
      columnIndex,
    };
  },
  $parseRefs(formula, pos){
    if (!_.$isFormula(formula)) {
      return formula;
    }

    return formula.replace(REF_REG_G, (ref, r, c) => {
      const rowIndex    = _.$matchNumber(r);
      const columnIndex = _.$matchNumber(c);
      return _.$indexToExcelIndex(pos.rowIndex + rowIndex, pos.columnIndex + columnIndex);
    });
  },
  $getRef(pos1, pos2){
    let r = pos2.rowIndex - pos1.rowIndex,
        c = pos2.columnIndex - pos1.columnIndex;

    r = r ? `[${r}]` : '';
    c = c ? `[${c}]` : '';

    return `R${r}C${c}`;
  },
});
