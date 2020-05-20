<template>
  <div class="meg-sheetselection" :style="styles">
    <div v-for="style in resizeLineStyle" :class="resizeClass" :style="style"></div>
  </div>
</template>
<script>
  export default{
    inject: ['$sheet'],
    computed: {
      info(){
        return this.$sheet.selectionInfo;
      },
      styles(){
        return {
          width: `${this.info.width - 1}px`,
          height: `${this.info.height - 1}px`,
          top: `${this.info.top - 2}px`,
          left: `${this.info.left - 2}px`,
        }
      },
    }
  }
</script>
<style lang="scss">
  .meg-sheetselection {
    position: absolute;
    border: 2px solid #217346;
    pointer-events: none;
  }

  .meg-selhandle{
    position: absolute;
    width: 4px;
    height: 4px;
    right: -4px;
    bottom: -4px;
    cursor: crosshair;
    background-color: #217346;
    border: solid 1px #fff;
    z-index: 16;
    pointer-events: auto;
  }

  .meg-selmask {
    position: absolute;
    pointer-events: none;
    background-color: #141414;
    opacity: .24;
    width: 100%;
  }
</style>
