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
  const result = await data.json() as unknown as ApiResponse<Account[]>;
  result.data = result.data.map(acc => ({
    ...acc,
    createdAt: new Date(acc.createdAt),
  }));
  return result;
}

export async function createNewAccount (
  username: string, 
  password: string, 
  passwordRecheck: string, 
  email: string,
  role: AccountRole,
): Promise<ApiResponse<string>> {
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
      email,
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

export async function resetPasswordAccount (_id: string, password: string, passwordRecheck: string): Promise<ApiResponse<string>> {
  const endpoint = `${API_URL}/accounts/${_id}/resetPassword`;
  const data = await fetch(endpoint, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('authorization') || '',
    },
    body: JSON.stringify({ password, passwordRecheck }),
  });
  return data.json() as unknown as ApiResponse<string>;
}
