<template>
  <div>
    <div class="meg-sheetselection" :style="styles">
      <div class="meg-selhandle" :style="brushFillStyle" @mousedown.left="brushFill"></div>
    </div>
    <div class="meg-selmask"
         v-for="(style,index) in maskStyles"
         :name="index"
         :style="style" :key="index"/>
  </div>

</template>
<script>

  import { getAreaCutLeftOrTope } from '../../helpers';

  export default{
    inject: ['$sheet'],
    computed: {
      selctionExpand(){
        return this.$sheet.selctionExpand
      },
      selection(){
        return this.$sheet.selection;
      },
      brushFillStyle(){
        if (this.$sheet.isSelectRow) {
          return {
            left: '-1px',
            right: 'none',
          }
        }
        if (this.$sheet.isSelectColumn) {
          return {
            top: '-1px',
            bottom: 'none',
          }
        }
      },
      styles(){
        const { width, height, top, left } = this.$sheet.getAreaLayoutPos(this.selctionExpand, this.$sheet.selectionInfo)

        return {
          width: `${Math.max(width - 1, 0)}px`,
          height: `${Math.max(height - 1, 0)}px`,
          top: `${top - 2}px`,
          left: `${left - 2}px`,
        }
      },

      maskStyles(){

        let curArea = {
          start: this.selection.start,
          end: this.selection.start
        }

        if (!this.$sheet.isSelectColumn && !this.$sheet.isSelectRow) {
          const merge = this.$sheet.getMerge(this.selection.start)
          if (merge) {
            curArea = merge;
          }
        }

        const areas = {};

        const topArea = {
          start: this.selctionExpand.start,
          end: {
            rowIndex: curArea.start.rowIndex - 1,
            columnIndex: this.selctionExpand.end.columnIndex
          }
        }
        if (topArea.end.rowIndex >= topArea.start.rowIndex) {
          areas.top = topArea;
        }

        const bottomArea = {
          start: {
            rowIndex: curArea.end.rowIndex + 1,
            columnIndex: this.selctionExpand.start.columnIndex
          },
          end: this.selctionExpand.end
        }

        if (bottomArea.end.rowIndex >= bottomArea.start.rowIndex) {
          areas.bottom = bottomArea;
        }

        const leftArea = {
          start: {
            rowIndex: curArea.start.rowIndex,
            columnIndex: this.selctionExpand.start.columnIndex
          },
          end: {
            rowIndex: curArea.end.rowIndex,
            columnIndex: curArea.start.columnIndex - 1
          }
        }

        if (leftArea.end.columnIndex >= leftArea.start.columnIndex) {
          areas.left = leftArea;
        }

        const rigthArea = {
          start: {
            rowIndex: curArea.start.rowIndex,
            columnIndex: curArea.end.columnIndex + 1
          },
          end: {
            rowIndex: curArea.end.rowIndex,
            columnIndex: this.selctionExpand.end.columnIndex
          }
        }

        if (rigthArea.end.columnIndex >= rigthArea.start.columnIndex) {
          areas.right = rigthArea;
        }

        return _.mapValues(areas, area => {
          return _.mapValues(this.$sheet.getAreaLayoutPos(area), v => v + 'px')
        });

      },


    },
    methods: {
      brushFill(e){
        this.$sheet.openBrushFill(e);
      }
    }
  }
</script>
<style lang="scss">
  .meg-sheetselection {
    position: absolute;
    border: 2px solid #217346;
    pointer-events: none;
    z-index: 2;
  }

  .meg-selhandle {
    position: absolute;
    width: 4px;
    height: 4px;
    right: -4px;
    bottom: -4px;
    background-color: #217346;
    border: solid 1px #fff;
    z-index: 16;
    pointer-events: auto;
    cursor: crosshair;
  }

  .meg-selmask {
    position: absolute;
    pointer-events: none;
    background-color: #141414;
    opacity: .24;
    z-index: 2;
  }
</style>
