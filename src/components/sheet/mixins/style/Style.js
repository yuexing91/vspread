import _ from 'lodash';

let idIndex = 0;

const verticalAlignClass = {
  'middle': 'meg-cellval-vam',
  'top': 'meg-cellval-vat',
  'bottom': 'meg-cellval-vab',
};

const textAlignClass = {
  'left-nowrap': 'meg-cellval-lnow',
  'center-nowrap': 'meg-cellval-cnow',
  'right-nowrap': 'meg-cellval-rnow',
  'left-normal': 'meg-cellval-lnor',
  'center-normal': 'meg-cellval-cnor',
  'right-normal': 'meg-cellval-rnor',
};

class Style {

  static getDefault() {
    return new Style({}, 's0');
  }


  static createId() {
    return `s${ ++idIndex }`;
  }

  constructor(option, id) {
    if (id) {
      const i = Math.max(idIndex, +id.substring(1));
      idIndex = _.isNaN(i) ? idIndex : i;
    } else {
      id = Style.createId();
    }
    this.id = id;
    this.option = option;
  }

  setOption(option) {
    Object.assign(this.option, option);
  }

  getOption(key) {
    return this.option[key];
  }

  getAlignment(styles) {

    const option = _.defaults({}, this.option, ..._.map(styles, 'option'));

    const vClass = verticalAlignClass[option.verticalAlign || 'bottom'];
    const tClass = textAlignClass[( option.textAlign || 'left' ) + '-' + ( option.whiteSpace || 'nowrap' )];
    return [vClass, tClass];
  }

  getStyle(baseStyle, styles) {
    const option = _.defaults({}, this.option, ..._.map(styles, 'option'));
    const style = createCss(option);

    //合并单元格需要给个默认颜色
    if (baseStyle.merge) {
      _.defaults(style, {
        backgroundColor: '#fff',
        zIndex: 2,
      });
    }
    style.top = `${ ( style.top || 0 ) + ( baseStyle.top || 0 ) }px`;
    style.left = `${ ( style.left || 0 ) + baseStyle.left }px`;
    style.width = `${ baseStyle.width }px`;
    if (baseStyle.height) {
      style.height = `${ baseStyle.height }px`;
    }
    return style;
  }

  clone(id) {
    return new Style(_.cloneDeep(this.option), id ? this.id : undefined);
  }

  equals(other) {
    return _.isEqual(this.option, other.option);
  }

  toJSON() {
    return JSON.stringify(this.option);
  }

}

function createCss(option) {

  const style = {};

  let left = 0;
  let top = 0;

  const handlers = {
    textAlign: 'none',
    verticalAlign: 'none',
    whiteSpace: 'none',
    border(borders) {
      _.each(borders, function (pos) {
        style[`border-${ POS[pos] }`] = '1px solid #000';
      });
    },
    fontSize: 'pt',
  };

  _.each(option, (value, key) => {
    const handle = handlers[key];
    if (handle === 'none') {
      return;
    }
    if (_.isFunction(handle)) {
      handle(value);
    } else if (_.isString(handle)) {
      Object.assign(style, { [key]: value + handle });
    } else {
      Object.assign(style, {
        [key]: value,
      });
    }
  });

  let border = option.border;

  //存在背景颜色位置-1 同时增加padding
  if (border) {
    left--;
    top--;
    Object.assign(style, paddingStyle(option));
  } else if (border) {
    //存在上边框
    if (border.indexOf('t') > -1) {
      top--;
    }
    //存在左边框
    if (border.indexOf('l') > -1) {
      left--;
    }
    Object.assign(style, paddingStyle(option));
  }

  Object.assign(style,
    { left, top },
  );

  return style;
}

function paddingStyle(option) {
  const style = {};
  const border = option.border || '';
  _.each(['t', 'l', 'r', 'b'], (pos) => {
    if (border.indexOf(pos) == -1) {
      style[`padding-${ POS[pos] }`] = '1px';
    }
  });
  return style;
}

const POS = {
  'b': 'bottom',
  'l': 'left',
  'r': 'right',
  't': 'top',
};


export default Style;
