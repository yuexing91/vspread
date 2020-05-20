<template>
  <div class="meg-menu">
    <Tabs>
      <Tab-Pane name="开始">
        <Undo-Group></Undo-Group>
        <Clipboard-Group></Clipboard-Group>
        <Font-Group></Font-Group>
        <Alignment-Group></Alignment-Group>
        <Merge-Group></Merge-Group>
        <!--<Num-Group></Num-Group>-->
      </Tab-Pane>
      <!--<Tab-Pane name="插入">
        <Img-Group></Img-Group>
        <Chart-Group></Chart-Group>
      </Tab-Pane>-->
    </Tabs>
  </div>
</template>

<script>

  import Tabs from './tabs/Tabs.vue'
  import TabPane from './tabs/TabPane.vue'
  import FontGroup from './group/FontGroup.vue'
  import UndoGroup from './group/UndoGroup.vue'
  import ClipboardGroup from './group/ClipboardGroup.vue'
  import AlignmentGroup from './group/AlignmentGroup.vue'
  import MergeGroup from './group/MergeGroup.vue'
  import NumGroup from './group/NumGroup.vue'
  import ImgGroup from './group/ImgGroup.vue'
  import ChartGroup from './group/ChartGroup.vue'

  export default{
    provide(){
      return {
        $menu: this
      }
    },
    components: {
      Tabs,
      TabPane,
      FontGroup,
      UndoGroup,
      ClipboardGroup,
      AlignmentGroup,
      MergeGroup,
      NumGroup,
      ImgGroup,
      ChartGroup
    },
    data(){
      return {
        curCell:null
      }
    },
    computed: {
      $sheet(){
        return this.$parent.getCurSheet();
      },
      start(){
        return this.$sheet.selection.start;
      },
//      $cell(){
//        const cell = this.$sheet.getCurCell();
//        return cell;
//      },
    },
    watch:{
      start(){
        this.curCell = this.$sheet.getCurCell();
      }
    },
    methods: {}
  }
</script>

