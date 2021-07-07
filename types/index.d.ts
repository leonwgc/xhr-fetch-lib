declare type XHRSetting = {
  responseType?: XMLHttpRequestResponseType;
  timeout?: number;
  [p: string]: unknown;
};
export declare type Options = {
  method?: 'get' | 'post' | 'put' | 'delete' | 'head';
  url: string;
  data?: Record<string, unknown> | string;
  headers?: Record<string, string>;
  withCredentials?: boolean;
  responseParser?: (xhr: XMLHttpRequest) => unknown;
  xhrSetting?: XHRSetting;
};
declare const fetch: ({
  method,
  url,
  data,
  headers,
  withCredentials,
  responseParser,
  xhrSetting,
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
