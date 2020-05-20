<template>
  <Flow-Clip direction="column" :compen="plusHeight">
    <Flow v-for="rFlow in rowFlows" :key="rFlow.start">
      <Flow-Clip direction="row" :compen="plusWidth">
        <Flow v-for="cFlow in columnFlows" :key="cFlow.start">
          <Grid
            :startRowIndex="rFlow.start"
            :endRowIndex="rFlow.end"
            :startColumnIndex="cFlow.start"
            :endColumnIndex="cFlow.end"
            :style="getGridSize(rFlow,cFlow)">
          </Grid>
        </Flow>
      </Flow-Clip>
    </Flow>
  </Flow-Clip>
</template>
<script>
  import Grid from '../grid/Grid.vue';
  import FlowClip from '../flow/FlowClip.vue';
  import Flow from '../flow/Flow.vue';

  export default{
    name: 'Block',
    inject: ['$sheet'],
    props: {
      plusHeight: Number,
      plusWidth: Number,
      rowFlows: Array,
      columnFlows: Array,
    },
    components: {
      Grid,
      FlowClip,
      Flow,
    },
    methods: {
      getGridSize(rFlow, cFlow){
        return this.$sheet.getGridSize(rFlow, cFlow)
      }
    }
  }
</script>
