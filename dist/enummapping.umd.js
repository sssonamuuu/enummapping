/** @license enummapping v1.0.5
 * enummapping.umd.js
 * 
 * Copyright (c) sonamu.liao<liaoqingsong@front-end.com.cn>
 * 
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('core-js/modules/es.object.keys.js'), require('core-js/modules/es.symbol.js'), require('core-js/modules/es.object.get-own-property-descriptor.js'), require('core-js/modules/es.array.for-each.js'), require('core-js/modules/web.dom-collections.for-each.js'), require('core-js/modules/es.object.get-own-property-descriptors.js'), require('core-js/modules/es.object.define-properties.js'), require('core-js/modules/es.object.define-property.js'), require('core-js/modules/es.object.entries.js'), require('core-js/modules/es.array.includes.js'), require('core-js/modules/es.array.concat.js'), require('core-js/modules/es.string.includes.js'), require('core-js/modules/es.array.sort.js'), require('core-js/modules/es.array.filter.js'), require('core-js/modules/es.object.values.js'), require('core-js/modules/es.array.is-array.js'), require('core-js/modules/es.array.map.js')) :
  typeof define === 'function' && define.amd ? define(['core-js/modules/es.object.keys.js', 'core-js/modules/es.symbol.js', 'core-js/modules/es.object.get-own-property-descriptor.js', 'core-js/modules/es.array.for-each.js', 'core-js/modules/web.dom-collections.for-each.js', 'core-js/modules/es.object.get-own-property-descriptors.js', 'core-js/modules/es.object.define-properties.js', 'core-js/modules/es.object.define-property.js', 'core-js/modules/es.object.entries.js', 'core-js/modules/es.array.includes.js', 'core-js/modules/es.array.concat.js', 'core-js/modules/es.string.includes.js', 'core-js/modules/es.array.sort.js', 'core-js/modules/es.array.filter.js', 'core-js/modules/es.object.values.js', 'core-js/modules/es.array.is-array.js', 'core-js/modules/es.array.map.js'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.enummapping = factory());
}(this, (function () { 'use strict';

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    var _i = arr && (typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]);

    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;

    var _s, _e;

    try {
      for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
  function enummapping(data) {
    var buidInKeys = ['$list', '$map'];
    var keyRes = {};
    var codeRes = {};

    var _loop = function _loop() {
      var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
          k = _Object$entries$_i[0],
          v = _Object$entries$_i[1];

      if (buidInKeys.includes(k)) {
        throw new Error("\"".concat(k, "\"\u4E3A\u5185\u7F6E\u5C5E\u6027\uFF0C\u4E0D\u80FD\u4F5C\u4E3A\u679A\u4E3E\u503C\u7684key\uFF01"));
      }

      if (codeRes["".concat(v.code)]) {
        throw new Error("\"".concat(k, "\"\u7684code\u503C\"").concat(v.code, "\"\u5DF2\u88AB\u4F7F\u7528\uFF01"));
      }

      var item = _objectSpread(_objectSpread({}, v), {}, {
        eq: function eq(code) {
          return code === v.code;
        },
        is: function is(key) {
          return key === k;
        },
        "in": function _in(keys) {
          return keys.includes(k);
        }
      });

      keyRes[k] = item;
      codeRes["".concat(v.code)] = item;
    };

    for (var _i = 0, _Object$entries = Object.entries(data); _i < _Object$entries.length; _i++) {
      _loop();
    }

    var res = _objectSpread(_objectSpread(_objectSpread({}, keyRes), codeRes), {}, {
      $list: function $list() {
        var excludes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
        return Object.values(keyRes).filter(function (item) {
          return !item["in"](Array.isArray(excludes) ? excludes : [excludes]) && !item.$exclude;
        }).sort(function (a, b) {
          var _a$$sort, _b$$sort;

          return ((_a$$sort = a.$sort) !== null && _a$$sort !== void 0 ? _a$$sort : 0) - ((_b$$sort = b.$sort) !== null && _b$$sort !== void 0 ? _b$$sort : 0);
        });
      },
      $map: function $map(fn, excludes) {
        return this.$list(excludes).map(fn);
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
    });

    return res;
  }

  return enummapping;

})));
