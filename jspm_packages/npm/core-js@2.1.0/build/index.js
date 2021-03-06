/* */ 
"format cjs";
(function() {
  var Promise,
      ref$,
      list,
      experimental,
      libraryBlacklist,
      es5SpecialCase,
      banner,
      readFile,
      writeFile,
      unlink,
      join,
      webpack,
      temp;
  Promise = require("../library/fn/promise");
  ref$ = require("./config"), list = ref$.list, experimental = ref$.experimental, libraryBlacklist = ref$.libraryBlacklist, es5SpecialCase = ref$.es5SpecialCase, banner = ref$.banner;
  ref$ = require("fs"), readFile = ref$.readFile, writeFile = ref$.writeFile, unlink = ref$.unlink;
  join = require("path").join;
  webpack = require("webpack");
  temp = require("temp");
  module.exports = function(arg$) {
    var modules,
        ref$,
        blacklist,
        library,
        umd,
        this$ = this;
    modules = (ref$ = arg$.modules) != null ? ref$ : [], blacklist = (ref$ = arg$.blacklist) != null ? ref$ : [], library = (ref$ = arg$.library) != null ? ref$ : false, umd = (ref$ = arg$.umd) != null ? ref$ : true;
    return new Promise(function(resolve, reject) {
      (function() {
        var i$,
            x$,
            ref$,
            len$,
            y$,
            ns,
            name,
            j$,
            len1$,
            TARGET,
            this$ = this;
        if (this.exp) {
          for (i$ = 0, len$ = (ref$ = experimental).length; i$ < len$; ++i$) {
            x$ = ref$[i$];
            this[x$] = true;
          }
        }
        if (this.es5) {
          for (i$ = 0, len$ = (ref$ = es5SpecialCase).length; i$ < len$; ++i$) {
            y$ = ref$[i$];
            this[y$] = true;
          }
        }
        for (ns in this) {
          if (this[ns]) {
            for (i$ = 0, len$ = (ref$ = list).length; i$ < len$; ++i$) {
              name = ref$[i$];
              if (name.indexOf(ns + ".") === 0 && !in$(name, experimental)) {
                this[name] = true;
              }
            }
          }
        }
        if (library) {
          blacklist = blacklist.concat(libraryBlacklist);
        }
        for (i$ = 0, len$ = blacklist.length; i$ < len$; ++i$) {
          ns = blacklist[i$];
          for (j$ = 0, len1$ = (ref$ = list).length; j$ < len1$; ++j$) {
            name = ref$[j$];
            if (name === ns || name.indexOf(ns + ".") === 0) {
              this[name] = false;
            }
          }
        }
        TARGET = temp.path({suffix: '.js'});
        webpack({
          entry: list.filter(function(it) {
            return this$[it];
          }).map(function(it) {
            if (library) {
              return join(__dirname, '..', 'library', 'modules', it);
            } else {
              return join(__dirname, '..', 'modules', it);
            }
          }),
          output: {
            path: '',
            filename: TARGET
          }
        }, function(err, info) {
          if (err) {
            return reject(err);
          }
          readFile(TARGET, function(err, script) {
            if (err) {
              return reject(err);
            }
            unlink(TARGET, function(err) {
              var exportScript;
              if (err) {
                return reject(err);
              }
              if (umd) {
                exportScript = "// CommonJS export\nif(typeof module != 'undefined' && module.exports)module.exports = __e;\n// RequireJS export\nelse if(typeof define == 'function' && define.amd)define(function(){return __e});\n// Export to global object\nelse __g.core = __e;";
              } else {
                exportScript = "";
              }
              resolve("" + banner + "\n!function(__e, __g, undefined){\n'use strict';\n" + script + "\n" + exportScript + "\n}(1, 1);");
            });
          });
        });
      }.call(modules.reduce(function(memo, it) {
        memo[it] = true;
        return memo;
      }, {})));
    });
  };
  function in$(x, xs) {
    var i = -1,
        l = xs.length >>> 0;
    while (++i < l)
      if (x === xs[i])
        return true;
    return false;
  }
}).call(this);
