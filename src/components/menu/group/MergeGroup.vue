<template>
  <Group name="合并">
    <div class="meg-menu-group-row">
      <btn class="meg-menu-op"
           icon="wraptext16"
           title="自动换行"
           text="自动换行"
           :selected="whiteSpace=='normal'"
           @click="setWhiteSpace"
      >
      </btn>
    </div>
    <div class="meg-menu-group-row">
      <btn class="meg-menu-op"
           icon="centeracross16"
           title="合并后居中"
           text="合并后居中"
           @click="setMerge"
      >
      </btn>
    </div>
  </Group>
</template>
<script>
  import AppGroup from './AppGroup.vue';

  export default {
    extends: AppGroup,
    data() {
      return {
        optionItems: ['whiteSpace'],
        whiteSpace: undefined,
      };
    },
    methods: {
      setWhiteSpace() {
        this.whiteSpace = this.whiteSpace == 'normal' ? undefined : 'normal';
        this.$sheet.setSelctionExpandStyle({
          whiteSpace: this.whiteSpace,
        });
      },
      setMerge() {
        this.$sheet.doMergeCell('center');
      },
    },
  };
</script>
<style lang="scss">
</style>
