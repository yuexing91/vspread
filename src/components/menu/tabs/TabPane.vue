<template>
  <div class="meg-menu-tab" v-show="show">
    <slot></slot>
  </div>
</template>
<script>
  export default{
    name: 'TabPane',
    props: ['name'],
    data(){
      return {
        show: false
      }
    },
    mounted () {
      this.$parent.updatePane();
    },
  }
</script>
<style lang="scss">
  .meg-menu-tab {
    height: 89px;
    padding: 4px 4px 0px 3px;
    border-bottom: 1px solid #eee
  }
</style>
