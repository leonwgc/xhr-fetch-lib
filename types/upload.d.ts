export default function upload(
  url: string,
  data: Record<string, unknown> | null,
  file: File | Blob,
  headers?: Record<string, string> | null,
  onProgress?: (
    e: ProgressEvent & {
      percent: number;
    }
  ) => void
): Promise<XMLHttpRequest>;
