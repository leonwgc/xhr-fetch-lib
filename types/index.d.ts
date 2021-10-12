export { default as upload } from './upload';
declare type XHRSetting = {
    responseType?: XMLHttpRequestResponseType;
    timeout?: number;
};
export declare type Options = {
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
declare const fetch: ({ method, url, data, headers, withCredentials, responseParser, xhrSetting, }: Options) => Promise<Record<string, unknown> | string>;
export default fetch;
declare type simpleRequest = (
/** 请求url */
url: string, 
/** 请求数据, 对于get请求，data用object默认会转为 key=value&key1=value1的格式 */
data: Record<string, unknown> | string, 
/** 请求头 */
headers: Record<string, string>) => Promise<Record<string, unknown> | string>;
/** get请求 */
export declare const get: simpleRequest;
/** post请求 */
export declare const post: simpleRequest;
/** put请求 */
export declare const put: simpleRequest;
/** delete请求 */
export declare const del: simpleRequest;
