import { ApiResponse, API_URL } from "./types";

export enum AccountRole {
  NORMAL = 'normal',
  ADMIN = 'admin',
}
export interface Account {
  _id?: string;
  username: string;
  role: AccountRole;
  createdAt: Date;
}

export const defaultAccount: Account = {
  username: '',
  role: AccountRole.NORMAL,
  createdAt: new Date(),
}

export async function getAllAccounts (): Promise<ApiResponse<Account[]>> {
  const endpoint = `${API_URL}/accounts`;
  const data = await fetch(endpoint, {
    method: 'GET',
    headers: { 'Authorization': localStorage.getItem('authorization') || '' },
  });
  return data.json() as unknown as ApiResponse<Account[]>;
}

export async function createNewAccount (username: string, password: string, passwordRecheck: string, role: AccountRole): Promise<ApiResponse<string>> {
  const endpoint = `${API_URL}/accounts`;
  const data = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('authorization') || '',
    },
    body: JSON.stringify({
      username,
      password,
      passwordRecheck,
      role,
    }),
  });
  return data.json() as unknown as ApiResponse<string>;
}

export async function deleteAccount (_id: string): Promise<ApiResponse<string>> {
  const endpoint = `${API_URL}/accounts/${_id}`;
  const data = await fetch(endpoint, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('authorization') || '',
    }
  });
  return data.json() as unknown as ApiResponse<string>;
}
