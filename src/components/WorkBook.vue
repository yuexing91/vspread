<template>
  <div
    tabIndex="999"
    class="meg-workbook"
    @parse="handleParse"
    @keydown="handleKeyMap">
    <Sheet
      ref="sheet"
      :autoCreate="autoCreate"
      :options="options"/>
    <Menus v-if="menu" class="meg-workbook-menu"/>
  </div>
</template>

<script>
  import Menus from './menu/Menu.vue';
  import Sheet from './sheet/Sheet.vue';

  import keyMap from './mixins/keyMap';

  export default {
    name: 'app',
    props: {
      menu: Boolean,
      autoCreate: Boolean,
      options: Object,
    },
    mixins: [keyMap],
    components: {
      Sheet,
      Menus,
    },

    methods: {
      getCurSheet() {
        return this.$refs.sheet;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .meg-workbook {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    outline: none;

    .meg-sheet {
      flex-grow: 1;
      order: 1
    }

    &-menu {
      flex-shrink: 0;
    }
  }
</style>
