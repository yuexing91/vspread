<template>
  <Group name="字体">
    <div class="meg-menu-group-row">
      <Dropdown class="meg-menu-op meg-menu-select" title="字体">
        <input class="meg-font-family" v-model="fontFamily" @change="setFontFamily">
        <m-Select slot="content"
                  class="meg-font-family-sel"
                  v-model="fontFamily"
                  :options="fontFamilyOptions"
                  @input="setFontFamily"
        ></m-Select>
      </Dropdown>

      <Dropdown class="meg-menu-op meg-menu-select" title="字号">
        <input class="meg-font-size" v-model="fontSize" @change="setFontSize">
        <m-Select
          class="meg-font-size-sel"
          slot="content"
          v-model="fontSize"
          :options="fontSizeOptions"
          @input="setFontSize"
        ></m-Select>
      </Dropdown>

      <btn class="meg-menu-op" icon="growfont16" title="增大字号" @click="setFontPlus"></btn>
      <btn class="meg-menu-op" icon="shrinkfont16" title="减小字号" @click="setFontMinus"></btn>
    </div>

    <div class="meg-menu-group-row">
      <btn icon="bold16"
           title="加粗"
           :selected="fontWeight"
           @click="setFontWeight"></btn>
      <btn icon="italic16"
           title="倾斜"
           :selected="fontStyle"
           @click="setFontStyle"></btn>
      <btn icon="underline16"
           title="下划线"
           :selected="textDecoration=='underline'"
           @click="setTextDecoration('underline')"></btn>
      <btn icon="strikethrough16"
           title="删除线"
           :selected="textDecoration=='line-through'"
           @click="setTextDecoration('line-through')"></btn>

      <Dropdown class="meg-menu-op">
        <i @click="setBorder" class="meg-iconimg16 meg-iconimg-bottomborder16"></i>
        <m-Select slot="content"
                  v-model="borderType"
                  :options="borderOptions"
                  @input="setBorder"
        ></m-Select>
      </Dropdown>

      <Dropdown class="meg-menu-op meg-menu-op-color">
        <i class="meg-iconimg16 meg-iconimg-fillcolor16" @click="setBgColor"></i>
        <span class="meg-menu-pcol" :style="{background:bgColor}" @click="setBgColor"></span>
        <Colorpick slot="content" v-model="bgColor" @input="setBgColor"></Colorpick>
      </Dropdown>

      <Dropdown class="meg-menu-op meg-menu-op-color">
        <i class="meg-iconimg16 meg-iconimg-fontcolor16" @click="setColor"></i>
        <span class="meg-menu-pcol" :style="{background:color}" @click="setColor"></span>
        <Colorpick slot="content" v-model="color" @input="setColor"></Colorpick>
      </Dropdown>
    </div>
  </Group>
</template>
<script>
  import AppGroup from './AppGroup.vue';
  import Dropdown from '../dropdown/Dropdown.vue';
  import mSelect from '../select/Select.vue';
  import Colorpick from '../colorpick/Colorpick.vue';

  export default {
    extends: AppGroup,
    components: {
      Dropdown,
      mSelect,
      Colorpick,
    },
    data() {
      return {

        items: [
          { key: 'fontSize', value: 11 },
          { key: 'fontFamily', value: '宋体' },
          'fontWeight', 'fontStyle', 'textDecoration',
        ],

        fontSize: 11,
        fontSizeOptions: [8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 26, 28, 36, 48, 72],

        fontFamily: '宋体',
        fontFamilyOptions: ['宋体', '楷体', '仿宋', '微软雅黑', '黑体', 'Calibri', 'Consolas'],

        color: '#ff1400',
        bgColor: '#ffff00',

        fontWeight: undefined,
        fontStyle: undefined,
        textDecoration: undefined,

        borderType: 't',
        borderOptions: [{
          text: '上边框',
          value: 't',
        }, {
          text: '下边框',
          value: 'b',
        }, {
          text: '左边框',
          value: 'l',
        }, {
          text: '右边框',
          value: 'r',
        }, {
          text: '无边框',
          value: '',
        }, {
          text: '全边框',
          value: 'blrt',
        }],
      };
    },
    computed: {
      border() {
        return this.borderOptions.find(opt => opt.value == this.borderType);// _.find(this.borderOptions, { value: this.borderType })
      },
    },
    methods: {
      setBgColor() {
        this.$sheet.setBackground(this.bgColor);
      },
      setColor() {
        this.$sheet.setFillColor(this.color);
      },
      setBorder() {
        this.$sheet.setBorder(this.borderType);
      },
      setFontSize() {
        this.$sheet.setFontSize(this.fontSize);
      },
      setFontPlus() {
        this.fontSize++;
        this.setFontSize();
      },
      setFontMinus() {
        this.fontSize--;
        this.setFontSize();
      },
      setFontFamily() {
        this.$sheet.setFontFamily(this.fontFamily);
      },
      setFontWeight() {
        this.fontWeight = this.fontWeight ? undefined : 'bold';
        this.$sheet.setFontWeight(this.fontWeight);
      },
      setFontStyle() {
        this.fontStyle = this.fontStyle ? undefined : 'italic';
        this.$sheet.setFontStyle(this.fontStyle);
      },
      setTextDecoration(decoration) {
        this.textDecoration = this.textDecoration === decoration ? undefined : decoration;
        this.$sheet.setTextDecoration(this.textDecoration);
      },
    },
  };
</script>
<style lang="scss">
  .meg-font-family {
    width: 134px;
    padding: 2px;
  }

  .meg-font-family-sel {
    width: 156px;
  }

  .meg-font-size-sel {
    width: 52px;
  }

  .meg-font-size {
    padding: 2px;
    width: 30px;
  }
</style>
