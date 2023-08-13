import { ApiResponse, API_URL } from './types';


export async function incFuzzedApiByOne(project: string, hash: string): Promise<ApiResponse<string>> {
  const resp = await fetch(`${API_URL}/ffuf/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      hash,
      project,
    }),
  });
  return resp.json() as unknown as ApiResponse<string>;
}
