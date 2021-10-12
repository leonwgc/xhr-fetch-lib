import qs from 'qs';
import JSONbig from 'json-bigint';

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

/**
 * 上传文件
 *
 * @export
 * @param {string} url api地址
 * @param {(Record<string, unknown> | null)} data 数据
 * @param {(File | Blob)} file 待上传文件
 * @param {(Record<string, string> | null)} [headers] 自定义请求头部
 * @param {((e: ProgressEvent & { percent: number }) => void)} [onProgress] 上传进度回调
 * @return {*}  {Promise<XMLHttpRequest>}
 */
function upload(url, data, file, headers, onProgress) {
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();

    if (typeof onProgress === 'function' && xhr.upload) {
      xhr.upload.onprogress = function progress(e) {
        if (e.total > 0) {
          e.percent = e.loaded / e.total * 100;
        }

        onProgress(e);
      };
    }

    var formData = new FormData();

    if (data) {
      Object.keys(data).forEach(function (key) {
        var value = data[key];

        if (Array.isArray(value)) {
          value.forEach(function (item) {
            formData.append("".concat(key, "[]"), item);
          });
          return;
        }

        formData.append(key, data[key]);
      });
    }

    formData.append('file' + Date.now(), file);
    xhr.onerror = reject;

    xhr.onload = function onload() {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(xhr);
      } else {
        reject(xhr);
      }
    };

    xhr.open('post', url);
    xhr.withCredentials = true;

    if (headers && _typeof(headers) === 'object') {
      Object.keys(headers).forEach(function (h) {
        if (headers[h] !== null) {
          xhr.setRequestHeader(h, headers[h]);
        }
      });
    }

    xhr.send(formData);
  });
}

/* eslint-disable no-undef */
var JSONBig = JSONbig({
  storeAsString: true
});
/**
 *  xhr返回处理
 *
 * @param {XMLHttpRequest} xhr
 * @return {*}  {Record<string, unknown>}
 */

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
}
/**
 *  request请求头设置, e.g. Content-Type: application/x-www-form-urlencoded / application/json
 *
 * @param {XMLHttpRequest} xhr
 * @param {Record<string, string>} headers
 */


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
  return qs.stringify(object, {
    indices: false
  });
}

/**
 * 基础请求
 *
 * @param {Options} {
 *   method = 'get',
 *   url = '',
 *   data = null,
 *   headers = null,
 *   withCredentials = true,
 *   responseParser = parseResponse,
 *   xhrSetting = null
 * }
 * @return {*}  {Promise<unknown>}
 */
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
/** get请求 */


var get = fetchGen('get');
/** post请求 */

var post = fetchGen('post');
/** put请求 */

var put = fetchGen('put');
/** delete请求 */

var del = fetchGen('delete');

export default fetch;
export { del, get, post, put, upload };
