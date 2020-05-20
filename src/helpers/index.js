import _ from 'lodash';

// 矩形相减
export function rectSubtract(rect1, rect2) {

  function getIntersection(sr1, er1, sr2, er2) {
    let s = Math.min(er1, er2), e;
    if (sr1 < sr2) {
      e = sr2;
    } else {
      e = sr1;
    }
    if (s >= e) {
      return [e, s];
    }
  }

  if (_.isEqual(rect1, rect2)) {
    return [];
  }

  const rs = getIntersection(rect1.start.rowIndex, rect1.end.rowIndex, rect2.start.rowIndex, rect2.end.rowIndex,);

  const cs = getIntersection(rect1.start.columnIndex, rect1.end.columnIndex, rect2.start.columnIndex, rect2.end.columnIndex,);

  if (rs && cs) {
    const arr = [];

    let pos = rect1.start.rowIndex < rect2.start.rowIndex ? 'start' : 'end';
    if (rect1[pos].rowIndex != rect2[pos].rowIndex) {
      const allColumnRect = {
        start: {},
        end: {},
      };
      Object.assign(allColumnRect.start, rect1.start, {
        rowIndex: Math.min(rect1[pos].rowIndex, rect2[pos].rowIndex + (pos == 'start' ? -1 : 1)),
      });
      Object.assign(allColumnRect.end, rect1.end, {
        rowIndex: Math.max(rect1[pos].rowIndex, rect2[pos].rowIndex + (pos == 'start' ? -1 : 1)),
      });
      arr.push(allColumnRect);
    }

    pos = rect1.start.columnIndex < rect2.start.columnIndex ? 'start' : 'end';

    if (rect1[pos].columnIndex != rect2[pos].columnIndex) {
      const otherColumnRect = {
        start: {},
        end: {},
      };

      Object.assign(otherColumnRect.start, {
        rowIndex: rs[0],
        columnIndex: Math.min(rect1[pos].columnIndex, rect2[pos].columnIndex + (pos == 'start' ? -1 : 1)),
      });
      Object.assign(otherColumnRect.end, {
        rowIndex: rs[1],
        columnIndex: Math.max(rect1[pos].columnIndex, rect2[pos].columnIndex + (pos == 'start' ? -1 : 1)),
      });

      arr.push(otherColumnRect);
    }

    return arr;
  }
  return [_.cloneDeep(rect1)];

}


export function getAreaCutLeftOrTope(area, leftOrTop, widthOrHeight, fixedWidthOrHeight, fixedIndex, scrollLeftOrTop, rowOrColumnType) {

  //选中开始位置在冻结单元格的右侧
  if (area.start[rowOrColumnType] >= fixedIndex) {
    leftOrTop -= scrollLeftOrTop;

    if (leftOrTop < fixedWidthOrHeight) {
      if (leftOrTop + widthOrHeight > fixedWidthOrHeight) {
        widthOrHeight = widthOrHeight - (fixedWidthOrHeight - leftOrTop);
        leftOrTop     = fixedWidthOrHeight;
      } else if (area.end[rowOrColumnType] >= fixedIndex) {
        leftOrTop     = -10;
        widthOrHeight = 0;
      }
    }
  } else if (area.end[rowOrColumnType] >= fixedIndex) {
    widthOrHeight -= scrollLeftOrTop;
    widthOrHeight = Math.max(widthOrHeight, fixedWidthOrHeight - leftOrTop)
  }

  if (rowOrColumnType == 'columnIndex') {
    return {
      left: leftOrTop,
      width: widthOrHeight
    }
  } else {
    return {
      top: leftOrTop,
      height: widthOrHeight
    }
  }

}
