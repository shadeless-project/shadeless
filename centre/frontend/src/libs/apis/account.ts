import { ApiResponse, API_URL } from "./types";

export enum AccountRole {
  NORMAL = 'normal',
  ADMIN = 'admin',
}
export interface Account {
  _id?: string;
  username: string;
  role: AccountRole;
  email: string;
  description: string;
  createdAt: Date;
}

export const defaultAccount: Account = {
  username: '',
  role: AccountRole.NORMAL,
  email: '',
  description: '',
  createdAt: new Date(),
}

export async function getAllAccounts (): Promise<ApiResponse<Account[]>> {
  const data = await fetch(`${API_URL}/accounts`);
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
  description: string,
  role: AccountRole,
): Promise<ApiResponse<string>> {
  const endpoint = `${API_URL}/accounts`;
  const data = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username,
      password,
      passwordRecheck,
      email,
      description,
      role,
    }),
  });
  return data.json() as unknown as ApiResponse<string>;
}

export async function deleteAccount (_id: string): Promise<ApiResponse<string>> {
  const endpoint = `${API_URL}/accounts/${_id}`;
  const data = await fetch(endpoint, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' }
  });
  return data.json() as unknown as ApiResponse<string>;
}

export async function resetPasswordAccount (_id: string, password: string, passwordRecheck: string): Promise<ApiResponse<string>> {
  const data = await fetch(`${API_URL}/accounts/${_id}/resetPassword`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password, passwordRecheck }),
  });
  return data.json() as unknown as ApiResponse<string>;
}

export async function editAccount (_id: string, username: string, email: string, description: string, role: AccountRole): Promise<ApiResponse<string>> {
  const data = await fetch(`${API_URL}/accounts/${_id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, description, role }),
  });
  return data.json() as unknown as ApiResponse<string>;
}
