<template>
  <div class="meg-selection-highlight" :style="styles">
    <div class="anis-border anis-border-v anis-v1"></div>
    <div class="anis-border anis-border-v anis-v2"></div>
    <div class="anis-border anis-border-h anis-h1"></div>
    <div class="anis-border anis-border-h anis-h2"></div>
  </div>
</template>
<script>
  import { getAreaCutLeftOrTope } from '../../helpers';

  export default{
    inject: ['$sheet'],
    computed: {
      info(){
        if (this.$sheet.curAction === 'copy' || this.$sheet.curAction === 'cut' || this.$sheet.curAction === 'formatpainter') {
          if (!this.$sheet.selectionCopy) {
            return;
          }
          return this.$sheet.s_getSelectionRect(this.$sheet.selectionCopy)
        }
      },
      styles(){
        if (!this.info) {
          return;
        }

        const h = getAreaCutLeftOrTope(this.$sheet.selectionCopy,
          this.info.top,
          this.info.height,
          this.$sheet.fixedHeight, this.$sheet.fixedRowIndex,
          this.$sheet.scrollTop, 'rowIndex')

        const w = getAreaCutLeftOrTope(this.$sheet.selectionCopy,
          this.info.left,
          this.info.width,
          this.$sheet.fixedWidth, this.$sheet.fixedColumnIndex,
          this.$sheet.scrollLeft, 'columnIndex')

        return {
          width: `${w.width + 1}px`,
          height: `${h.height + 2}px`,
          top: `${h.top - 3}px`,
          left: `${w.left - 3}px`,
        };
      },
    }
  }
</script>
<style lang="scss">
  @keyframes anis-v1 {
    from {
      top: -10px;
    }
    to {
      top: 0px;
    }
  }

  @keyframes anis-v2 {
    from {
      top: 0px;
    }
    to {
      top: -10px;
    }
  }

  @keyframes anis-h1 {
    from {
      left: 0px;
    }
    to {
      left: -10px;
    }
  }

  @keyframes anis-h2 {
    from {
      left: -10px;
    }
    to {
      left: 0px;
    }
  }

  .meg-selection-highlight {
    position: absolute;
    border: none;
    pointer-events: none;
    margin: 2px;
    z-index: 3;
    overflow: hidden;
  }

  .anis-border {
    position: absolute;
    background-color: #217346;
    background-size: 10px 10px;
  }

  .anis-border-v {
    height: 150%;
    width: 2px;
    background-image: linear-gradient(#fff 30%, transparent 50%, transparent);
    animation: anis-v 0.3s infinite linear;
  }

  .anis-border-h {
    width: 150%;
    height: 2px;
    background-image: linear-gradient(90deg, #fff 30%, transparent 50%, transparent);
    animation: anis-h 0.3s infinite linear;
  }

  .anis-v1 {
    animation-name: anis-v1;
    left: 0px;
  }

  .anis-v2 {
    animation-name: anis-v2;
    right: 0px;
  }

  .anis-h1 {
    animation-name: anis-h1;
    top: 0px;
  }

  .anis-h2 {
    animation-name: anis-h2;
    bottom: 0px;
  }
</style>
