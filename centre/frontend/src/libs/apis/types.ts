export const API_URL = import.meta.env.VITE_API_ENDPOINT
export const INSTRUCTION_FILTER_URL = import.meta.env.VITE_INSTRUCTION_FILTER_ENDPOINT
export const INSTRUCTION_EXT_URL = import.meta.env.VITE_INSTRUCTION_EXT_ENDPOINT
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
      resolve(response.json() as unknown as  ApiResponse<string>);
    }).catch(err => reject(err));
  });
}
