export const API_URL = import.meta.env.VITE_API_ENDPOINT
export const SHADELESS_VERSION = import.meta.env.VITE_SHADELESS_VERSION
export const INSTRUCTION_FILTER_URL = import.meta.env.VITE_INSTRUCTION_FILTER_ENDPOINT
export const INSTRUCTION_SHADELESS = import.meta.env.VITE_INSTRUCTION_SHADELESS
export interface ApiResponse<T> {
  statusCode: number;
  data: T;
  error: string;
}

export async function checkServerUp(): Promise<ApiResponse<string>> {
  return new Promise((resolve, reject) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    fetch(`${API_URL}/healthcheck`, { signal: controller.signal }).then(response => {
      resolve(response.json() as unknown as ApiResponse<string>);
    }).catch(err => reject(err));
  });
}

export enum FfufDetectType {
  TIME = 'time',
  NONE = 'none',
  KEYWORD = 'keyword',
  REFLECT = 'reflect',
}

export type FfufWordlist = {
  name: string;
  path: string;
}

export type FfufFuzzer = {
  name: string;
  wordlist: string;
  overwriteHeader: boolean;
  detect: FfufDetectType;
  detectValue?: string;
}

export type FfufSettingType = {
  proxy: string;
  thread: string | number;
  delay: string | number;
  wordlists: FfufWordlist[];
  fuzzers: FfufFuzzer[];
}
