//公式图
class FormulaGraph {
  constructor() {
    this.refs     = {};
    this.areaRefs = {};
  }

  addRef(pos) {
    let ref = this.getRef(pos);
    if (!ref) {
      ref               = new Ref(pos);
      this.refs[ref.id] = ref;
    }
    return ref;
  }

  getRef(pos) {
    return this.refs[Ref.createId(pos)];
  }

  /***
   * 获取依赖pos的refs
   * @param pos
   */
  getTargetRefs(pos) {
    const ref        = this.getRef(pos);
    const targetRefs = Object.assign({}, (ref || {}).targetRefs);
    _.each(this.areaRefs, areaRef => {
      const r = areaRef.area;
      if (_.$inArea(r, pos)) {
        Object.assign(targetRefs, areaRef.targetRefs);
      }
    });
    return targetRefs;
  }

  /***
   * 获取pos依赖的refs
   * @param pos
   */
  getSourceRefs(pos) {
    return _.mapKeys((this.getRef(pos) || {}).sourceRefs, function (ref) {
      return ref.id;
    });
  }

  /***
   * 获取pos依赖的areaRefs
   * @param pos
   */
  getSourceAreaRefs(pos) {
    return _.mapKeys((this.getRef(pos) || {}).sourceAreaRefs, function (ref) {
      return ref.id;
    });
  }

  /***
   * 删除pos的依赖
   * @param pos
   */
  removeSourceRefs(pos) {
    const ref = this.getRef(pos);
    if (!ref) {
      return;
    }
    _.each(ref.sourceRefs, from => {
      from.removeTarget(ref);
    });
    ref.sourceRefs = [];
  }

  removeRef(ref) {
    const targetRefs = _.values(ref.targetRefs);
    ref.remove();
    delete this.refs[ref.id];
    return targetRefs;
  }

  removeArea(area) {
    area.remove();
    delete this.areaRefs[area.id];
  }

  addLink(sourcePos, targetPos) {
    const source = this.addRef(sourcePos);
    const target = this.addRef(targetPos);

    source.addTarget(target);
    target.addSource(source);
  }

  updateId() {
    const refs     = {};
    const areaRefs = {};

    _.each(this.refs, function (ref) {
      if (!_.isEmpty(ref.sourceRefs) || !_.isEmpty(ref.sourceAreaRefs) || !_.isEmpty(ref.targetRefs)) {
        refs[ref.id] = ref;
      }
    });
    _.each(this.areaRefs, function (ref) {
      if (!_.isEmpty(ref.targetRefs)) {
        areaRefs[ref.id] = ref;
      }
    });

    this.refs     = refs;
    this.areaRefs = areaRefs;
  }

  addArea(area) {
    let areaRef = this.getArea(area);
    if (!areaRef) {
      areaRef                   = new AreaRef(area);
      this.areaRefs[areaRef.id] = areaRef;
    }
    return areaRef;
  }

  getArea(area) {
    return this.areaRefs[AreaRef.createId(area)];
  }

  addAreaLink(area, toId) {
    const areaRef   = this.addArea(area);
    const targetRef = this.addRef(toId);

    areaRef.addTarget(targetRef);
    targetRef.addSourceArea(areaRef);
  }

  static createAreaId(area) {
    return AreaRef.createId(area);
  }

}

let areaIndex = 0;

class AreaRef {
  constructor(area) {
    this.refId      = 'area_' + areaIndex++;
    this.id         = AreaRef.createId(area);
    this.oldId      = undefined;
    this.area       = area;
    this.targetRefs = [];
  }

  addTarget(target) {
    this.targetRefs.push(target);
  }

  removeTarget(target) {
    arrayRemoveItem(this.targetRefs, target);
  }

  updateArea(area) {
    this.oldId = this.id;
    this.id    = AreaRef.createId(area);
    this.area  = area;
  }

  remove() {
    _.each(this.targetRefs, node => {
      node.removeSourceArea(this);
    });
    this.id = null;
  }

  static createId(area) {
    return Ref.createId(area.start) + ':' + Ref.createId(area.end);
  }

}

let refIndex = 0;

class Ref {
  constructor(pos) {
    this.refId          = 'ref_' + refIndex++;
    this.id             = Ref.createId(pos);
    this.oldId          = undefined;
    this.pos            = Object.assign({}, pos);
    this.targetRefs     = [];
    this.sourceRefs     = [];
    this.sourceAreaRefs = [];
  }

  updatePos(pos) {
    this.oldId = this.id;
    this.id    = Ref.createId(pos);
    this.pos   = Object.assign({}, pos);
  }

  addTarget(target) {
    this.targetRefs.push(target);
  }

  addSource(source) {
    this.sourceRefs.push(source);
  }

  addSourceArea(area) {
    this.sourceAreaRefs.push(area);
  }

  remove() {
    _.each(this.targetRefs, ref => {
      ref.removeSource(this);
    });
    _.each(this.sourceRefs, ref => {
      ref.removeTarget(this);
    });

    _.each(this.sourceAreaRefs, ref => {
      ref.removeTarget(this);
    });
    this.id = null;
  }

  removeSource(source) {
    arrayRemoveItem(this.sourceRefs, source);
    if (source) {
      source.removeTarget(this);
    }
  }

  removeSourceArea(area) {
    arrayRemoveItem(this.sourceAreaRefs, area);
    if (area) {
      area.removeTarget(this);
    }
  }

  removeTarget(target) {
    arrayRemoveItem(this.targetRefs, target);
  }

  static createId(pos) {
    return _.$posToStr(pos);
  }

}

function arrayRemoveItem(arr, item) {
  const index = _.indexOf(arr, item);
  if (index > -1) {
    arr.splice(index, 1);
  }
}

export default FormulaGraph;
