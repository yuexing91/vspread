import _ from 'lodash';

import { STYLE_CONFIG } from '../../../config/constant';
import { castObjectCell } from './cell/cellUtil';
import Style from './style/Style';

export default {
  mounted(){
    //监听格式刷事件
    this.$on('select-over', this.applyFormatPainter);
  },
  methods: {
    //格式刷
    applyFormatPainter(){
      if (this.curAction === 'formatpainter') {

        this.recordChange('copy', {
          sArea: this.selectionCopy,
          tArea: this.selctionExpand,
        });

        this.fillAreaCells(this.selectionCopy, this.getAreaCells(this.selectionCopy), this.selctionExpand, (sCell, option) => {
          let tCell = this.getPosCell(option);
          const s   = _.get(sCell, 's');
          if (s) {
            tCell   = castObjectCell(tCell);
            tCell.s = s;
          }
          return tCell;
        });

        this.copyToAreaMerges(this.selectionCopy, this.selctionExpand);
        this.stopAction();
      }
    },
    getCellStylesCount(){
      const styleCount = {};
      _.each(this.cells, row => {
        _.each(row, cell => {
          if (cell && cell.s) {
            styleCount[cell.s] = (styleCount[cell.s] || 0) + 1;
          }
        });
      });
      return styleCount;
    },

    getRCStylesCount(){
      const styleCount = {};
      _.each(this.rows, row => {
        if (row && row.s) {
          styleCount[row.s] = (styleCount[row.s] || 0) + 1;
        }
      });
      _.each(this.columns, column => {
        if (column && column.s) {
          styleCount[column.s] = (styleCount[column.s] || 0) + 1;
        }
      });
      return styleCount;
    },

    setAreaStyle(area, iteratee){
      let addCell = false;

      this.stopAction();
      this.openComboRecord();

      if (this.isSelectRow && this.isSelectColumn) {
        this.s_setSheetStyle(area, iteratee);
      }
      else if (this.isSelectColumn) {
        this.s_setColumnsStyle(area, iteratee);
      }
      else if (this.isSelectRow) {
        this.s_setRowsStyle(area, iteratee);
      }
      else {
        addCell = true;
      }

      this.s_setCellsStyle(area, addCell, iteratee);

      this.closeComboRecord();
    },
    s_setSheetStyle(area, iteratee){

    },
    s_setColumnsStyle(area, iteratee){
      this.recordChange('RCStyleChange', {
        area,
        type: 'column',
      });

      const stylesCount = this.getRCStylesCount();

      const columnInfos = _.$mapRange(area.start.columnIndex, area.end.columnIndex, index => {
        return _.$getArrayItem(this.columns, index, { s: undefined });
      });

      const groupStyle = _.groupBy(columnInfos, 's');

      this.s_setStyle(groupStyle, stylesCount, 'RCStyles', iteratee, (column, style) => {
        this.$set(column, 's', style.id);
      });
    },
    s_setRowsStyle(area, iteratee){
      this.recordChange('RCStyleChange', {
        area,
        type: 'row',
      });
      const stylesCount = this.getRCStylesCount();

      const rowInfos = _.$mapRange(area.start.rowIndex, area.end.rowIndex, index => {
        return _.$getArrayItem(this.rows, index, { s: undefined });
      });

      const groupStyle = _.groupBy(rowInfos, 's');

      this.s_setStyle(groupStyle, stylesCount, 'RCStyles', iteratee, (row, style) => {
        this.$set(row, 's', style.id);
      });
    },
    s_setCellsStyle(area, addCell, iteratee){
      this.recordChange('styleChange', {
        area,
      });

      if (addCell) {
        this.c_addCells(area);
      }

      const stylesCount = this.getCellStylesCount();

      let cells = this.getAreaExistCells(area);

      if (!addCell) {
        cells = _.filter(cells, cell => cell.options.s);
      }

      const groupStyle = _.chain(cells).map(cell => {
        if (cell && cell.options) {
          Object.assign(cell, { s: cell.options.s });
        }
        return cell;
      }).groupBy('s').value();

      this.s_setStyle(groupStyle, stylesCount, 'styles', iteratee, (cell, style) => {
        this.setCellAttribute(cell.pos, cell.options, 's', style.id);
      });
    },

    s_setStyle(groupStyle, stylesCount, type, iteratee, setIteratee){
      _.each(groupStyle, (cells, sid) => {
        let oldStyle = this.getStyle(sid, type);
        let style;
        if (oldStyle) {
          if (stylesCount[sid] == cells.length) {
            iteratee(oldStyle);
            return;
          }
          style = oldStyle.clone();
          iteratee(style);
          if (style.equals(oldStyle)) {
            return;
          }
        } else {
          style = new Style(STYLE_CONFIG.styleOptions());
          iteratee(style);
        }
        style = this.addStyle(style, type);
        _.each(cells, cell => {
          setIteratee(cell, style);
        });
      });
    },

    getRowStyle(index){
      return this.getStyle(_.get(this.rows[index], 's'), 'RCStyles');
    },

    getColumnStyle(index){
      return this.getStyle(_.get(this.columns[index], 's'), 'RCStyles');
    },

    getStyle(sid, type){
      type = type || 'styles';
      return this[type][sid];
    },
    getUseStyle(sid, type){
      return this.getStyle(sid, type) || Style.getDefault();
    },
    addStyle(style, type){
      type    = type || 'styles';
      const t = this.findStyle(style, type);
      if (!t) {
        this.$set(this[type], style.id, style);
      }
      return t || style;
    },
    findStyle(style, type){
      type = type || 'styles';
      return _.find(this[type], s => {
        return s.equals(style);
      });
    },
    mixinStyles(s, rowIndex, columnIndex){
      let rs = _.filter(_.uniq([_.get(this.rows[rowIndex], 's'), _.get(this.columns[columnIndex], 's')]));

      if (_.isEmpty(rs)) {
        return s;
      }

      rs = _.map(rs, r => {
        return this.getStyle(r, 'RCStyles');
      });

      if (s) {
        rs.unshift(this.getStyle(s));
      }

      const newStyle = new Style(_.defaults({}, ..._.map(rs, 'option')));

      const style = this.findStyle(newStyle);
      if (style) {
        return style.id;
      }
      this.addStyle(newStyle);

      return newStyle.id;
    },
  },
};

