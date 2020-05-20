<template>
  <div :class="className">

    <div
      v-for="cell in getCells()"
      class="meg-head-index"
      :style="getCellStyles(cell)"
      @mousemove="isCanResize($event,cell)"
      @mousedown="handlerMousedown($event,cell)"
      @contextmenu.prevent="showMenu($event,cell)">
      <div :class="[`meg-chn-${direction}-no`]">{{indexString(cell)}}</div>
    </div>


    <!--<Cell v-for="cell in getCells()"
          :direction="direction"
          :index="cell"
          :isSelected="isSelected(cell)"
          :key="cell"/>-->
  </div>
</template>

<script>
  import _ from 'lodash';
  import Cell from './HeadCell.vue';

  export default {
    name: 'HeadFlow',
    inject: ['$sheet'],
    props: ['direction', 'flow'],
    created() {
      //不需要响应式的数据 提高性能
      this.className = `meg-${ this.direction }head-container-br`;
    },
    data() {
      return {
        canResize: false,
        resizeIndex: -1,
//        selectedRange: this.direction == 'column' ? this.$sheet.selectedColumnRange : this.$sheet.selectedRowRange
      };
    },
    components: {
      Cell,
    },
    computed: {
      cells() {
        return _.range(this.flow.start, this.flow.end);
      },
    },

    methods: {
      getCells() {
        return _.filter(this.cells, this.isShow);
      },
      isShow(line) {
        return !_.get(this.$sheet[`${ this.direction }s`][line], 'h');
      },
      indexString(index) {
        if (this.direction === 'column') {
          return _.$Number2ABC(index);
        }
        return index + 1;
      },
      getCellSize(index) {
        return this.direction === 'column' ? this.$sheet.getColumnWidth(index) : this.$sheet.getRowHeight(index);
      },
      getCellStyles(index) {
        const style = {};
        if (this.direction === 'column') {
          style.width = `${ this.getCellSize(index) - 1 }px`;
        } else {
          style.height = `${ this.getCellSize(index) - 1 }px`;
        }

        if (this.canResize) {
          style.cursor = this.direction === 'column' ? 'col-resize' : 'row-resize';
        }

        return style;
      },

      isCanResize: _.throttle(function (e, index) {
        const offset = this.direction === 'column' ? e.offsetX : e.offsetY;
        const deviation = this.direction === 'column' ? 10 : 6;
        if (offset < deviation) {
          if (index == 0) return;
          this.resizeIndex = index - 1;
          this.canResize = true;
        } else if (offset > ( this.getCellSize(index) - deviation )) {
          this.resizeIndex = index;
          this.canResize = true;
        } else {
          this.canResize = false;
          this.resizeIndex = -1;
        }
      }, 20),

      handlerMousedown(e, index) {
        //调整大小
        if (this.canResize) {
          this.$sheet.s_resizeRowOrColumnStart(this.direction, this.resizeIndex);
        } else {//选中整行整列
          if (e.button == 2) {
            const { start, end } = this.$sheet.selection;
            if (this.$sheet.isSelectRow && this.direction == 'row') {
              if (index >= start.rowIndex && index <= end.rowIndex) {
                return;
              }
            }
            if (this.$sheet.isSelectColumn && this.direction == 'column') {
              if (index >= start.columnIndex && index <= end.columnIndex) {
                return;
              }
            }
          }
          const pos = { [`${ this.direction }Index`]: index };

          const _index = this.$sheet.getFirstNMergeIndex(this.direction, index);

          if (this.direction == 'row') {
            this.$sheet.isSelectRow = true;
            pos.columnIndex = _index;
          } else {
            this.$sheet.isSelectColumn = true;
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
  @import "../../style/style.scss";
  @import "../../style/_variables.scss";

  .meg-columnhead-container-br, .meg-rowhead-container-br {
    display: flex;
    color: $sub-font-color;
  }

  .meg-columnhead-container-br {
    height: 19px;
    border-bottom: 1px solid $border-color;
  }

  .meg-rowhead-container-br {
    flex-direction: column;
    border-right: 1px solid $border-color;
  }

  .meg-columnhead-container-br .meg-head-index {
    border-right: 1px solid $border-color;
  }

  .meg-rowhead-container-br .meg-head-index {
    border-bottom: 1px solid $border-color;
  }

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
