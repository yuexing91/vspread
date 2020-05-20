import CellsChange from './CellsChange';
import Copy from './Copy';
import Cut from './Cut';
import MergeCell from './MergeCell';
import DelColumn from './DelColumn';
import InsterColumn from './InsterColumn';
import DelRow from './DelRow';
import InsterRow from './InsterRow';
import StyleChange from './StyleChange';
import RCChange from './RCChange';
import RCStyleChange from './RCStyleChange';

export default {
  getRecord(type){

    switch (type) {
      case 'cut' :
        return Cut;
      case 'copy' :
        return Copy;
      case 'mergeCell' :
        return MergeCell;
      case 'delColumn' :
        return DelColumn;
      case 'insterColumn' :
        return InsterColumn;
      case 'delRow' :
        return DelRow;
      case 'insterRow' :
        return InsterRow;
      case 'styleChange' :
        return StyleChange;
      case 'RCStyleChange' :
        return RCStyleChange;
      case 'RCChange' :
        return RCChange;
      default:
        return CellsChange;
    }
  },
};
