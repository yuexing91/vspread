<template>
  <div class="meg-menu-tabs">
    <ul class="meg-menu-tabsbar">
      <li v-for="p in panes" :class="{'active':p==curPane}" @click="clickHandler(p)">
        <span>{{p}}</span>
      </li>
    </ul>

    <div class="meg-menu-tabscon">
      <slot></slot>
    </div>
  </div>
</template>
<script>
  export default{
    data(){
      return {
        panes:[],
        curPane:null
      }
    },
    methods:{
      getPanes(){
        return this.$children.filter(item => item.$options.name === 'TabPane');
      },
      updatePane(){
        this.panes = this.getPanes().map(pane=>{
          return pane.name
        })
        if(this.curPane==null){
          this.clickHandler(this.panes[0])
        }
      },
      clickHandler(p){
        this.curPane = p;
        this.getPanes().forEach(pane=>{
          pane.show = pane.name == p;
        })
      }
    }
  }
</script>
<style lang="scss">
  .meg-menu-tabs{
    .meg-menu-tabsbar{
      list-style: none;
      padding: 0px;
      margin: 0px;
      background-color: #e1e1e1;
      height: 30px;
      line-height: 30px;
      li{
        float: left;
        margin-left: 5px;
        &.active{
          background: #fafafa;
          color: #217346;
          outline: 2px solid transparent;
        }
        &:hover{
          color: #217346;
          cursor: pointer;
        }
        span{
          padding: 8px 12px;
        }
      }
      &:after{
        clear: both;
      }
    }
  }
</style>
