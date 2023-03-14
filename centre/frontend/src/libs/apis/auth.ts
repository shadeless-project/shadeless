import { AccountRole } from './account';
import { ApiResponse, API_URL } from './types';

export async function checkLogin (): Promise<ApiResponse<string>> {
  const endpoint = `${API_URL}/auth/`;
  const data = await fetch(endpoint);
  return data.json() as unknown as ApiResponse<string>;
}

type LoginResponseDto = {
  username: string;
  role: AccountRole;
  email: string;
  description: string;
}
export async function login (username: string, password: string): Promise<ApiResponse<LoginResponseDto>> {
  const endpoint = `${API_URL}/auth/login`;
  const data = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  return data.json() as unknown as ApiResponse<LoginResponseDto>;
}
