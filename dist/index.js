'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var qs = require('qs');
var JSONbig = require('json-bigint');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var qs__default = /*#__PURE__*/_interopDefaultLegacy(qs);
var JSONbig__default = /*#__PURE__*/_interopDefaultLegacy(JSONbig);

var JSONBig = JSONbig__default['default']({
  storeAsString: true
});

function parseResponse(xhr) {
  var result;

  try {
    result = JSONBig.parse(xhr.responseText);
  } catch (e) {
    result = xhr.responseText;
  }

  return result;
}

function hasContentType(headers) {
  return Object.keys(headers).some(function (name) {
    return name.toLowerCase() === 'content-type';
  });
} // application/x-www-form-urlencoded / application/json


function setHeaders(xhr, headers) {
  headers = headers || {};

  if (!hasContentType(headers)) {
    headers['Content-Type'] = 'application/json';
  }

  Object.keys(headers).forEach(function (name) {
    if (headers[name]) {
      xhr.setRequestHeader(name, headers[name]);
    }
  });
}

function objectToQueryString(data) {
  return isObject(data) ? getQueryString(data) : data;
}

function isObject(data) {
  return Object.prototype.toString.call(data) === '[object Object]';
}

function getQueryString(object) {
  return qs__default['default'].stringify(object, {
    indices: false
  });
}

var fetch = function fetch(_ref) {
  var _ref$method = _ref.method,
      method = _ref$method === void 0 ? 'get' : _ref$method,
      _ref$url = _ref.url,
      url = _ref$url === void 0 ? '' : _ref$url,
      _ref$data = _ref.data,
      data = _ref$data === void 0 ? null : _ref$data,
      _ref$headers = _ref.headers,
      headers = _ref$headers === void 0 ? null : _ref$headers,
      _ref$withCredentials = _ref.withCredentials,
      withCredentials = _ref$withCredentials === void 0 ? true : _ref$withCredentials,
      _ref$responseParser = _ref.responseParser,
      responseParser = _ref$responseParser === void 0 ? parseResponse : _ref$responseParser,
      _ref$xhrSetting = _ref.xhrSetting,
      xhrSetting = _ref$xhrSetting === void 0 ? null : _ref$xhrSetting;
  var postData = '';

  if (method === 'get') {
    if (data) {
      url += "?".concat(objectToQueryString(data));
      data = null;
    }
  } else {
    if (headers && headers['Content-Type'] === 'application/x-www-form-urlencoded') {
      postData = objectToQueryString(data);
    } else {
      try {
        postData = JSON.stringify(data);
      } catch (ex) {}
    }
  }

  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();

    if (xhrSetting && isObject(xhrSetting)) {
      var props = Object.keys(xhrSetting);

      for (var _i = 0, _props = props; _i < _props.length; _i++) {
        var prop = _props[_i];
        xhr[prop] = xhrSetting[prop];
      }
    }

    xhr.open(method, url);
    xhr.withCredentials = withCredentials;
    setHeaders(xhr, headers);

    xhr.onload = function () {
      var res = responseParser(xhr);

      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(res);
      } else {
        reject({
          xhr: xhr
        });
      }
    };

    xhr.onerror = reject;
    xhr.send(postData);
  });
};

var fetchGen = function fetchGen(method) {
  return function (url, data, headers) {
    return fetch({
      method: method,
      url: url,
      data: data,
      headers: headers
    });
  };
};

var get = fetchGen('get');
var post = fetchGen('post');
var put = fetchGen('put');
var del = fetchGen('delete');

exports.default = fetch;
exports.del = del;
exports.get = get;
exports.post = post;
exports.put = put;
