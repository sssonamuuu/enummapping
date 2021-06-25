/** @license enummapping v1.0.13
 * enummapping.js
 * 
 * Copyright (c) sonamu.liao<liaoqingsong@front-end.com.cn>
 * 
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.enummapping = factory());
}(this, (function () { 'use strict';

    var assign = function assign() {
      var to = {};

      for (var index = 0; index < arguments.length; index++) {
        var nextSource = arguments[index];

        if (nextSource !== null && nextSource !== void 0) {
          for (var nextKey in nextSource) {
            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
              to[nextKey] = nextSource[nextKey];
            }
          }
        }
      }

      return to;
    };

    function isArray(obj) {
      return Object.prototype.toString.call(obj) === '[object Array]';
    }

    function includes(array, target) {
      for (var i = 0; i < array.length; i++) {
        if (array[i] === target) {
          return true;
        }
      }

      return false;
    }

    var buidInEnumKeys = ['$list', '$map', '$options'];
    var buildInBuildItemKeys = ['is', 'eq', 'in', '$is', '$eq', '$in'];
    function enummapping(data) {
      var keyRes = {};
      var codeRes = {};

      var _loop = function _loop(key) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          var value = data[key];

          if (includes(buidInEnumKeys, key)) {
            throw new Error("The built-in property \"".concat(key, "\" cannot be used!"));
          }

          if (!value || !('code' in value)) {
            throw new Error("Code must be specified!");
          }

          for (var i = 0; i < buildInBuildItemKeys.length; i++) {
            if (buildInBuildItemKeys[i] in value) {
              throw new Error("The built-in property \"".concat(buildInBuildItemKeys[i], "\" cannot be used!"));
            }
          }

          if (codeRes["".concat(value.code)]) {
            throw new Error("The code \"".concat(value.code, "\" has been used!"));
          }

          var itemBuildIn = {
            eq: function eq(c) {
              return c === value.code;
            },
            is: function is(k) {
              return k === key;
            },
            "in": function _in(ks) {
              return includes(ks, key);
            },
            $eq: function $eq(c) {
              return c === value.code;
            },
            $is: function $is(k) {
              return k === key;
            },
            $in: function $in(ks) {
              return includes(ks, key);
            }
          };
          var item = assign(value, itemBuildIn);
          keyRes[key] = item;
          codeRes["".concat(value.code)] = item;
        }
      };

      for (var key in data) {
        _loop(key);
      }

      var enumBuildIn = {
        $list: function $list() {
          var excludes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
          var res = [];
          var excludesArr = isArray(excludes) ? excludes : [excludes];

          for (var _key in keyRes) {
            if (Object.prototype.hasOwnProperty.call(keyRes, _key)) {
              var value = keyRes[_key];

              if (!value.$exclude && !value.$in(excludesArr)) {
                res.push(value);
              }
            }
          }

          return res.sort(function (a, b) {
            return (a.$sort || 0) - (b.$sort || 0);
          });
        },
        $map: function $map(fn) {
          var excludes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

          if (typeof fn !== 'function') {
            throw new Error('is not a function!');
          }

          var res = [];
          var list = this.$list(excludes);

          for (var i = 0; i < list.length; i++) {
            res.push(fn(list[i]));
          }

          return res;
        },
        $options: function $options() {
          var excludes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
          return this.$map(function (item) {
            return {
              label: item.label || "".concat(item.code),
              value: item.code
            };
          }, excludes);
        }
      };
      return assign(keyRes, codeRes, enumBuildIn);
    }

    return enummapping;

})));
