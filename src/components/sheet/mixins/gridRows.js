import _ from 'lodash';

export default {
//  beforeCreate() {
//    this.gridRowsCachesKeys = [];
//  },
//  created() {
//    this.$on('on-freeze-window', this.updateGridRowsCaches);
//  },
//  data() {
//    return {
//      gridRowsCaches: {},
//      gridRowsChange: false,
//    };
//  },
//  watch: {
//    cells() {
//      this.updateGridRowsCaches();
//    },
//    rows() {
//      this.updateGridRowsCaches();
//    },
//    columns() {
//      this.updateGridRowsCaches();
//    },
//    merges() {
//      this.updateGridRowsCaches();
//    },
//  },
  methods: {
//    updateGridRowsCaches() {
//      if (this.__UPDATE_GRID_ROWS_STATE__) return;
//      this.__UPDATE_GRID_ROWS_STATE__ = true;
//
//      this.$nextTick(() => {
//
//        for(let i = 0; i < this.gridRowsCachesKeys.length; i++) {
//          const oldKey = this.gridRowsCachesKeys.shift();
//          this.getGridRows(oldKey.area, true);
//        }
//
//        this.gridRowsChange = true;
//        this.__UPDATE_GRID_ROWS_STATE__ = false;
//
//        this.$nextTick(() => {
//          this.gridRowsChange = false;
//        });
//
//      });
//
//    },

    getGridRows(area, refresh) {
      const { start, end } = area;
//      const key            = _.$area2ExcelIndex(area);
//      if (!refresh && this.gridRowsCaches[key]) {
//        return this.gridRowsCaches[key];
//      }
//
//      this.gridRowsCachesKeys.push({ key, area });

//      if (this.gridRowsCachesKeys.length > 100) {
//        const oldKey                    = this.gridRowsCachesKeys.shift();
//        this.gridRowsCaches[oldKey.key] = undefined;
//      }

      const merges = [];


      function gerMerge(pos) {
        return _.find(merges, merge => {
          if (merge) {
            return _.$inArea(merge, pos);
          }
        });
      }

      /*this.gridRowsCaches[key] = */
      return _.$mapRange(start.rowIndex, end.rowIndex - 1, rowIndex => {
        const cells = this.getRowCells(rowIndex, start.columnIndex, end.columnIndex - 1);
        return {
          rowIndex,
          cells: _.map(cells, (option, index) => {
            const columnIndex = start.columnIndex + index;
            const cell = {
              option,
              columnIndex,
              rowIndex,
            };

            if (_.isUndefined(option)) {

              let merge = null;

              if (rowIndex === start.rowIndex || index === 0) {
                if (!gerMerge({ rowIndex, columnIndex })) {
                  merge = this.getPosOwnerMerge({
                    rowIndex, columnIndex,
                  });
                }
              }

              if (merge) {
                merges.push(merge);
                cell.option = this.getPosCell(merge.start);
                cell.rowIndex = merge.start.rowIndex;
                cell.columnIndex = merge.start.columnIndex;
              }
            }

            return cell;
          }),
        };
      });

//      return this.gridRowsCaches[key];
    },

//    findTopMerge(rowIndex, columnIndex) {
//      for(let _rowIndex = rowIndex - 1; _rowIndex >= 0; _rowIndex--) {
//
//        const merge = this.getMerge({
//          rowIndex: _rowIndex,
//          columnIndex,
//        });
//
//        if (merge && merge.end.rowIndex >= rowIndex) {
//          return merge;
//        }
//
//        if (this.getCell(_rowIndex, columnIndex)) {
//          return;
//        }
//
//      }
//    },
//
//    findLeftMerge(rowIndex, columnIndex) {
//      for(let _columnIndex = columnIndex - 1; _columnIndex >= 0; _columnIndex--) {
//
//        const merge = this.getMerge({
//          rowIndex,
//          columnIndex: _columnIndex,
//        });
//
//        if (merge && merge.end.columnIndex >= columnIndex) {
//          return merge;
//        }
//
//        if (this.getCell(rowIndex, _columnIndex)) {
//          return;
//        }
//
//      }
//    },

  },
};
