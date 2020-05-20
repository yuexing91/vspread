import FormulaGraph from './formula/FormulaGraph';
import _ from 'lodash';
import * as Formula from '../../../libs/formula';
import { getCellRelValue } from './cell/cellUtil';

function eRef() {
  return '#REF!';
}

export default {
  created() {
    this.formulaGraph = new FormulaGraph();
    this.initFormula();
  },
  methods: {

    initFormula() {
      this.formulaGraph = new FormulaGraph();
      _.forEach(this.cells, (row, rowIndex) => {
        _.forEach(row, (cell, columnIndex) => {
          if (cell && cell.fs) {
            let pos = {
              rowIndex: +rowIndex, columnIndex,
            };
            this.setCellFormula(pos, '=' + cell.fs);
            this.computedCellFormula(pos);
          }
        });
      });

    },

    /**私有方法*/
    //绑定单元格内容变化导致的公式引用
    f_bindFormula() {
      this.$on('on-cellval-change', e => {
        const refs = this.formulaGraph.getTargetRefs(e.pos);
        _.each(refs, ref => {
          this.computedCellFormula(ref.pos);
        });
      });

      this.$on('on-row-change', e => {
        this.f_updateCellFormula(e.cur, e.num, e.copy, 'rowIndex');
      });
      this.$on('on-column-change', e => {
        this.f_updateCellFormula(e.cur, e.num, e.copy, 'columnIndex');
      });

    },
    //当发生插入、删除行列时，需要更新公式的引用
    f_updateCellFormula(cur, num, copy, name) {
      const updateRefs = {};
      const computedRefs = {};

      //引用被删除的需要更新计算公式，并重新执行计算
      function addComputedRefs(refs) {
        _.each(refs, ref => {
          computedRefs[ref.refId] = ref;
          updateRefs[ref.refId] = ref;
        });
      }

      //引用被更新的只需要更新公式
      function addUpdateRefs(refs) {
        _.each(refs, ref => {
          updateRefs[ref.refId] = ref;
        });
      }

      //遍历节点引用
      _.each(this.formulaGraph.refs, ref => {
        const pos = ref.pos;
        ref.oldId = ref.id;
        //只有当前操作的行大于cur才需要更新
        if (pos[name] >= cur) {
          //不是删除
          if (num > 0 || pos[name] >= cur - num) {
            addUpdateRefs([ref]);
            //计算新的位置
            const _pos = Object.assign({}, pos);
            _pos[name] += num;
            ref.updatePos(_pos);
          } else {
            //引用被删除的需要更新计算公式，并重新执行计算
            addComputedRefs(ref.targetRefs);
            this.formulaGraph.removeRef(ref);
          }
        }
      });

      //遍历区域引用
      _.each(this.formulaGraph.areaRefs, areaRef => {
        areaRef.oldId = areaRef.id;
        const area = areaRef.area;

        if (copy && cur == area.start[name] + 1) {
          area.end[name] += num;
          addUpdateRefs(areaRef.targetRefs);
        }

        //选中的部分在区域的开始位置或之前
        else if (cur <= area.start[name]) {
          if (num > 0 || cur - num <= area.start[name]) {
            addUpdateRefs(areaRef.targetRefs);
            area.start[name] += num;
            area.end[name] += num;
          } else {//删除区域罗逻辑
            addComputedRefs(areaRef.targetRefs);
            if (cur - num <= area.end[name]) {//删除部分
              area.start[name] = cur;
              area.end[name] += num;
            } else {//全部删除
              this.formulaGraph.removeArea(areaRef);
            }
          }
          areaRef.updateArea(area);
        }

        //选中的部分在区域的结束位置或之前
        else if (cur <= area.end[name]) {
          if (num < 0 && cur - num - 1 > area.end[name]) {
            area.end[name] = cur - 1;
          } else {
            area.end[name] += num;
          }
          if (num < 0) {
            addComputedRefs(areaRef.targetRefs);
          } else {
            addUpdateRefs(areaRef.targetRefs);
          }
          areaRef.updateArea(area);
        }


      });

      this.formulaGraph.updateId();

      _.each(updateRefs, ref => {
        if (ref.id) {
          this.f_updateCellFormulaRef(ref, computedRefs[ref.refId] != undefined);
        }
      });

    },
    /***
     * 重新更新ref的公式参数
     * @param ref
     * @param computed 是否需要重新执行计算
     */
    f_updateCellFormulaRef(ref, computed) {
      const pos = ref.pos;
      const oldPos = _.$strToPos(ref.oldId);
      const cell = this.getPosCell(pos);
      if (cell && cell.f) {
        cell.f = _.$replaceFormulaRefs(cell.f, (type, obj) => {
          _.$posAdd(obj, oldPos);
          if (type == 'area') {
            const source = _.find(ref.sourceAreaRefs, { oldId: FormulaGraph.createAreaId(obj) });
            if (source) {
              return _.$getRef(pos, source.area.start) + ':' + _.$getRef(pos, source.area.end);
            } else {
              return '#REF!';
            }
          } else {
            const source = _.find(ref.sourceRefs, { oldId: _.$posToStr(obj) });
            if (source) {
              return _.$getRef(pos, source.pos);
            } else {
              return '#REF!';
            }
          }
        });
        this.compileFormula(pos);
        if (computed) {
          this.computedCellFormula(pos);
        }
      }
    },

    //解除单元格公式的引用
    f_relieveCellFormula(pos) {
      const cell = this.getPosCell(pos);
      if (cell && cell.f) {
        cell.f = undefined;
        this.formulaGraph.removeSourceRefs(pos);
      }
    },
    /***
     * 重新记录单元格公式的引用
     * 当单元格的内容改变时，需要重新记录单元格的引用
     * @param pos
     * @param refPos
     * @param refArea
     * @returns {*}
     */
    f_resetCellFormulaLinks(pos, refPos, refArea) {

      function diff(source, target) {
        return _.filter(source, function (pos, key) {
          return !target[key];
        });
      }

      refPos = _.mapKeys(refPos, pos => {
        return _.$posToStr(pos);
      });

      refArea = _.mapKeys(refArea, area => {
        return _.$posToStr(area.start) + ':' + _.$posToStr(area.end);
      });

      const sourcePos = this.formulaGraph.getSourceRefs(pos) || {};
      const sourceArea = this.formulaGraph.getSourceAreaRefs(pos) || {};

      //加入新增的关系
      _.each(diff(refPos, sourcePos), _pos => {
        this.formulaGraph.addLink(_pos, pos);
      });

      _.each(diff(refArea, sourceArea), area => {
        this.formulaGraph.addAreaLink(area, pos);
      });

      const ref = this.formulaGraph.getRef(pos);
      //去除删除的引用
      if (ref) {
        _.each(diff(sourcePos, refPos), _ref => {
          ref.removeSource(_ref);
        });
        _.each(diff(sourceArea, refArea), _area => {
          ref.removeSourceArea(_area);
        });
      }
      return ref;
    },

    f_setCellFormula(pos, formula) {
      let refPos = [];
      let refArea = [];
      let cell = this.getPosCell(pos);

      _.$replaceFormulaRefs(formula, function (type, _pos, ref) {
        _.$posAdd(_pos, pos);
        if (type == 'area') {
          refArea.push(_pos);
        } else {
          refPos.push(_pos);
        }
      });

      this.setCellAttribute(pos, cell, 'f', formula);
      this.f_resetCellFormulaLinks(pos, refPos, refArea);
      this.compileFormula(pos);
    },

    /**公有方法*/
    /***
     * 设置单元格公式
     * @param cell
     * @param formula
     * @param pos
     */

    setCellFormula(pos, formula) {
      formula = formula.replace(/([a-z]+[\d]+):([a-z]+[\d]+)/ig, function (areaIndex, start, end) {
        const s = _.$excelIndexToIndex(start);
        const e = _.$excelIndexToIndex(end);
        return _.$getRef(pos, s) + ':' + _.$getRef(pos, e);
      }).replace(/[a-z]+[\d]+/ig, function (cellIndex) {
        const _pos = _.$excelIndexToIndex(cellIndex);
        return _.$getRef(pos, _pos);
      });

      this.f_setCellFormula(pos, formula);
    },

    compileFormula(pos) {
      const cell = this.getPosCell(pos);
      const ref = this.formulaGraph.addRef(pos);
      if (cell.f.indexOf('#REF!') != -1) {
        ref.formula = eRef;
      } else {
        const code = _.$compileFormula(cell.f.substr(1));
        ref.formula = Formula.COMPILE(code);
      }
    },

    computedCellFormula(pos) {
      const ref = this.formulaGraph.getRef(pos);

      const v = ref.formula.call(null, {
        get: ref => {
          ref = ref.split('@');
          if (ref.length == 1) {
            const _pos = _.$formulaRefToIndex(ref[0]);
            _.$posAdd(_pos, pos);

            const c = this.getPosCell(_pos);
            return getCellRelValue(c);
          } else {

            const start = _.$formulaRefToIndex(ref[0]);
            const end = _.$formulaRefToIndex(ref[1]);
            const area = {
              start,
              end,
            };
            _.$posAdd(area, pos);

            const cs = this.getAreaExistCells(area);

            return _.map(cs, function (obj) {
              const c = obj.options;
              return getCellRelValue(c);
            });
          }
        },
      }, Formula);

      this.c_setCellV(pos, v);
    },
  },
};
