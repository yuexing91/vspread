<template>
  <div
    class="meg-gridcell"
    @mousedown.left="mouseDown"
    @contextmenu.prevent="showMenu"
    @dblclick="doEdit"
    :style="cell.style.css">
    <div class="meg-cellval" :class="[cell.style.alignCss]">
      {{ formatValue(cell) }}
    </div>
  </div>
</template>

<script>
  import { getCellValue } from '../sheet/mixins/cell/cellUtil';

  export default {
    inject: ['$sheet'],
    props: {
      cell: Object,
    },
    methods: {
      mouseDown(event) {
        const pos = {
          columnIndex: this.cell.columnIndex,
          rowIndex: this.cell.rowIndex,
        };
        this.$sheet.s_cellSelectStart(event, pos);
      },
      showMenu(e) {
        this.$sheet.showCellMenu({
          columnIndex: this.cell.columnIndex,
          rowIndex: this.cell.rowIndex,
        }, e.pageY, e.pageX);
      },
      doEdit() {
        this.$sheet.doEditCell();
      },
      formatValue(cell) {
        const v = getCellValue(cell.option);
        return v;
      },
    },
  };
</script>

<style lang="scss">
  .meg-gridcell {
    position: absolute;
    height: inherit;
    overflow: hidden;
    font-size: 11pt;
    z-index: 1;
  }

  .meg-cellval-warp {
    position: relative;
    height: inherit;
    width: inherit;
  }

  .meg-cellval-vat {
    position: absolute;
    top: 0px;
  }

  .meg-cellval-vab {
    position: absolute;
    bottom: 0px;
  }

  .meg-cellval-vam {
    position: absolute;
    top: 50%;
    transform: translateY(-51%);
  }

  //自动换行
  .meg-cellval-lnor {
    width: inherit;
    max-height: 100%;
    text-align: left;
    white-space: normal;
    word-wrap: break-word;
    padding-left: 2px;
  }

  .meg-cellval-cnor {
    width: inherit;
    max-height: 100%;
    text-align: center;
    white-space: normal;
    word-wrap: break-word;
  }

  .meg-cellval-rnor {
    width: inherit;
    max-height: 100%;
    text-align: right;
    white-space: normal;
    word-wrap: break-word;
    right: 2px;
  }

  //不换行
  .meg-cellval-lnow {
    width: inherit;
    max-height: 100%;
    text-align: left;
    white-space: nowrap;
    padding-left: 2px;
  }

  .meg-cellval-cnow {
    width: inherit;
    text-align: center;
    white-space: nowrap;
  }

  .meg-cellval-rnow {
    width: inherit;
    text-align: right;
    white-space: nowrap;
    right: 2px;
  }
</style>
