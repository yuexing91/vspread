<template>
  <ul class="meg-ctxmenu" v-show="visible">
    <li class="meg-ctxmenu-item" :class="{'meg-ctxmenu-sub':item.children,'meg-ctxmenu-divided':item.divided}"
        v-for="item in datas"
        :key="item.handler"
        @click.stop="click(item)"
        @mouseenter="item.show=true"
        @mouseleave="item.show=false">
      {{item.text}}
      <ctxmenu
        v-if="item.children"
        v-model="item.show"
        :items="item.children"
        class="meg-ctxmenu-submenu"
        @click-item="click($event)"/>
    </li>
  </ul>
</template>

<script>
  export default {
    name: 'ctxmenu',
    props: ['value', 'items'],
    data(){
      return {
        visible: this.value,
        datas: []
      }
    },
    watch: {
      value(){
        this.visible = this.value;
        if (this.visible) {
          document.addEventListener('click', this.addClickHandler)
        } else {
          document.removeEventListener('click', this.addClickHandler)
        }
      },
      items: {
        immediate: true,
        handler(){
          this.datas = this.items.map(item => {
            if (item.children) {
              return Object.assign({ show: false }, item)
            }
            return item;
          })
        }
      }
    },
    methods: {
      click(item){
        this.$emit('input', false)
        this.$emit('click-item', item)
      },
      addClickHandler(){
        this.$emit('input', false)
      }
    }
  }
</script>

<style lang="scss">
  .meg-ctxmenu {
    position: absolute;
    overflow: visible;
    margin: 0px;
    padding: 0px;
    list-style: none;
    min-width: 120px;
    border: 1px solid #dddee1;
    background: #fff;
    z-index: 99;
    .meg-ctxmenu-item {
      position: relative;
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
    .meg-ctxmenu-sub {
      &:before {
        content: " ";
        position: absolute;
        top: 10px;
        right: 6px;
        border-left: 4px solid #4d82b8;
        border-top: 4px solid transparent;
        border-bottom: 4px solid transparent;
      }
    }
    .meg-ctxmenu-submenu {
      top: 0px;
      left: 100%;
    }
    .meg-ctxmenu-divided {
      border-bottom: 1px solid #e9eaec;
      margin-bottom: 1px;
    }
  }
</style>
