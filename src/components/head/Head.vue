<template>
  <div :class="className">

    <Flow class="meg-head-fixed">
      <Head-Flow :direction="direction" :flow="fixedFlow"></Head-Flow>
    </Flow>

    <div class="meg-headhighlight" :style="highLightStyle"></div>

    <div class="meg-head-scroll">
      <div class="meg-headflows" :style="ts">
        <Flow-Clip :direction="_direction" :compen="compen">
          <Flow v-for="flow in flows" :key="flow.start">
            <Head-Flow
              :direction="direction"
              :flow="flow"></Head-Flow>
          </Flow>
        </Flow-Clip>
      </div>
    </div>
  </div>
</template>

<script>
  import { getAreaCutLeftOrTope } from '../../helpers';
  import HeadFlow from './HeadFlow.vue'
  import FlowClip from '../flow/FlowClip.vue'
  import Flow from '../flow/Flow.vue'

  export default {
    name: 'Head',
    inject: ['$sheet'],
    components: {
      FlowClip,
      Flow,
      HeadFlow,
    },
    props: {
      direction: String,
      compen: Number,
      fixed: Number,
      scroll: Number,
      flows: Array,
    },
    computed: {
      fixedFlow(){
        return {
          start: 0,
          end: this.fixed
        }
      },
      ts(){
        return {
          [this.direction == 'row' ? 'height' : 'width']: '500000px'
        }
      },
      selctionExpand(){
        return this.$sheet.selctionExpand;
      },
      selectionInfo(){
        return this.$sheet.selectionInfo;
      },
      className(){
        return [`meg-head-container`, `meg-head-container-${this.direction}`]
      },
      _direction(){
        return this.direction == 'row' ? 'column' : 'row';
      },
      highLightStyle(){
        if (this.direction == 'row') {
          const size = getAreaCutLeftOrTope(this.selctionExpand,
            this.selectionInfo.top,
            this.selectionInfo.height,
            this.$sheet.fixedHeight, this.fixed,
            this.$sheet.scrollTop, 'rowIndex')

          return {
            top: `${size.top}px`,
            height: `${Math.max(size.height - 1, 0)}px`,
          }
          
        } else {
          const size = getAreaCutLeftOrTope(this.selctionExpand,
            this.selectionInfo.left,
            this.selectionInfo.width,
            this.$sheet.fixedWidth, this.fixed,
            this.$sheet.scrollLeft, 'columnIndex')

          return {
            left: `${size.left}px`,
            width: `${Math.max(size.width - 1, 0)}px`,
          }
        }
      }
    },
    watch: {
      scroll(scroll){
        if (this.direction === 'row') {
          this.$el.querySelector('.meg-head-scroll').scrollTop = scroll;
        } else {
          this.$el.querySelector('.meg-head-scroll').scrollLeft = scroll;
        }
      }
    }
  }


</script>
<style lang="scss">
  .meg-head-container {
    height: 100%;
    width: 100%;
    font-family: "Microsoft Yahei UI", "Microsoft Yahei", SimSun, sans-serif;
    font-size: 10pt;
    position: relative;
    display: flex;
  }

  .meg-headhighlight {
    position: absolute;
    z-index: 11;
    border: 2px solid #217346;
  }

  .meg-head-fixed {
    flex: 0;
  }

  .meg-head-scroll {
    overflow: hidden;
    height: 100%;
    width: 100%;
  }

  .meg-head-container-row {
    flex-direction: column;
    margin-top: -2px;
    padding-top: 2px;
    .meg-headhighlight {
      border-right-width: 0;
      top: 0px;
      height: 19px;
      right: 0;
      width: 0;
    }
    .meg-head-fixed {
      width: 100%;
    }
  }

  .meg-head-container-column {
    flex-direction: row;
    .meg-headhighlight {
      margin-left: -2px;
      border-bottom-width: 0;
      bottom: 0;
      height: 0;
      left: 0px;
      width: 63px;
    }
    .meg-head-fixed {
      height: 100%;
    }
  }
</style>

