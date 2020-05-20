<template>
  <div :class="['meg-menu-button',{'meg-btn-selected':selected}]" :title="title" @click="$emit('click')">
    <i v-if="icon" :class="[`meg-iconimg${size||16}`,`meg-iconimg-${icon}`]"></i>
    <span v-if="text">{{text}}</span>
  </div>
</template>
<script>
  export default{
    props: ['text', 'title', 'icon', 'size', 'selected']
  }
</script>
<style lang="scss">
  .meg-menu-button {
    display: inline-block;
    font-size: 12px;
    &:hover {
      background-color: #d3f0e0 !important;
    }
    &.meg-btn-selected {
      background-color: #9fd5b7 !important;
    }
  }

</style>
