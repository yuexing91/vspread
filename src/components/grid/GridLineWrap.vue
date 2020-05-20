<template>
  <div :class="['meg-gdlinewrap',`meg-gdlinewrap-${direction}`]">
    <div
      class="meg-gdline"
      v-for="line in getLines()"
      :style="getStyle(line)"
      :key="line"/>
  </div>
</template>

<script>
  import _ from 'lodash';

  export default {
    name: 'GridLineWrap',
    inject: ['$sheet', '$grid'],
    props: {
      direction: String,
      startIndex: Number,
      endIndex: Number,
    },
    methods: {
      getLines() {
        return _.filter(_.range(this.startIndex, this.endIndex), this.isShow);
      },
      isShow(line) {
        return !_.get(this.$sheet[`${ this.direction }s`][line], 'h');
      },
      getStyle(line) {
        const index = line - this.startIndex;
        if (this.direction == 'column') {
          const width = this.$grid.widths[index];
          return {
            width: `${ width - 1 }px`,
            height: '100%',
          };
        } else {
          const height = this.$grid.heights[index];
          return {
            width: `100%`,
            height: `${ height - 1 }px`,
          };
        }
      },
    },
    updated() {
      this.$sheet.reszieLayoutInfo();
    },
  };
</script>

<style lang="scss">
  @import "../../style/style.scss";

  .meg-gdlinewrap {
    position: absolute;
    height: 100%;
    width: 100%;
    display: flex;
  }

  .meg-gdlinewrap-column {
    .meg-gdline {
      border-right: 1px solid $border-color;
    }
  }

  .meg-gdlinewrap-row {
    flex-direction: column;

    .meg-gdline {
      border-bottom: 1px solid $border-color;
    }
  }
</style>
