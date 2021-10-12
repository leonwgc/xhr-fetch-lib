/* eslint-disable no-undef */
import qs from 'qs';
import JSONbig from 'json-bigint';
export { default as upload } from './upload';

const JSONBig = JSONbig({ storeAsString: true });
/**
 *  xhr返回处理
 *
 * @param {XMLHttpRequest} xhr
 * @return {*}  {Record<string, unknown>}
 */
function parseResponse(xhr: XMLHttpRequest): Record<string, unknown> | string {
  let result;

  try {
    result = JSONBig.parse(xhr.responseText);
  } catch (e) {
    result = xhr.responseText;
  }
  return result;
}

function hasContentType(headers: Record<string, string>) {
  return Object.keys(headers).some((name) => {
    return name.toLowerCase() === 'content-type';
  });
}

/**
 *  request请求头设置, e.g. Content-Type: application/x-www-form-urlencoded / application/json
 *
 * @param {XMLHttpRequest} xhr
 * @param {Record<string, string>} headers
 */
function setHeaders(xhr: XMLHttpRequest, headers: Record<string, string>) {
  headers = headers || {};
  if (!hasContentType(headers)) {
    headers['Content-Type'] = 'application/json';
  }
  Object.keys(headers).forEach((name) => {
    if (headers[name]) {
      xhr.setRequestHeader(name, headers[name]);
    }
  });
}
function objectToQueryString(data: Record<string, unknown> | string) {
  return isObject(data) ? getQueryString(<Record<string, unknown>>data) : data;
}

function isObject(data) {
  return Object.prototype.toString.call(data) === '[object Object]';
}

function getQueryString(object: Record<string, unknown>) {
  return qs.stringify(object, { indices: false });
}

type XHRSetting = {
  responseType?: XMLHttpRequestResponseType;
  timeout?: number;
};

export type Options = {
  /** 请求方法 */
  method?: 'get' | 'post' | 'put' | 'delete' | 'head';
  /** 请求url */
  url: string;
  /** 请求数据,对于get请求， data用object默认会转为 key=value&key1=value1的格式 */
  data?: Record<string, unknown> | string;
  /** 请求头 */
  headers?: Record<string, string>;
  /** withCredentials设置，默认true */
  withCredentials?: boolean;
  /** 处理xhr响应 */
  responseParser?: (xhr: XMLHttpRequest) => Record<string, unknown> | string;
  /** xhr设置，e.g. responseType,timeout等设置  */
  xhrSetting?: XHRSetting;
};
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
const fetch = ({
  method = 'get',
  url = '',
  data = null,
  headers = null,
  withCredentials = true,
  responseParser = parseResponse,
  xhrSetting = null,
}: Options): Promise<Record<string, unknown> | string> => {
  let postData: string | Record<string, unknown> = '';
  if (method === 'get') {
    if (data) {
      url += `?${objectToQueryString(data)}`;
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

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    if (xhrSetting && isObject(xhrSetting)) {
      const props = Object.keys(xhrSetting);
      for (const prop of props) {
        xhr[prop] = xhrSetting[prop];
      }
    }
    xhr.open(method, url);
    xhr.withCredentials = withCredentials;
    setHeaders(xhr, headers);
    xhr.onload = () => {
      const res = responseParser(xhr);
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(res);
      } else {
        reject({ xhr });
      }
    };
    xhr.onerror = reject;
    xhr.send(postData as string);
  });
};

export default fetch;

type simpleRequest = (
  /** 请求url */
  url: string,
  /** 请求数据, 对于get请求，data用object默认会转为 key=value&key1=value1的格式 */
  data: Record<string, unknown> | string,
  /** 请求头 */
  headers: Record<string, string>
) => Promise<Record<string, unknown> | string>;

const fetchGen =
  (method: 'get' | 'post' | 'put' | 'delete' | 'head'): simpleRequest =>
  (
    url: string,
    data: Record<string, unknown> | string | null,
    headers?: Record<string, string>
  ): Promise<Record<string, unknown> | string> => {
    return fetch({ method, url, data, headers });
  };
/** get请求 */
export const get: simpleRequest = fetchGen('get');
/** post请求 */
export const post: simpleRequest = fetchGen('post');
/** put请求 */
export const put: simpleRequest = fetchGen('put');
/** delete请求 */
export const del: simpleRequest = fetchGen('delete');
