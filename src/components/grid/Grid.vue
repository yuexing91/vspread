<template>
  <div class="meg-datagrid">
    <grid-line-wrap direction="row" :startIndex="startRowIndex" :endIndex="endRowIndex"/>
    <grid-line-wrap direction="column" :startIndex="startColumnIndex" :endIndex="endColumnIndex"/>
    <grid-rows v-if="renderRows"
               :startRowIndex="startRowIndex"
               :endRowIndex="endRowIndex"
               :startColumnIndex="startColumnIndex"
               :endColumnIndex="endColumnIndex"/>
  </div>
</template>

<script>
  import _ from 'lodash';
  import GridLineWrap from './GridLineWrap.vue';
  import GridRows from './GridRows.vue';

  export default {
    name: 'Grid',
    inject: ['$sheet'],
    provide() {
      return {
        $grid: this,
      };
    },
    props: {
      startRowIndex: Number,
      endRowIndex: Number,
      startColumnIndex: Number,
      endColumnIndex: Number,
    },
    data() {
      return {
        renderRows: false,
      };
    },
    computed: {
      widths() {
        return _.map(_.range(this.startColumnIndex, this.endColumnIndex), index => {
          return this.$sheet.getColumnWidth(index);
        });
      },
      lefts() {
        let sum = 0;
        return _.map(this.widths, width => {
          const left = sum;
          sum += width;
          return left;
        });
      },
      heights() {
        return _.map(_.range(this.startRowIndex, this.endRowIndex), index => {
          return this.$sheet.getRowHeight(index);
        });
      },
      tops() {
        let sum = 0;
        return _.map(this.heights, width => {
          const left = sum;
          sum += width;
          return left;
        });
      },
    },
    components: {
      GridLineWrap,
      GridRows,
    },
    beforeCreate() {
      this._tid = setTimeout(() => {
        this.renderRows = true;
      }, 10);
    },
    beforeDestroy() {
      clearTimeout(this._tid);
    },
  };
</script>

<style lang="scss">
  @import "../../style/style";

  .meg-datagrid {
    position: relative;
    overflow: hidden;
    background-color: $global-bgcolor;
    @include flex-fixed
  }
</style>
