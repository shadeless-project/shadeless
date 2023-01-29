import { ApiResponse, API_URL } from './types';

export interface User {
  _id?: string,
  codeName: string,
  project: string,
  color: string,
}

export const defaultUser: User = {
  codeName: '',
  project: '',
  color: '',
};

export async function getProjectUsers(projectName: string): Promise<ApiResponse<User[]>> {
  const resp = await fetch(`${API_URL}/projects/${projectName}/users`, {
    headers: {
      'Authorization': localStorage.getItem('authorization') || '',
    }
  });
  return resp.json() as unknown as ApiResponse<User[]>;
}
