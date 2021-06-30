import qs from 'qs';
// JSON.parse/stringify with bigints support
import JSONbig from 'json-bigint';

const JSONBig = JSONbig({ storeAsString: true });

function parseResponse(xhr: XMLHttpRequest): unknown {
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

// application/x-www-form-urlencoded / application/json
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

export type Options = {
  method?: 'get' | 'post' | 'put' | 'delete' | 'head';
  url: string;
  data?: Record<string, unknown> | string;
  headers?: Record<string, string>;
  withCredentials?: boolean;
  responseParser?: (xhr: XMLHttpRequest) => unknown;
};

const fetch = ({
  method = 'get',
  url = '',
  data = null,
  headers = null,
  withCredentials = true,
  responseParser = parseResponse,
}: Options): Promise<unknown> => {
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

const fetchGen =
  (method: 'get' | 'post' | 'put' | 'delete' | 'head') =>
  (
    url: string,
    data: Record<string, unknown> | string | null,
    headers?: Record<string, string>
  ): Promise<unknown> => {
    return fetch({ method, url, data, headers });
  };

export const get = fetchGen('get');
export const post = fetchGen('post');
export const put = fetchGen('put');
export const del = fetchGen('delete');
