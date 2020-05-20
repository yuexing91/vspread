import _ from 'lodash';

_.mixin({
  $Number2ABC(num) {
    ++num;
    let code = '';
    while (num > 0) {
      let m = num % 26;
      if (m == 0) {
        m = 26;
      }
      code = String.fromCharCode(64 + parseInt(m)) + code;
      num  = ( num - m ) / 26;
    }
    return code;
  },
  $ABC2Number(code){
    let num = 0;
    for(let i = code.length - 1, j = 1; i >= 0; i--, j *= 26) {
      num += (code[i].charCodeAt() - 64 ) * j;
    }
    return --num;
  },
  $excelIndexToIndex(excelIndex){
    let rowIndex    = _.$matchNumber(excelIndex) - 1;
    let columnIndex = excelIndex.replace(/\d+/, '').toUpperCase();

    columnIndex = _.$ABC2Number(columnIndex);

    return {
      rowIndex, columnIndex,
    };
  },
  $indexToExcelIndex(rowIndex, columnIndex){
    if (_.isPlainObject(rowIndex)) {
      columnIndex = rowIndex.columnIndex;
      rowIndex    = rowIndex.rowIndex;
    }

    return `${_.$Number2ABC(columnIndex)}${rowIndex + 1}`;
  },
  $matchNumber(str){
    if (_.isEmpty(str)) {
      return 0;
    }
    const m = str.match(/-?\d+/);
    if (_.isEmpty(m)) {
      return 0;
    }
    return +m[0];
  },

  $strToPos(str){
    const t = str.split('_');

    return {
      rowIndex: +t[0],
      columnIndex: +t[1],
    };
  },

  $posToStr(pos){
    return `${pos.rowIndex}_${pos.columnIndex}`;
  },

  $posAdd(pos, _pos){
    if (pos.start) {
      _.$posAdd(pos.start, _pos);
      _.$posAdd(pos.end, _pos);
    } else {
      pos.rowIndex += _pos.rowIndex || 0;
      pos.columnIndex += _pos.columnIndex || 0;
    }
  },

  $area2ExcelIndex(area){
    let { start, end } = _.$getAreaPole(area);

    let s = _.$indexToExcelIndex(start.rowIndex, start.columnIndex);
    if (_.isEqual(start, end)) {
      return s;
    }

    let e = _.$indexToExcelIndex(end.rowIndex, end.columnIndex);
    return s + ':' + e;
  },

});
