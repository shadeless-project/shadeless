import { ApiResponse, API_URL } from "./types";

export enum AccountRole {
  NORMAL = 'normal',
  ADMIN = 'admin',
}
export interface Account {
  _id?: string;
  username: string;
  password: string;
  role: AccountRole;
}

export async function getAllAccounts (): Promise<ApiResponse<Account[]>> {
  const endpoint = `${API_URL}/accounts`;
  const data = await fetch(endpoint, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('authorization') || '',
    },
  });
  return data.json() as unknown as ApiResponse<Account[]>;
}
