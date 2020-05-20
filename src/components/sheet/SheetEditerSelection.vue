<template>
  <div class="meg-selection-editer" :style="styles">

  </div>
</template>
<script>
  export default{
    inject: ['$sheet'],
    computed: {
      info(){
        if (this.$sheet.curAction === 'editer') {
          if (!this.$sheet.selectionEditer) {
            return;
          }
          const s = this.$sheet.s_computedExtendSelection(this.$sheet.selectionEditer)
          return this.$sheet.s_getSelectionRect(s);
        }
      },
      styles(){
        if (!this.info) {
          return;
        }
        return {
          width: `${this.info.width - 1 }px`,
          height: `${this.info.height - 1}px`,
          top: `${this.info.top - this.$sheet.scrollTop - 3}px`,
          left: `${this.info.left - this.$sheet.scrollLeft - 3}px`,
        };
      },
    }
  }
</script>
<style lang="scss">
  .meg-selection-editer {
    position: absolute;
    pointer-events: none;
    margin: 2px;
    z-index: 3;
    overflow: hidden;
    border: 1px solid #40a9ff;
    background: #bae7ff;
    opacity: 0.5;
    top:-10px;
  }
</style>
