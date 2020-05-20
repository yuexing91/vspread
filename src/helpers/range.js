import _ from 'lodash';

_.mixin({

  $areaTransform(area, dir){
    if (dir == 'left') {
      return {
        start: {
          rowIndex: area.start.rowIndex,
          columnIndex: area.end.columnIndex,
        },
        end: {
          rowIndex: area.end.rowIndex,
          columnIndex: area.start.columnIndex,
        },
      };
    }
    if (dir == 'up') {
      return {
        start: {
          rowIndex: area.end.rowIndex,
          columnIndex: area.start.columnIndex,
        },
        end: {
          rowIndex: area.start.rowIndex,
          columnIndex: area.end.columnIndex,
        },
      };
    }

    return _.cloneDeep(area);
  },

  $mapRange(start, end, iteratee){
    const result = [];
    if (start > end) {
      for(let i = start; i >= end; i--) {
        result.push(iteratee(i));
      }
    } else {
      for(let i = start; i <= end; i++) {
        result.push(iteratee(i));
      }
    }
    return result;
  },
  $eachRange(start, end, iteratee){
    if (start > end) {
      for(let i = start; i >= end; i--) {
        iteratee(i);
      }
    } else {
      for(let i = start; i <= end; i++) {
        iteratee(i);
      }
    }
  },
  $eachArea(area, rowIteratee, columnIteratee) {
    _.$eachRange(area.start.rowIndex, area.end.rowIndex, function (rowIndex) {
      const rowResult = _.isFunction(rowIteratee) ? rowIteratee(rowIndex) : undefined;
      _.$eachRange(area.start.columnIndex, area.end.columnIndex, function (columnIndex) {
        if (_.isFunction(columnIteratee)) {
          columnIteratee(columnIndex, rowIndex, rowResult);
        }
      });
    });
  },
  $inRange(number, start, end) {
    return number >= start
      && number <= end;
  },
  $inArea(region, pos) {
    if (!region) return false;

    return _.$inRange(pos.rowIndex, region.start.rowIndex, region.end.rowIndex)
      && _.$inRange(pos.columnIndex, region.start.columnIndex, region.end.columnIndex);
  },
  /***
   * 返回从左上到右下的area
   * @param area
   * @return {{start: {columnIndex: number, rowIndex: number}, end: {columnIndex: number, rowIndex: number}}}
   */
  $getAreaPole(area){
    let sc = Math.min(area.start.columnIndex, area.end.columnIndex);
    let ec = Math.max(area.start.columnIndex, area.end.columnIndex);
    let sr = Math.min(area.start.rowIndex, area.end.rowIndex);
    let er = Math.max(area.start.rowIndex, area.end.rowIndex);

    return {
      start: {
        columnIndex: sc,
        rowIndex: sr,
      },
      end: {
        columnIndex: ec,
        rowIndex: er,
      },
    };
  },
  /***
   * 是否有交集
   * @param area1
   * @param area2
   * @return {boolean}
   */
  $isCollision(area1, area2) {
    const minx = Math.max(area1.start.rowIndex, area2.start.rowIndex);
    const miny = Math.max(area1.start.columnIndex, area2.start.columnIndex);
    const maxx = Math.min(area1.end.rowIndex, area2.end.rowIndex);
    const maxy = Math.min(area1.end.columnIndex, area2.end.columnIndex);

    if (minx > maxx || miny > maxy) {
      return false;
    }
    return true;
  },
});
