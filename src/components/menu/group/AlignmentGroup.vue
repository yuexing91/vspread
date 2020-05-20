<template>
  <Group name="对齐方式">
    <div class="meg-menu-group-row">
      <btn icon="topalign16"
           class="meg-menu-op"
           title="顶端对齐"
           :selected="verticalAlign=='top'"
           @click="setVerticalAlign('top')">
      </btn>
      <btn icon="middlealign16"
           class="meg-menu-op"
           title="垂直居中"
           :selected="verticalAlign=='middle'"
           @click="setVerticalAlign('middle')">
      </btn>
      <btn icon="bottomalign16"
           class="meg-menu-op"
           title="底端对齐"
           :selected="verticalAlign=='bottom'"
           @click="setVerticalAlign('bottom')">
      </btn>
    </div>
    <div class="meg-menu-group-row">
      <btn icon="leftalign16"
           class="meg-menu-op"
           title="左对齐"
           :selected="textAlign=='left'"
           @click="setTextAlign('left')">
      </btn>
      <btn icon="centeralign16"
           class="meg-menu-op"
           title="水平居中"
           :selected="textAlign=='center'"
           @click="setTextAlign('center')">
      </btn>
      <btn icon="rightalign16"
           class="meg-menu-op"
           title="右对齐"
           :selected="textAlign=='right'"
           @click="setTextAlign('right')">
      </btn>
      <!--<btn icon="outdent16"
           class="meg-menu-op"
           title="减少缩进">
      </btn>
      <btn icon="indent16"
           class="meg-menu-op"
           title="增加缩进">
      </btn>-->
    </div>
  </Group>
</template>
<script>
  import AppGroup from './AppGroup.vue';

  export default ( {
    extends: AppGroup,
    data() {
      return {
        optionItems: ['verticalAlign', 'textAlign'],
        verticalAlign: undefined,
        textAlign: undefined,
      };
    },
    methods: {
      setTextAlign(type) {
        this.textAlign = type;
        this.$sheet.setTextAlign(this.textAlign);
      },
      setVerticalAlign(type) {
        this.verticalAlign = type;
        this.$sheet.setVerticalAlign(this.verticalAlign);
      },
    },
  } );
</script>
<style lang="scss">
</style>
