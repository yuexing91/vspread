import _ from 'lodash';

_.mixin({
  $setArrayItem(arr, index, val){
    if (index >= arr.length) {
      arr.length = index + 1;
    }
    arr.splice(index, 1, val);
  },
  $getArrayItem(arr, index, val){
    let item = arr[index];
    if (!item) {
      _.$setArrayItem(arr, index, val);
      return val;
    }
    return item;
  },
});
