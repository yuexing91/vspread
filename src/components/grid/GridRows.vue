<template>
  <div class="meg-gridrows">
    <Gird-Row v-for="(row,index) in rows"
              v-show="isShow(index)"
              :row="row"
              :startColumnIndex="startColumnIndex"
              :endColumnIndex="endColumnIndex"
              :key="row.rowIndex"
              :style="getStyle(index)"/>
  </div>
</template>

<script>
  import GirdRow from './GridRow.vue';

  export default {
    name: 'GridRows',
    inject: ['$sheet', '$grid'],
    props: {
      startRowIndex: Number,
      endRowIndex: Number,
      startColumnIndex: Number,
      endColumnIndex: Number,
    },
    components: {
      GirdRow,
    },
    data() {
      return {
      };
    },
    created() {
      //不需要双向绑定，提高性能
      this.columnIndexs = _.range(this.startColumnIndex, this.endColumnIndex);
//      this.updateRows();
    },

    computed: {
      area() {
        return {
          start: {
            rowIndex: this.startRowIndex,
            columnIndex: this.startColumnIndex,
          },
          end: {
            rowIndex: this.endRowIndex,
            columnIndex: this.endColumnIndex,
          },
        };
      },
      gridRowsChange() {
        return this.$sheet.gridRowsChange;
      },
      columnStyles() {
        return _.map(this.columnIndexs, this.$sheet.getColumnStyle);
      },
      columnInfos() {
        return this.$sheet.getColumnInfos(this.startColumnIndex, this.endColumnIndex - 1);
      },
      rows(){
        return this.$sheet.getGridRows(this.area)
      }
    },

    watch: {
//      gridRowsChange() {
//        if (this.gridRowsChange) {
//          this.updateRows(); // this.getRows()
//        }
//      },
//      endRowIndex: {
//        handler() {
//          this.updateRows();
//        },
//      },
//      area: {
//        handler() {
//          this.updateRows();
//        },
//      },
    },

    methods: {

//      updateRows() {
//        this.rows = this.$sheet.getGridRows(this.area);
//      },

      isShow(index) {
        return !_.get(this.$sheet.getRowInfos(index + this.startRowIndex), 'h');
      },

      getHeight(index) {
        return this.$grid.heights[index];
      },

      getTop(index) {
        return this.$grid.tops[index];
      },

      getStyle(index) {
        return {
          top: `${ this.getTop(index) }px`,
          height: `${ this.getHeight(index) - 1 }px`,
        };
      },
    },
  };
</script>

<style lang="scss">
  @import "../../style/style";

  .meg-gridrows {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    @include flex-fixed;
  }
</style>
