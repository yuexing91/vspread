<template>
  <Group name="数字">
    <div class="meg-menu-group-row">
      <Dropdown class="meg-menu-op meg-menu-select" title="数字格式">
        <input class="meg-font-family" readonly>
        <m-Select slot="content"
                  :options="numFormatOptions"
        ></m-Select>
      </Dropdown>
    </div>
    <div class="meg-menu-group-row">
      <btn class="meg-menu-op" icon="percentage16" title="百分比"></btn>
      <btn class="meg-menu-op" icon="commaformat" title="千位分隔符样式"></btn>
      <btn class="meg-menu-op" icon="increasedecimal16" title="增加小数位"></btn>
      <btn class="meg-menu-op" icon="decreasedecimal16" title="减少小数位"></btn>
    </div>
  </Group>
</template>
<script>
  import Group from './Group.vue';
  import Dropdown from '../dropdown/Dropdown.vue';
  import mSelect from '../select/Select.vue';
  import Btn from '../button/Button.vue';

  export default {
    inject: ['$menu'],
    components: {
      Group,
      Btn,
      mSelect,
      Dropdown,
    },
    data() {
      return {
        numFormatOptions: [
          { text: '常规', value: '' },
          { text: '数字', value: 'num' },
          { text: '货币', value: 'coin' },
          { text: '短日期', value: 'date' },
          { text: '长日期', value: 'longdate' },
          { text: '百分比', value: 'percent' },
          { text: '分数', value: 'fraction' },
          { text: '科学技术', value: 'counting' },
          { text: '文本', value: 'text' },
        ],
      };
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
