/* */ 
var isObject = require("./_is-object"),
    meta = require("./_meta").onFreeze;
require("./_object-sap")('preventExtensions', function($preventExtensions) {
  return function preventExtensions(it) {
    return $preventExtensions && isObject(it) ? $preventExtensions(meta(it)) : it;
  };
});