<style lang="scss">
  .meg-menu {
    height: 124px;
    font-size: 12px;
    color: #666;
    user-select:none;
  }
  .meg-menu *{
    font-size: 12px;
    vertical-align: top;
  }
  .meg-menu-op-color {
    position: relative;
  }

  .meg-menu-op {
    display: inline-block;
    border: none;
    min-width: 16px;
    min-height: 16px;
    text-align: center;
    border: 1px solid transparent;
    font-size: 0px;
    padding: 2px;
    vertical-align: top;
    &:hover {
      border-color: #d3f0e0 !important;
      outline: 2px dashed transparent;
    }
    .meg-menu-pcol {
      display: inline-block;
      height: 4px;
      width: 16px;
      position: absolute;
      bottom: 2px;
      left: 2px;
    }
    &.display{
      opacity: 0.5 !important;
      &:hover{
        background-color:transparent !important;
        border-color: transparent !important;
      }
    }
  }

  .meg-menu-select {
    border: 1px solid #ccc;
    padding: 0px;
    input {
      border: none;
      padding: 2px;
      height: 16px;
      &:focus {
        outline: none;
      }
    }
  }



  .meg-iconimg16{
    display: inline-block;
    width: 16px;
    height: 16px;
  }
  .meg-iconimg32{
    display: inline-block;
    width: 32px;
    height: 32px;
  }

  .meg-iconimg{
    &-paste32{
      background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABYUlEQVRYR+2XTUrFMBDHJ1kUBEWwuPUc3XgAj9GlKy9Q3kyK4NpD9CYi7xp2KwXBInTzItFG+5FnOiX2obS70vn4zX8mEyrgwI84cH6YBUBEGwBQA3gkopxb0FwA7UpEROx4bAeTmIg+AGzC4TtHhRFAtUWlhb4WGs5NoDjJxR7JRwCullTbTavWrgaQWZzk9127EcDzY9ZIKSNr1AI4JfdVahT6BjDWuzpObk9+BOg7fCkQCOAz3t8CsHPgk9v1faimK5ZjCO3QzEnp92G3wB+SZ/ErAMOgHKQgLZh6VLXWl0qpB9YpmFKNBUDEveZKKYiiqG6a5qoLEVQBH0CaplAURQ9iUQADWJZlD2JxANOjLsSiAK4BCQnwhohHU4bW2pjBDAaAiC9EdLoCrAqsCvwHBbJXAHnMqcTchiH3wA0A3AHA5K3WXscVIp5xwJ2bkBOga0tET4h4wfEPDTDr3+EdLoQ02zS3lXEAAAAASUVORK5CYII=);
    }
    &-edit-undo16{
      background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABfElEQVQ4T6WRzysEcRjGn/edtbukSPkPlJNyopQLyq9tv+uAopSL8hc4+DXNUK5K/gDKYS/7o92xktqyOStXcVUiipTM99UMsy1lh8xhLtPzmefzvIR/PlSbH13JDwhJgYFGALeugb4jU13W+0cVkFjO9Aj4RBjNWuMVoMHSZrISVtAHjK1mu6C5DJa2j4DMOnbqICzsfadhM9dhuDgD0P5jQNO9ZlwzScVl7NRq0chKrpMJp3UBNWRPj1nWHTu15TfwXp7/G3P5czyAaM6xkvtBbthMt/FbvJuABZBM+0FComipYnVE/wIih8yIasCNkEwWrFTmu9b4Wm5XBItEqBQt1f/ljGOr2RkN2mPA8KsaSDiWOq6FeG0MN3angZeSrZq+AH6zegAA8OjYqvXPgEBBgPyhrdSvAENL6ZaGaLybBIveiL5eg+51zInzUIAXjkZjD4Ge1nLDRPPOhipVz1jP3QdE4lcguSDI8XPkdbtsTj0FmdAGYcP+G/AOHzONERjQiSoAAAAASUVORK5CYII=);
    }
    &-edit-redo16{
      background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABdUlEQVQ4T6WSwUpCURCG/zmaEAVFEbQt2gY9gIEQkt7EdOMiqAeIoFWrUiRt0RMIbYKgoFrkFTOCahMEtRJ6iSCQgki96kzcUzc0MC94tjPzzf//cwh9Puo1v5g2ZzwtPACYYKBKQpGrbPTOmesJsBtD2wU/ILdKwUeMDwIvFPfiT3bNFcBuNJL5FYCO9WamChQHSpnYcwdAy2VssJBfMaagZKybRWZ5kQGa/wUYO+YWC7K2zF65/NRfWfANWEqZSyIo6oLQqQAH7K2Vr9OJigMzUoVViBxpB0DVyxywc3AA9yLwEyF3ubu8/ldBJJWPN4XOFeBhhkVEYecSGhBKmp8KGGx56uPtW3V4KTPILRRtawy0FGStlImddJzRSJpvAEYsqz56s594d5mBbtMKwknTJCDazcJ/QA0w0hdz3FCP+gJ2iIRcw6qV3ahpP2OIRQ6VoklnoxtLHR8pkD4bHmr6NgUUhNCs1axN91Lh+it3y6FvwBfCbZlJrD77kwAAAABJRU5ErkJggg==);
    }
    &-cut16{
      background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACAElEQVQ4T42SQWgTURCG/3lJo2AiKFTEnHr1IBZEKbQoHgRttQdRoXqo6MVb3i6IpVhCq1Qku29vXgrmoD3Ug6gxeLEILRRFKCh47SkgFhRMhJpmZ+Rtm7LWjbqnff/MfG/mf0OIfVrro0qpk57n3Yvr7X/XdW8x87wx5l1bo3ii4zijAGaUUqdKpdL8NvhxInoN4Lrv++VEgOu6/SKyAGBVRHqNMTWbqLXOE9EygG4iGvA8bzERYMVCobCglOonoqVcLnfCavV6/Y2I9DHzYhAEA/HOfhvBBlzXPSgibwFkmfmB1ZRSNwA0iOiY53mf/grYbHmEiB7HE0XksjFmdru5f3TQTnAcZwbANXtm5nIQBFeTXiYRoLXeC+A9EfXYIhFZAXDEGPP1vzrQWleIaBCALQit+wBe+b5/OhFwoTiXafDOCZHWaAqU2bNe293dXElDeCgqIFVZzfS0vnXlv4eQJlG6nFVrk0+KF5vRCGduP5+GSJ8Svhm1TORn0Kg9vXPlkj2fH380t0bZAyTiRJ6Qug+iperUubFNwLMvSKUPVYuDnyNg8eV+hK0P1anhfRsXdI5vARSr3srds9HmDY2/yLPi5TigU3xrBAYfVqmu6Kk4XH+oiD5WJ4ejkeyIneIRwJr4I9wxzSwjG5tHs7tSP8esSf+Kd1ykpKVJ0n4BswPwEUEaE9oAAAAASUVORK5CYII=);
    }
    &-parse16{
      background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAArklEQVQ4T2NkoBAwFhUV/cdmxv///837+/tPETIfbEBvby+KuuLiYhD/9f///30IGYLVAJBuRkZGRkK2g9XBXOBdtwmsfmuTH5iGugLDDHSv4XQByABivIbhApgrcBmQkpLCMGfOHHj4EHQBstfQvdXX18dIkguQAwRkGIoB6KEF8wLMBcjyoIAm2gBcUYliALoikNPQoxenC3DZgC2FYg0DmhpAKCmDY4GQIkLyAIfImxGYQhs1AAAAAElFTkSuQmCC);
    }
    &-formatpainter16{
      background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABgElEQVQ4T6WTu0oDQRSG/zObRFJZSNAHSCcKNoLgpbBRhIiCrY2FWIiQYGGja4yKQiaprK2DRuMLGKOkFgSxt1AS8RIFQTbnyApZ1mQXCU4xDDPn/851CP9c1K7eNM1QrVYrAJjQWlNbALe44dgX0GR8o7XuTyQS+yKy6oiJrn0B8Xg8D2CmYSwiR4FAYJmZ8yIyRETXzDzeAqhcpoY7DOs2efy+IiLr7hox81UwGJyzLGsTwFomk3l2ALaQmVOKMCaM26BRn9w+/VhohgA40VrPOmlUS5sHAlry6MajgpreLbxMeUWSzWZHbA1JLmdUeu7yBMRaIMyfUMb8XuG1zw2x80+n0wM/AHu7L+twyHovEmjQcy4Ea3tnb2Eb0iienb8DsA8PpZ2IAasMIOo9XHwY6cIi9Zpf7vdfXaicm1EQylAq0gwRINk9ur7RfN/SxqdSapDZKkKpsDMDPuJfKbjJ1YutWJ3qeQVl+Hn+c5Srl8k4Czq9wvatQbs/07b/BgCJrfOMmCfnAAAAAElFTkSuQmCC);
    }
    &-bold16{
      background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABR0lEQVQ4T2NkoBAwouv///8/C7IYIyPjH3x2oBjw9+/fmbgUMzExdTEyMt5Fl4cbALL5379/U4ODg9PQFD1SU1M73tTU9J6dnb2VkZHxCYoLYRx0A4qLi6edOnWK48iRIyH////n09TUXNbS0vKFmZk5nSgD1q5dOwukMCkpSenjx48uioqKq3t6et4TbQDIBZcvX2bbsWNHNBsb28MJEybsl5aWnsLIyHiNKBfAFP379++vqKjorurq6vuKiop3GBkZ+4kyAOSFO3fu/GlpadH8/PmzIysr6/kVK1acJtoLIAOYmJiebNmyRXLu3LmZjIyMn9asWbOCaANsbW3ngZx64sQJ49+/f+sLCgrunjNnzn2iDUCK3ifS0tJnpk2bFvj//39fRkbGzVjDACRIICXOZmRkPIMzJSInKLLzAjkZEyM3kmoIACAUvxErQ//XAAAAAElFTkSuQmCC);
    }
    &-italic16{
      background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABEUlEQVQ4T2NkoBAw4tL///9/FnQ5RkbGPxhi2Az4+/fvTFwGMzMzpyPLYbgAZPO/f/+mBgcHp6Ebsnbt2llMTEzZyC7B6gWYC6Kjo/V+/Phh0dnZOU1FRQXsJYIuACn6//8/75cvX7qjo6PjGBkZ365bt24bus0w12F1wf///3127drlOX369CwhIaGds2fPfohuM14D/v79O7W+vp7/ypUr0ba2tvOKiooeMDIyNmMLWJxhEBcXp/P161erlpaWadra2rMYGRkvEmXA////2f7+/TspKCgI5P8P69at24zL+SADUVwAC/39+/f/mTJlCtz/2EIfIwxIjX+sgUhKCsQZC8TmAbzRSEoGxZkbiTUEACK1fRF/fq/OAAAAAElFTkSuQmCC);
    }
    &-underline16{
      background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABP0lEQVQ4T9WTP0rEQBTG580YSRGsBPEImsbKE1ili4kgphECSlawTZMLpBYNKwo2KcT8uYEHsLKJabyA1TYLpti8JyNEkpDNip3Tzfe++b2Zb2aA9QYRrUkJABbtktT72revbarretqeCyHOh7S25wcgOyDitWVZZ9KQJMlUCHGJiFe2bR8T0Uaaprec84v2TpYCGrOE/kMAItZ5nt83If7qCDI4mbhpmqeMMZFl2V0TommaJ4yx9TzPHyR08BYagG3bh0S06bpuZBiGKMtyEQTBBABmSZI8rQQ4jrNXVdU+In4qivKOiNsSqKrqSxzHr6MAIpoURaGHYbgzn893iWgLAD40TSt933/Tdb0AgJulR5AFIjpCxIP+E+ecPwPAY1/vPGXP86hv6M+jKOqsGf0LQ7DRDFZ1H6p3dvAXwBc+ueYRVS40gQAAAABJRU5ErkJggg==);
    }
    &-strikethrough16{
      background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABmElEQVQ4T7VTMUjDQBT9d+kgAaGLQXBQxMXBdujkEMcKDlrspINDkUCdSnEJhawuFrJoq4hQu0k7NDgVnBIQhA7i0tFJpKEitWTK3ckvTYhQpFC8LT/vv//ev3cEZjxkxn6YSMAYOweAeQD4liTp9K8hIYEQIoZAQojPGLvKZrPbqqo+FovFNwA4w3qUKMQjeNKEgKBQKISNlNJnzvn6WN2ojbiue6lp2oEQIo4FVVVvsQkJFEV5cV13C//JsvxUr9dfLctitVptBwCWRwRRBaZpxhzH2W80GvdIIEnSoFqtOv1+X+i6fphKpVqdTmcvkUg8GIbhhQpKpdJSMAmLzWbzGgmSyaRtGMYnAMzlcrlVz/Pivu+v4QBKqQ4AA5LJZMQsV0k0TWsNh8MF9JfP5xd7vd5uoCCw0O12RblcPkmn0zftdvs42NPIgm3bF6ZpqoyxDVyU53mbAYEsy+/4jUBFUaxKpfKBe7JtOze+8i8ihNA55yvT2KCU3nHOj6LYX0HCsGBAoqGJBixojNb+5y1MYyfAzKzgB5ww1BOuqSvEAAAAAElFTkSuQmCC);
    }
    &-bottomborder16{
      background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAU0lEQVQ4T2NkoBAwgvQXFRX97+3tZSguLmYglu7r6wPrBRP/////T6pDGBkZEQbAXIBuCMxF2MSHqwtGY6EXIy3RNx2QmpRRUiKpmpHVgzMEJQAAfDRwEbshf7sAAAAASUVORK5CYII=);
    }
    &-fillcolor16{
      background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB2klEQVQ4T2NkwAIKCgp2MTExuYKk/v37t3vChAlu2NSBxBixSRQVFf35+/evNgMDg/r///83/vv3T2nKlCn3sanFakBBQcGHb9++6bGysm5nYWHRYmNje/n161ebadOm3UE3BKsB+fn5n/7+/fswPz9ffPr06aLZ2dkMM2bMwGoIhgFpaWlyrKys9yoqKt6KiIiIVVdXM/T29jLcu3ePYfr06a9vsRn9/M3MfY6RkWHKtib/3SgGgDSzsbFtLS8vF5ORkREDORdkQGtrK9jlIEN6J834+oTbiPsPMxcD4///NXADsGnGFmj7Dx7+uWL1evZngtYM/xhZX8MNyMzMvBEfH89nbm4uiSvKnj59+rOru/v1E059mR+swgyM/xi+wA3IyclRZGdn31lcXKwgKSnJim7I06dPf/f09Lz8+Jc15qWAzQFoGliDEQYCAgL7CgoKQIYwwwx58uTJv97e3hc/f/70u83neIeNjf0Dwz/Gd0wsDIZYY0FISOggyBBxcXGGZ8+eMfT09Lz48eOHz/Tp08+6lK/iZ2Fjf87IwOi5vdnvINZ0AApQAQGBIxEREbLLli179fXrVy+QZpCLHBpW8XD9ZfPb1hywDOyNv39F/+MKNGLEh4EBAMY6ycYcMdolAAAAAElFTkSuQmCC);
    }
    &-fontcolor16{
      background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABqElEQVQ4T2NkwAL+///P/e/fvz6YFBMT03lGRsYZ2NQyYhP8+/dv37x58yy2bt1qKSsr+2zChAlbmJmZ00kxYGZ8fHwkSMOXL194e3t7lyspKbUwMjJeQzcEwwX///8POHjwYPKECRN8vL29j4Nc4eTkdDY7O/ssNldgGPD379+ZDQ0NDrdu3VJYtmzZgvT09OAfP36wLVy4cDlBA/7//y/+7t27jqysrCg1NbUHDQ0NB1auXKm2atUqh4KCgi329vZzGRkZNyB7A8UF////L1u+fLknTIOtre2zDx8+sCUnJyfo6ureAhmI7goUA0DOLygo8Hn8+LEUthCfO3fuAiEhoQpGRsaXMHm4Af///9e/d+9eeXFxcSQo6lRVVZ/DFL1+/Zr38uXLamFhYQciIyP3MDIytmIYALK9s7PT8tSpU7p1dXVr9fX138IUwbwhIiLydubMmWuRvQF3ASz0v337xtbV1bULWRFIburUqca3b9+WbGho2IXsDWQvOP379y8cZCsTExPImathLvj//7/Mv3//aqFyKMma0at2439sAUas2DAwAACipc7tErZi9wAAAABJRU5ErkJggg==);
    }
    &-growfont16{
      background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABUUlEQVQ4T6WSvU4CQRSFz90FrTHxAVxqK2iNFlhoYgkFCTsbGh4BLExoTOARpCB72YSCTYyFsZDE3gQr67WztrIAZK7ZxInITwCZcubc755zMoQtD205j38B8vXeTlgvjOLlGwPOr+4OScstIXFyf33xvhHg7PJhnxLDZ8A6APA6Gg2P1gbEtj+/dh9BOP7tTT8tBbiumyOifiy2bTvdbrffFhW+FFAqlW4A5CzLckSk1ul0mpsCItu2QxHJAEgxc3ZtgOd5eRHpicgpgAwRNQBkmfllFrIwglKqp7XOBEGQLpfLzmQyiYio6ft+bSWgWCymkslkpLUOgyCoxANKqb7W2omBKwGu61Z/LM9FJqKC7/vh9MNcBKXUAIDDzHtGaGIACJm5sBSglIobH2itW8a+ERvweDxOd7vdD3P/x4HneQ0RqQKoMHNrepOJNvsnvgHFz4i4VgcyFQAAAABJRU5ErkJggg==);
    }
    &-shrinkfont16{
      background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABH0lEQVQ4T6XTsU7DMBAG4P8cAnMrsTKUF0BiRjDAABIjGSrZ3uARClsWpPIIMES5DBnIwIIYAPEEYWKmGyudGJogB1kiIqoacKknD77Pd+czYcFFrvFH4fXyx+fKPQjbPzHmyRmwQftnd6vwJjmRWAPwUhSTrbkAixyENxtUIiMs7dyeH77NDVjElpOFQWH3/wKafWsF+v1+x/f9dwBjZu62NbsVUEoNiGgAoENEQRzH2SykFdBa58aYZyHEJoARMwfOgNbaBuX2ZmNMj4iGZVl20zQdTyMzM6jTt7XXGIATZr5yAqSUr0KI3tThR2be+xNQSu0S0UOzcd8ZDT3PW4+iaPTrM0opL4UQx82a6zKqqjpNkuTCaQ5cP9nCk/gFbMdeuP1liLgAAAAASUVORK5CYII=);
    }
    &-topalign16{
      background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAQklEQVQ4T2NkYGBgKCoq+g+iSQV9fX2MjKRqQldPPQNI9QbI+SDXUM8F5IYF2AWkOh9m2SCLBYrCgFzNgygah7YXAFvyDBGSGfbzAAAAAElFTkSuQmCC);
    }
    &-middlealign16{
      background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAOUlEQVQ4T2NkoBAwUqifYbgYUFRU9J+csOjr62McRGFAqjdAzgd5e5B4gVTnw2JskMUCOQmJKrEAAB8RDBFlTKheAAAAAElFTkSuQmCC);
    }
    &-bottomalign16{
      background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAANklEQVQ4T2NkoBAwUqifYdQAhmETBkVFRf/JSQ99fX2MgygdkOoNkPNB3h4kXiDV+bAYA3kDAO5ODBGzYLwOAAAAAElFTkSuQmCC);
    }
    &-leftalign16{
      background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAO0lEQVQ4T2NkoBAwUqifgToGFBUV/SfHJX19fYzUcQE5tsP0gF1ArBdATka3bIh5Ad35o7EACZGBj0YACEcQEe5MwxUAAAAASUVORK5CYII=);
    }
    &-centeralign16{
      background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAARUlEQVQ4T2NkoBAwUqifgToGFBUV/SfHJX19fYzUcQE5tsP0oLiAWK+AnI7VAHJcQp0wINbp6C4cjQVIiFAnFsiJf5geAMg4EBEQCPGkAAAAAElFTkSuQmCC);
    }
    &-rightalign16{
      background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAQElEQVQ4T2NkoBAwUqifgToGFBUV/SfHJX19fYzUcQE5tsP0YHUBsV4aRF4g1snoYTWIvIDuNGK9NIi9QErKBACIOBARHNn1IwAAAABJRU5ErkJggg==);
    }
    &-wraptext16{
      background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABVUlEQVQ4T62Ty23CQBCGZxcbHxPSQKSkBFICnCzZaymkBFMCuaNIoQRcApHstQ8oUlxCaAEp1xzyOAbQDhq0i9ZgZA7xbefxzcw/YwYNnxACAWAopUzqQtm/AYQQXQB4A4AOQRGxn+d5qTsoAaBHdqVUUhTF0BTed0AAzvl3mqbLIAimnPOulPJOAxbr9brvOE7MGHtmjD1kWfZCkApAKRVzzmNdaVkUxS0BEPExz/MJ2Q/fNuCdAkwlRIwNwIjo+37Hdd0vG2gDyDHZbDZJq9XawSzAgsYJw3BEIxh9KiMYpxanVErd2AAAIJFJ3P04FUDTOk/5K3dgd6GU2onYBN4DoigaIOLssEUb0BvNLtpt72M+Di+P7kDvfiClvDqsahJXq79rx/E+X59C72yATv7RCb8AWM7H4r7uEumApnU/Tl3rRwAyRFFEOx7Zl3i2iE2Bp/xbRGnNEU0Ec8EAAAAASUVORK5CYII=);
    }
    &-centeracross16{
      background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAYklEQVQ4T2MsKir6z0Am6OvrY2QEGdDb24vViOLiYgZ8ctQzgEwfMBB0AT6DQd6jvgHedZsYtjb54bQYWR7DBSBJYgHIEqxeoMgFxNoOU0fdQCTVdph6gtE4RJIyuf6H6QMAzjB4EZxbDFQAAAAASUVORK5CYII=);
    }
  }

</style>
