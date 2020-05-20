import layoutMixin from './layout';
import selectionMixin from './selection';
import sizeMixin from './size';
import contextMenuMixin from './contextMenu';
import operationMixin from './operation';
//import keyMapMixin from './keyMap';
import mergeMixin from './merge';
import cellMixin from './cell';
import brushFillMixin from './brushFill';
import formula from './formula';
import recordChange from './recordChange';
import api from './api';
import grid from './grid';
import gridRows from './gridRows';
import styles from './styles';

export const mixins = [
  layoutMixin,
  cellMixin,
  selectionMixin,
  sizeMixin,
  contextMenuMixin,
  operationMixin,
//  keyMapMixin,
  mergeMixin,
  brushFillMixin,
  formula,
  recordChange,
  api,
  grid,
  gridRows,
  styles,
];
