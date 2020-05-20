<template>
  <Group name="插图">
    <div class="meg-menu-group-column">
      <btn class="meg-menu-op" size="32" icon="paste32" title="图片">
      </btn>
      <btn class="meg-menu-op" text="图片"></btn>
    </div>

    <div class="meg-menu-group-column">
      <btn class="meg-menu-op" size="32" icon="paste32" title="图片">
      </btn>
      <btn class="meg-menu-op" text="形状"></btn>
    </div>

  </Group>
</template>
<script>
  import Group from './Group.vue';
  import Btn from '../button/Button.vue';

  export default {
    inject: ['$menu'],
    components: {
      Group,
      Btn,
    },
    data() {
      return {};
    },
    computed: {
      $sheet() {
        return this.$menu.$sheet;
      },
    },
    methods: {},
  };
</script>
<style lang="scss">
</style>
