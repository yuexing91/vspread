<template>
  <Group name="图表">
    <div class="meg-menu-group-column">
      <btn class="meg-menu-op" size="32" icon="paste32">
      </btn>
      <btn class="meg-menu-op" text="柱状图"></btn>
    </div>

    <div class="meg-menu-group-column">
      <btn class="meg-menu-op" size="32" icon="paste32">
      </btn>
      <btn class="meg-menu-op" text="折线图"></btn>
    </div>

    <div class="meg-menu-group-column">
      <btn class="meg-menu-op" size="32" icon="paste32">
      </btn>
      <btn class="meg-menu-op" text="饼图"></btn>
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
