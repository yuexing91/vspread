<template>
  <Group name="剪贴板">
    <div class="meg-menu-group-column">
      <btn class="meg-menu-op" size="32" icon="paste32" title="粘贴" @click="paste">
      </btn>
      <btn class="meg-menu-op" text="粘贴"></btn>
    </div>

    <div class="meg-menu-group-column meg-menu-group-column-mulit">
      <btn class="meg-menu-op" icon="cut16" title="剪切" text="剪切" @click="cut">
      </btn>
      <btn class="meg-menu-op" icon="copy16" title="复制" text="复制" @click="copy">
      </btn>
      <btn class="meg-menu-op"
           icon="formatpainter16"
           :selected="formatpainter"
           @click="openFormatpainter"
           title="格式刷"
           text="格式刷">
      </btn>
    </div>

  </Group>
</template>
<script>
  import AppGroup from './AppGroup.vue';

  export default ( {
    extends: AppGroup,
    computed: {
      formatpainter() {
        return this.$sheet.curAction == 'formatpainter';
      },
    },
    methods: {
      copy() {
        this.$sheet.doCopySelection();
      },
      cut() {
        this.$sheet.doCutSelection();
      },
      paste() {
        this.$sheet.doPasteSelection();
      },
      openFormatpainter() {
        this.$sheet.doOpenFormatpainter();
      },
    },
  } );
</script>
<style lang="scss">
</style>
