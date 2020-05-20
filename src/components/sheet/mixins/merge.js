function getMergeKey(pos) {
  return `${pos.rowIndex}_${pos.columnIndex}`;
}

export default {

  methods: {
    m_refreshMerge(){
      const ms = {};
      _.each(this.merges, merge => {
        if (merge && !merge._del) {
          ms[getMergeKey(merge.start)] = merge;
        }
      });
      this.merges = ms;
    },

    getMerge(pos){
      return this.merges[getMergeKey(pos)];
    },

    getMergeKey(merge){
      return getMergeKey(merge.start);
    },


    isMerge(area){
      const merge = this.getMerge(area.start);
      return _.isEqual(area, merge);
    },

    /***
     * 获取所在pos的合并区域范围
     */
    getPosOwnerMerge(pos){
      return _.find(this.merges, merge => {
        if (merge) {
          return _.$inArea(merge, pos);
        }
      });
    },

    //合并单元格
    mergeCell(mergeInfo){
      if (_.isEqual(mergeInfo.start, mergeInfo.end)) {
        return;
      }
      this.recordChange('mergeCell', mergeInfo);
      this.c_addCell(mergeInfo.start.rowIndex, mergeInfo.start.columnIndex);
      this.c_setLastNum(mergeInfo.end.rowIndex, mergeInfo.end.columnIndex);
      this.setAreaMergers(mergeInfo, { [getMergeKey(mergeInfo.start)]: mergeInfo });
    },

    //取消合并
    unMergeCell(mergeInfo){
      if (this.isMerge(mergeInfo)) {
        this.recordChange('mergeCell', mergeInfo);
        this.removeAreaMerges(mergeInfo);
      }
    },

    // 获取一个区域内的合并区域
    getAreaMerges(area){
      const merges = {};

      _.each(this.merges, (merge, key) => {
        if (merge && _.$inArea(area, merge.start)) {
          merges[key] = merge;
        }
      });
      return merges;
    },
    // 设置一个区域内的单元格合并
    setAreaMergers(area, nMerges){
      const tMerges = this.getAreaMerges(area);
      const t       = Object.assign(_.mapValues(tMerges, m => undefined), nMerges);

      _.each(nMerges, mergeInfo => {
        this.clearAreaCells(mergeInfo, true);
      });

      this.merges = Object.assign({}, this.merges, t);
    },
    // 删除area合并规则
    removeAreaMerges(area){
      const merges = this.getAreaMerges(area);
      _.map(merges, (m, k) => {
        this.$delete(this.merges, k);
      });
    },
    // 复制一个sArea的合并规则到tArea
    copyToAreaMerges(sArea, tArea){
      const merges = this.getAreaMerges(sArea);

      if (_.isEmpty(merges)) return;

      const rowLen    = sArea.end.rowIndex - sArea.start.rowIndex + 1;
      const columnLen = sArea.end.columnIndex - sArea.start.columnIndex + 1;

      for(let i = tArea.start.rowIndex; i <= tArea.end.rowIndex; i = i + rowLen) {

        for(let j = tArea.start.columnIndex; j <= tArea.end.columnIndex; j = j + columnLen) {
          const _tArea = {
            start: {
              rowIndex: i,
              columnIndex: j,
            },
            end: {
              rowIndex: i + rowLen - 1,
              columnIndex: j + columnLen - 1,
            },
          };

          const rowDistance    = _tArea.start.rowIndex - sArea.start.rowIndex;
          const columnDistance = _tArea.start.columnIndex - sArea.start.columnIndex;

          // 新的合并规则
          const nMerges = {};
          _.each(merges, merge => {
            const start = Object.assign({}, merge.start);
            const end   = Object.assign({}, merge.end);

            start.rowIndex += rowDistance;
            end.rowIndex += rowDistance;
            start.columnIndex += columnDistance;
            end.columnIndex += columnDistance;
            if (end.rowIndex > tArea.end.rowIndex || end.columnIndex > tArea.end.columnIndex) {

            } else {
              nMerges[getMergeKey(start)] = { start, end };
            }
          });
          this.setAreaMergers(_tArea, nMerges);
        }
      }
    },
    // 获取第一个非合并单元格序号
    getFirstNMergeIndex(direction, index){
      const last  = direction == 'row' ? this.columnCount : this.rowCount;
      const other = direction == 'row' ? 'column' : 'row';

      const start = {
        [`${direction}Index`]: index,
        [`${other}Index`]: 0,
      };

      const area = {
        start,
        end: Object.assign({}, start, {
          [`${other}Index`]: last,
        }),
      };

      const merges = _.filter(this.merges, merge => merge && _.$isCollision(area, merge));

      for(let i = 0; i <= last + 1; i++) {
        start[`${other}Index`] = i;
        const m                = _.find(merges, merge => {
          return _.$inArea(merge, start);
        });
        if (m) {
          continue;
        } else {
          return i;
        }
      }

      return last;
    },

  },
};

