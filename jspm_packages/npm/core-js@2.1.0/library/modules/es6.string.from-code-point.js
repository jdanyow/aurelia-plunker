/* */ 
var $export = require("./_export"),
    toIndex = require("./_to-index"),
    fromCharCode = String.fromCharCode,
    $fromCodePoint = String.fromCodePoint;
$export($export.S + $export.F * (!!$fromCodePoint && $fromCodePoint.length != 1), 'String', {fromCodePoint: function fromCodePoint(x) {
    var res = [],
        aLen = arguments.length,
        i = 0,
        code;
    while (aLen > i) {
      code = +arguments[i++];
      if (toIndex(code, 0x10ffff) !== code)
        throw RangeError(code + ' is not a valid code point');
      res.push(code < 0x10000 ? fromCharCode(code) : fromCharCode(((code -= 0x10000) >> 10) + 0xd800, code % 0x400 + 0xdc00));
    }
    return res.join('');
  }});
