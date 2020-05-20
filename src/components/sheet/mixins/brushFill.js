import SheetBrushFill from '../SheetBrushFill.vue';
import { isNullCell, isOnlyValueCell } from './cell/cellUtil';

export default {
  data(){
    return {
      brushFillInfo: null,
    };
  },
  components: {
    SheetBrushFill,
  },
  computed: {},

  watch: {},

  methods: {
    openBrushFill(){
      this.curAction = 'brushFill';

      let { top, left, height, width } = this.selectionInfo;
      top                              = top - this.scrollTop;
      left                             = left - this.scrollLeft;

      const right = left + width, bottom = top + height;

      const move = (e) => {

        this.boundsScroll(e, {
          name: 'brushFill',
        }, e => {
          const x = e.pageX - this.contentPos.left, y = e.pageY - this.contentPos.top;

          const all = [
            { dir: 'up', value: top - y },
            { dir: 'down', value: y - bottom },
            { dir: 'left', value: left - x },
            { dir: 'right', value: x - right },
          ];

          const max = _.maxBy(all, 'value');
          if (max.value > 0) {
            const brushFillInfo = _.cloneDeep(this.selctionExpand);

            switch (max.dir) {
              case 'up': {
                const len = brushFillInfo.end.rowIndex - brushFillInfo.start.rowIndex + 1;
                let size  = (brushFillInfo.start.rowIndex - this.getRowIndexByPix(e.pageY)) % len;
                if (size != 0) {
                  size = len - size;
                }
                brushFillInfo.start.rowIndex = this.getRowIndexByPix(e.pageY) - size;
                break;
              }
              case 'down': {
                const len = brushFillInfo.end.rowIndex - brushFillInfo.start.rowIndex + 1;
                let size  = (this.getRowIndexByPix(e.pageY) - brushFillInfo.end.rowIndex) % len;
                if (size != 0) {
                  size = len - size;
                }
                brushFillInfo.end.rowIndex = this.getRowIndexByPix(e.pageY) + size;
                break;
              }
              case 'left': {
                const len = brushFillInfo.end.columnIndex - brushFillInfo.start.columnIndex + 1;
                let size  = (brushFillInfo.start.columnIndex - this.getColumnIndexByPix(e.pageX)) % len;
                if (size != 0) {
                  size = len - size;
                }
                brushFillInfo.start.columnIndex = this.getColumnIndexByPix(e.pageX) - size;
                break;
              }

              case 'right':
                const len = brushFillInfo.end.columnIndex - brushFillInfo.start.columnIndex + 1;
                let size  = (this.getColumnIndexByPix(e.pageX) - brushFillInfo.end.columnIndex) % len;
                if (size != 0) {
                  size = len - size;
                }
                brushFillInfo.end.columnIndex = this.getColumnIndexByPix(e.pageX) + size;
                break;
            }

            brushFillInfo.dir = max.dir;

            this.brushFillInfo = brushFillInfo;
          } else {
            this.brushFillInfo = null;
          }
        });

      };

      const up = () => {
        this.clearBoundsScroll('brushFill');
        this.bf_applyBrushFill();
        document.removeEventListener('mousemove', move);
        document.removeEventListener('mouseup', up);
      };

      document.addEventListener('mousemove', move);
      document.addEventListener('mouseup', up);

    },

    bf_applyBrushFill(){
      if (this.brushFillInfo == null) return;

      let varIndex = 'rowIndex', fiexdIndex = 'columnIndex';

      if (this.brushFillInfo.dir == 'right' || this.brushFillInfo.dir == 'left') {
        varIndex = 'columnIndex', fiexdIndex = 'rowIndex';
      }
      const length = this.selctionExpand.end[varIndex] - this.selctionExpand.start[varIndex] + 1;

      let startIndex = this.selctionExpand.start[varIndex] - 1;
      let endIndex   = this.brushFillInfo.start[varIndex];

      if (this.brushFillInfo.dir == 'down' || this.brushFillInfo.dir == 'right') {
        startIndex = this.selctionExpand.end[varIndex] + 1;
        endIndex   = this.brushFillInfo.end[varIndex];
      }

      const startFixedIndex = this.selctionExpand.start[fiexdIndex];
      const endFixedIndex   = Math.min(this.selctionExpand.end[fiexdIndex], fiexdIndex == 'rowIndex' ? this.rowCount : this.columnCount);

      //需要填充的区划
      const fillArea = {
        start: {
          [fiexdIndex]: startFixedIndex,
          [varIndex]: startIndex,
        },
        end: {
          [fiexdIndex]: endFixedIndex,
          [varIndex]: endIndex,
        },
      };

      const _fillArea = _.$getAreaPole(fillArea);

      this.recordChange('copy', {
        sArea: this.selctionExpand,
        tArea: _fillArea,
      });

      let rows = this.getAreaCells(this.selctionExpand);
      if (this.brushFillInfo.dir == 'up') {
        rows = _.reverse(rows);
      } else if (this.brushFillInfo.dir == 'left') {
        rows = _.map(rows, row => {
          return _.reverse(row);
        });
      }

      const datas = _.map(getSequences(rows, this.brushFillInfo.dir), seq => {
        return _.map(seq, s => {
          if (isOnlyValueCell(s)) {
            return s;
          }
          if (s && !s.f) {
            return s.v;
          }
        });
      });

      const diffs = getDiffs(datas);

      //复制单元格
      this.fillAreaCells(_.$areaTransform(this.selctionExpand, this.brushFillInfo.dir), rows, fillArea, (sCell, option) => {

        function isComputed() {
          if (isNullCell(sCell)) {
            return;
          } else if (isOnlyValueCell(sCell)) {
            if (!_.isFinite(+sCell)) return;
          } else if (!_.isEmpty(sCell.f) || !_.isFinite(+_.get(sCell, 'v'))) {
            return;
          }
          return true;
        }

        let t = _.cloneDeep(sCell);

        if (isComputed()) {
          let dIndex = option.rowNum;

          if (this.brushFillInfo.dir == 'down' || this.brushFillInfo.dir == 'up') {
            dIndex = option.columnNum;
          }

          const dif = diffs[dIndex];
          const v   = (dif.last = dif.last + dif.diff);

          if (isOnlyValueCell(sCell)) {
            t = v;
          } else {
            t.v = v;
          }
        }
        return t;
      });


      this.copyToAreaMerges(this.selctionExpand, _fillArea);

      this.selection     = this.brushFillInfo;
      this.brushFillInfo = null;
      this.stopAction();
    },
  },
};

function getSequences(rows, dir) {
  let seqs;
  switch (dir) {
    case 'up':
    case 'down':
      seqs = _.zip(...rows);
      break;
    case 'left':
    case 'right':
      seqs = rows;
      break;
  }
  return seqs;
}

function getDiffs(sequences) {
  return _.map(sequences, sequence => {
    return getDiff(_.filter(sequence, v => {
      return _.isFinite(+v);
    }));
  });
}

function getDiff(arr) {
  const diff = arr.length == 1 ? 0 : (_.last(arr) - _.first(arr)) / (arr.length - 1);
  return {
    diff,
    last: +_.last(arr),
  };
}
