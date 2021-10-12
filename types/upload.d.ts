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
