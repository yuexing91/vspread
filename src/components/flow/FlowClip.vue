<template>
  <div :class="['meg-flowclip',`meg-flowclip-${direction}`]">
    <div class="meg-flow-compen" :style="compenStyle"></div>
    <slot></slot>
  </div>
</template>
<script>
  export default{
    name:'FlowClip',
    props:{
      //方向
      direction:String,
      //补偿间距大小
      compen:Number
    },
    computed:{
      compenStyle(){
        return `${this.direction==='column'?'height':'width'}:${this.compen}px`;
      }
    }
  }
</script>
<style lang="scss">
  @import "../../style/style";
  .meg-flowclip{
    display: flex;
  }
  .meg-flowclip-column{
    flex-direction: column;
  }
  .meg-flow-compen,.meg-flow{
    @include flex-fixed;
  }
</style>
