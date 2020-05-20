<template>
  <div class="meg-sheetediter meg-sheetediting"
       contenteditable="true"
       spellcheck="false"
       autocomplete="false"
       role="textbox"
       autocorrect="off"
       :style="styles"
       v-if="editState"
       @keydown.enter.stop="enter"
       @keydown.esc.stop="cancelEdit"
       @keyup.stop
       @keydown.stop
       @input="input"
       @paste="paste"
       @blur="blur"
       v-html="val"
       v-focus/>
</template>
<script>
  import _ from 'lodash';

  import { getCellValue } from '../sheet/mixins/cell/cellUtil'

  export default{
    inject: ['$sheet'],
    data(){
      return {
        width: 0,
        curCell: null,
        val: '',
        isInster: false
      }
    },
    computed: {
      editState(){
        return this.$sheet.curAction === 'editer';
      },
      cellInfo(){
        return this.$sheet.selection.start;
      },
      styles(){
        const info = this.$sheet.selectionInfo

        return Object.assign({
          'min-width': `${info.width - 5}px`,
          'min-height': `${info.height - 1}px`,
          'top': `${info.top - this.$sheet.scrollTop}px`,
          'left': `${info.left - this.$sheet.scrollLeft}px`
        }, this.cellStyle);
      },
      cellStyle(){
        return Object.assign({
          background: '#fff',
        })
      },
      selectionEditer(){
        return this.$sheet.selectionEditer
      },
    },
    watch: {
      editState(){
        if (this.editState) {
          this.curCell = this.$sheet.getPosCell(this.cellInfo);
          if (this.curCell && this.curCell.f) {
            this.val = _.$parseRefs(this.curCell.f, this.cellInfo);
          } else {
            this.val = getCellValue(this.curCell);
          }
        }
      },
      selectionEditer: {
        deep: true,
        handler(){
          if (this.selectionEditer) {
            let s              = _.$area2ExcelIndex(this.selectionEditer)
            this.isInster      = true;
            this.$el.innerText = this.temp1 + s + this.temp2;
            setCursor(this.$el, this.temp1.length + s.length)
          }
        }
      }
    },
    directives: {
      focus: {
        inserted(el) {
          el.focus()
          setCursor(el, el.innerText.length)
        }
      }
    },
    methods: {
      cancelEdit(){
        this.$sheet.doCancelEdit();
      },
      input(e){
        this.isInster = false;
      },
      paste(e){

      },
      enter(e){
        if (!e.shiftKey) {
          this.endEdit();
          e.preventDefault();
        }
      },
      blur(){
        if (!this.editState) {
          return;
        }
        const val       = this.$el.innerText;
        const selection = window.getSelection();
        const range     = selection.getRangeAt(0)

        let temp1 = val.substr(0, range.startOffset);
        let temp2 = val.substr(range.endOffset);

        if (!this.isInster) {
          if ((/\w/).test(_.last(temp1))) {
            return this.endEdit()
          }
          this.temp1 = temp1;
          this.temp2 = temp2;
        }

        if (val.startsWith('=')) {
          this.$sheet.curSelectionName = 'selectionEditer';
        } else {
          this.endEdit()
        }
      },
      endEdit(){
        this.cancelEdit();
        this.isInster = false;
        const v       = this.$el.innerText;
        const f       = this.curCell ? (this.curCell.f || '') : ''
        const ov      = getCellValue(this.curCell) || ''
        if (f) {
          if (f === v) {
            return;
          }
        } else if (ov == v) {
          return;
        }
        this.$sheet.doEditCellValue(v);
      },
    }
  }

  function setCursor(el, index) {
    const sel   = window.getSelection();
    const range = document.createRange();
    if (range && el.firstChild) {
      range.setStart(el.firstChild, index);
      range.collapse(true)
      sel.removeAllRanges();
      sel.addRange(range);
    } else {
      el.focus()
    }
  }

</script>
<style lang="scss">
  .meg-sheetediter {
    position: absolute;
    outline: none;
    white-space: nowrap;
    z-index: 100;
    padding: 0px 2px;
    font-size: 11pt;
  }
</style>
