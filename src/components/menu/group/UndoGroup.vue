<template>
  <Group name="撤销">
    <div class="meg-menu-group-row">
      <btn :class="['meg-menu-op',{display:!canUndo}]" @click="undo" icon="edit-undo16" title="撤销">
      </btn>
    </div>
    <div class="meg-menu-group-row">
      <btn :class="['meg-menu-op',{display:!canRedo}]" @click="redo" icon="edit-redo16" title="恢复">
      </btn>
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
      canUndo() {
        return this.$sheet.undoList.length > 0;
      },
      canRedo() {
        return this.$sheet.redoList.length > 0;
      },
    },
    methods: {
      undo() {
        this.$sheet.doUndo();
      },
      redo() {
        this.$sheet.doRedo();
      },
    },
  };
</script>
<style lang="scss">
</style>
