export declare type Options = {
  method?: 'get' | 'post' | 'put' | 'delete' | 'head';
  url: string;
  data?: Record<string, unknown> | null;
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
}: Options) => Promise<unknown>;
export default fetch;
export declare const get: (
  url: string,
  data: Record<string, unknown> | null,
  headers?: Record<string, string>
) => Promise<unknown>;
export declare const post: (
  url: string,
  data: Record<string, unknown> | null,
  headers?: Record<string, string>
) => Promise<unknown>;
export declare const put: (
  url: string,
  data: Record<string, unknown> | null,
  headers?: Record<string, string>
) => Promise<unknown>;
export declare const del: (
  url: string,
  data: Record<string, unknown> | null,
  headers?: Record<string, string>
) => Promise<unknown>;
