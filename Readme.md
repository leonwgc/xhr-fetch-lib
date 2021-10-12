
简单好用的 xhr 请求库，包含 get,post,put,delete, upload 文件上传方法

1.安装 [npm](https://npmjs.org/) / [yarn](https://yarnpkg.com) 安装

```js
npm install xhr-fetch-lib
yarn add xhr-fetch-lib
```

2.ts类型定义

- 默认导出的fetch

```js
declare const fetch: ({ method, url, data, headers, withCredentials, responseParser, xhrSetting, }: Options) => Promise<Record<string, unknown> | string>;

export declare type Options = {
    /** 请求方法 */
    method?: 'get' | 'post' | 'put' | 'delete' | 'head';
    /** 请求url */
    url: string;
    /** 请求数据,对于get请求，data用object默认会转为 key=value&key1=value1的格式 */
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

export default fetch;

```

- get/post/put/delete 方法

```js
declare type simpleRequest = (
/** 请求url */
url: string,
/** 请求数据, 对于get请求，data用object默认会转为 key=value&key1=value1的格式 */
data: Record<string, unknown> | string,
/** 请求头 */
headers: Record<string, string>) => Promise<Record<string, unknown> | string>;

export declare const get: simpleRequest;
export declare const post: simpleRequest;
export declare const put: simpleRequest;
export declare const del: simpleRequest;

```

- upload文件上传

```js
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
export default function upload(url: string, data: Record<string, unknown> | null, file: File | Blob, headers?: Record<string, string> | null, onProgress?: (e: ProgressEvent & {
    percent: number;
}) => void): Promise<XMLHttpRequest>;
```

3. 使用示例

```js
import fetch, { get, post, put, del, upload } from 'xhr-fetch-lib';

// 直接调用get post put del
get(apiUrl).then((res) => {
  responseHandler(res);
});

// 用fetch设置返回blob实现下载
fetch({
  url,
  method,
  data,
  xhrSetting: { responseType: 'blob' },
  responseParser: (xhr) => xhr.response,
}).then((blob) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();
});

//文件上传
const file = e.target.files[0];
upload(api, { key: 'value' }, file, null, (e) => console.log(e.percent));
```

4. 返回值

默认是 json-bigint parse 的 object 对象 , 同 JSON.parse 返回值

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

5. 对于 get 请求，data 用 object 默认会转为 key=value&key1=value1 的格式

6. 默认导出的 fetch 函数，可以自定义 responseParser，默认是JSONBig.parse(xhr.responseText)

7. fetch 可以自定义 XMLHttpRequest 属性, 例如 responseType,timeout 等
