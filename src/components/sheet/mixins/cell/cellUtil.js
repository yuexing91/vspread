import _ from 'lodash';

export function getCellValue(cell) {
  return isOnlyValueCell(cell) ? cell : cell.v;
}

export function isNullCell(cell) {
  return _.isUndefined(cell) || _.isNull(cell);
}

export function isNotNullCell(cell) {
  return !isNullCell(cell);
}

export function getCellRelValue(cell) {
  const v = +getCellValue(cell);
  return _.isNaN(v) ? 0 : v;
}

export function isOnlyValueCell(cell) {
  return !_.isPlainObject(cell);
}

export function castObjectCell(cell) {
  return _.isPlainObject(cell) ? cell : { v: cell };
}
