# xhr-fetch-lib

封装了 xhr 请求，导出简单的 get,post,put,del 请求方法

1. 安装 ,[npm](https://npmjs.org/) / [yarn](https://yarnpkg.com) 安装

```js
npm install xhr-fetch-lib
yarn add xhr-fetch-lib
```

2. 使用

```js
import fetch, { get, post, put, del } from 'xhr-fetch-lib';

get(apiUrl).then((res) => {
  responseHandler(res);
});

fetch({ method: 'get', url: apiUrl }).then((res) => {
  responseHandler(res);
});
```

3. typescript 类型定义

```js
export declare type Options = {
  method?: 'get' | 'post' | 'put' | 'delete' | 'head';
  url: string;
  data?: Record<string, unknown> | string;
  headers?: Record<string, string>;
  withCredentials?: boolean;
  responseParser?: (xhr: XMLHttpRequest) => unknown;
};

declare const fetch: ({
  method,
  url,
  data,
  headers,
  withCredentials,
  responseParser,
  xhrSetting?: XHRSetting;
}: Options) => Promise<unknown>;


export default fetch;

export declare const get: (
  url: string,
  data: Record<string, unknown> | string | null,
  headers?: Record<string, string>
) => Promise<unknown>;


export declare const post: (
  url: string,
  data: Record<string, unknown> | string | null,
  headers?: Record<string, string>
) => Promise<unknown>;


export declare const put: (
  url: string,
  data: Record<string, unknown> | string | null,
  headers?: Record<string, string>
) => Promise<unknown>;


export declare const del: (
  url: string,
  data: Record<string, unknown> | string | null,
  headers?: Record<string, string>
) => Promise<unknown>;

```

4. 返回值

默认是 json-bigint parse 的 object 对象 , 同 JSON.parse 返回值。

```js
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
```

5. 对于 get 请求， data 用 object key-value 对， 默认会转为 key=value&key1=value1 的格式， 也可以传入 key=value 字符串格式

6. 默认导出的 fetch 函数， 可以自定义 responseParser ， 默认是 json-bigint.parse responseText, 也可以自定义 XMLHttpRequest 属性, 例如 responseType,timeout 等
