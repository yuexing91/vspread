<template>
  <div class="meg-brush-fill" :style="styles" v-show="info">
  </div>
</template>
<script>
  export default{
    inject: ['$sheet'],

    computed: {
      info(){
        if (this.$sheet.curAction === 'brushFill') {
          if (!this.$sheet.brushFillInfo) {
            return;
          }
          return this.$sheet.getAreaLayoutPos(this.$sheet.brushFillInfo)
        }
      },
      styles(){
        if (!this.info) {
          return;
        }
        return {
          width: `${this.info.width - 3}px`,
          height: `${this.info.height - 3}px`,
          top: `${this.info.top - 4}px`,
          left: `${this.info.left - 4}px`,
        }
      },
    }
  }
</script>
<style lang="scss">

  .meg-brush-fill {
    position: absolute;
    border: none;
    pointer-events: none;
    margin: 2px;
    z-index: 3;
    overflow: hidden;
    border: 3px solid #217346;
  }

</style>
