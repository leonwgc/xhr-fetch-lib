// upload 默认为post
export default function upload(
  url: string,
  data: Record<string, unknown> | null,
  file: File | Blob,
  headers?: Record<string, string> | null,
  onProgress?: (e: ProgressEvent & { percent: number }) => void
): Promise<XMLHttpRequest> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    if (typeof onProgress === 'function' && xhr.upload) {
      xhr.upload.onprogress = function progress(e: ProgressEvent & { percent: number }) {
        if (e.total > 0) {
          e.percent = (e.loaded / e.total) * 100;
        }
        onProgress(e);
      };
    }

    const formData = new FormData();

    if (data) {
      Object.keys(data).forEach((key) => {
        const value = data[key];
        if (Array.isArray(value)) {
          value.forEach((item) => {
            formData.append(`${key}[]`, item);
          });
          return;
        }

        formData.append(key, data[key] as string);
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

    if (headers && typeof headers === 'object') {
      Object.keys(headers).forEach((h) => {
        if (headers[h] !== null) {
          xhr.setRequestHeader(h, headers[h]);
        }
      });
    }

    xhr.send(formData);
  });
}
