<template>
  <div class="meg-menu-group">
    <div class="meg-menu-groupcon">
      <slot></slot>
    </div>
    <div class="meg-menu-groupname">
      {{name}}
    </div>
  </div>
</template>
<script>
  export default{
    props:['name']
  }
</script>
<style lang="scss">
  .meg-menu-group {
    height: inherit;
    display: inline-block;
    border-right: 1px solid #e1e1e1;
    padding:0px 6px;
    position: relative;
    vertical-align:top;
  }

  .meg-menu-groupname {
    position: absolute;
    bottom: 1px;
    text-align: center;
    left: 50%;
    transform: translateX(-50%);
    white-space: nowrap;
  }

  .meg-menu-group-row {
    margin: 8px 0px;
    height: 22px;
  }


  .meg-menu-group-column{
    display: inline-block;
    vertical-align: top;
    .meg-menu-op{
      display: block;
    }
  }

  .meg-menu-group-column-mulit{
    .meg-menu-op{
      text-align: left;
    }
  }

</style>
