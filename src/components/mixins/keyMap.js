const keyCode = {
  'Backspace': 8,
  'Tab': 9,
  'Enter': 13,
  'Shift': 16,
  'Control': 17,
  'Alt': 18,
  'CapeLock': 20,
  'Esc': 27,
  'Space': 32,
  'PageUp': 33,
  'PageDown': 34,
  'End': 35,
  'Home': 36,
  'Left': 37,
  'Up': 38,
  'Right': 39,
  'Down': 40,
  'Insert': 45,
  'Delete': 46,
  'A': 65,
  'B': 66,
  'C': 67,
  'D': 68,
  'E': 69,
  'F': 70,
  'G': 71,
  'H': 72,
  'I': 73,
  'J': 74,
  'K': 75,
  'L': 76,
  'M': 77,
  'N': 78,
  'O': 79,
  'P': 80,
  'Q': 81,
  'R': 82,
  'S': 83,
  'T': 84,
  'U': 85,
  'V': 86,
  'W': 87,
  'X': 88,
  'Y': 89,
  'Z': 90,
  '0': 48,
  '1': 49,
  '2': 50,
  '3': 51,
  '4': 52,
  '5': 53,
  '6': 54,
  '7': 55,
  '8': 56,
  '9': 57,
  'N1': 96,
  'N2': 97,
  'N3': 98,
  'N4': 99,
  'N5': 100,
  'N6': 101,
  'N7': 102,
  'N8': 103,
  'N9': 104,
  'N0': 105,
  'N*': 106,
  'N+': 107,
  'NEnter': 108,
  'N-': 109,
  'N.': 110,
  'N/': 111,
  'F1': 112,
  'F2': 113,
  'F3': 114,
  'F4': 115,
  'F5': 116,
  'F6': 117,
  'F7': 118,
  'F8': 119,
  'F9': 120,
  'F10': 121,
  'F11': 122,
  'F12': 123,
  '=': 187,
  ',': 188,
  '-': 189,
  '.': 190,
  '/': 191,
  '`': 192,
  '[': 219,
  '|': 220,
  ']': 221,
  '"': 222,
};

export default {
  methods: {

    _handleKeyMap(e){
      const curSheet = this.getCurSheet();
      if (e.ctrlKey && !e.altKey && !e.shiftKey) {
        switch (e.keyCode) {
          case keyCode.A:
            return;//全选ctrl + A
          case keyCode.C:
            curSheet.doCopySelection();
            return;// ctrl + C 复制
          case keyCode.V:
            curSheet.doPasteSelection();
            return;// ctrl + V 粘贴
          case keyCode.X:
            curSheet.doCutSelection();
            return;// ctrl + X 剪切
          case keyCode.Y:
            curSheet.doRedo();
            return;// ctrl + Y 重做
          case keyCode.Z:
            curSheet.doUndo();
            return;// ctrl + Z 撤销
        }
      } else if (!e.ctrlKey && !e.altKey && !e.shiftKey) {
        switch (e.keyCode) {
          case keyCode.Up:
            curSheet.doMoveSelected('up');
            return;
          case keyCode.Enter:
          case keyCode.Down:
            curSheet.doMoveSelected('down');
            return;
          case keyCode.Left:
            curSheet.doMoveSelected('left');
            return;
          case keyCode.Tab:
          case keyCode.Right:
            curSheet.doMoveSelected('right');
            return;
          case keyCode.Esc:
            curSheet.stopAction();
            return;
          case keyCode.Delete:
            curSheet.doDelSelectionVal();
            return;
        }
      }
      return true;
    },

    handleKeyMap(e){
      if (!this._handleKeyMap(e)) {
        e.preventDefault();
      }
    },
    handleParse(e){
    }
  },
};
