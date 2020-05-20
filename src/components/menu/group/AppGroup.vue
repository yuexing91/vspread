<script>
  import Group from './Group.vue';
  import Btn from '../button/Button.vue';

  export default {
    inject: ['$menu'],
    components: {
      Group,
      Btn,
    },
    computed: {
      $sheet() {
        return this.$menu.$sheet;
      },
      $cell() {
        return this.$menu.curCell;
      },
    },
    watch: {
      $cell() {
        let style;
        if (this.$cell) {
          style = this.$sheet.getStyle(this.$cell.s);
        }

        if (this.items) {
          this.items.map(item => {
            if (typeof item == 'string') {
              this[item] = style ? style.getOption(item) : undefined;
            } else {
              this[item.key] = style ? ( style.getOption(item.key) || item.value ) : item.value;
            }
          });
        }

      },
    },
  };
</script>
<style lang="scss">
</style>
