<template>
  <ul class="meg-select">
    <li v-for="option in options" @click="handlerClick(option)">{{option.text || option}}</li>
  </ul>

</template>
<script>

  export default {
    props: ['value', 'options'],
    methods: {
      handlerClick(option) {
        this.$emit('input', option.hasOwnProperty('value') ? option.value : option);
        this.$emit('change', option);
      },
    },
  };
</script>
<style lang="scss">
  .meg-select {
    background: #fff;
    border: 1px solid #cacaca;
    padding: 0px;
    margin: 0px;
    list-style: none;
    text-align: left;

    li {
      margin: 0;
      padding: 6px 16px;
      color: #495060;
      font-size: 12px;
      white-space: nowrap;
      cursor: pointer;

      &:hover {
        background: #f3f3f3;
      }
    }
  }


</style>
