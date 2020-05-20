<template>
  <div :class="className" :style="styles"
       @mousemove="isCanResize"
       @mousedown="handlerMousedown"
       @contextmenu.prevent="showMenu">
    <div :class="[`meg-chn-${direction}-no`]">{{indexString}}</div>
  </div>
</template>

<script>
  import _ from 'lodash';

  export default {
    name: 'HeadCell',
    inject: ['$sheet'],
    props: ['index', 'direction', 'isSelected'],
    data() {
      return {
        canResize: false,
        resizeIndex: -1,
      };
    },
    computed: {
      size() {
        return this.direction === 'column' ? this.$sheet.getColumnWidth(this.index) : this.$sheet.getRowHeight(this.index);
      },
      styles() {
        const style = {};
        if (this.direction === 'column') {
          style.width = `${ this.size - 1 }px`;
        } else {
          style.height = `${ this.size - 1 }px`;
        }

        if (this.canResize) {
          style.cursor = this.direction === 'column' ? 'col-resize' : 'row-resize';
        }

        return style;
      },
      indexString() {
        if (this.direction === 'column') {
          return _.$Number2ABC(this.index);
        }
        return this.index + 1;
      },
      className() {
        const cls = ['meg-head-index'];
        if (this.isSelected) {
          cls.push('meg-head-index-sel');
        }
        return cls;
      },
    },
    methods: {
      isCanResize: _.throttle(function (e) {
        const offset = this.direction === 'column' ? e.offsetX : e.offsetY;
        const deviation = this.direction === 'column' ? 10 : 6;
        if (offset < deviation) {
          if (this.index == 0) return;
          this.resizeIndex = this.index - 1;
          this.canResize = true;
        } else if (offset > ( this.size - deviation )) {
          this.resizeIndex = this.index;
          this.canResize = true;
        } else {
          this.canResize = false;
          this.resizeIndex = -1;
        }
      }, 20),
      handlerMousedown(e) {
        //调整大小
        if (this.canResize) {
          this.$sheet.s_resizeRowOrColumnStart(this.direction, this.resizeIndex);
        } else {//选中整行整列
          if (e.button == 2) {
            const { start, end } = this.$sheet.selection;
            if (this.$sheet.isSelectRow && this.direction == 'row') {
              if (this.index >= start.rowIndex && this.index <= end.rowIndex) {
                return;
              }
            }
            if (this.$sheet.isSelectColumn && this.direction == 'column') {
              if (this.index >= start.columnIndex && this.index <= end.columnIndex) {
                return;
              }
            }
          }
          const pos = { [`${ this.direction }Index`]: this.index };

          const _index = this.$sheet.getFirstNMergeIndex(this.direction, this.index);

          if (this.direction == 'row') {
            pos.columnIndex = _index;
          } else {
            pos.rowIndex = _index;
          }

          this.$sheet.s_selectedRowOrColumnStart(e, this.direction, pos);
        }
      },
      showMenu(e) {
        this.$sheet.showHeadMenu(this.direction, e.pageY, e.pageX);
      },
    },
  };
</script>

<style lang="scss">
  @import "../../style/_variables.scss";

  .meg-head-index {
    height: inherit;
    position: relative;
    overflow: hidden;
    text-align: center;
    width: 100%;
    height: 100%;
    cursor: pointer;

    &.meg-head-index-sel {
      color: #217346;
      font-weight: bold;
      border-color: #bfbfbf;
      background-color: #e1e1e1;
    }

    &:hover {
      background: $hover-bgcolor;
    }

    .meg-chn-row-no {
      width: 100%;
      text-align: center;
      height: 100%;
      overflow: hidden;
    }

    .meg-chn-column-no {
      height: 100%;
    }
  }
</style>
