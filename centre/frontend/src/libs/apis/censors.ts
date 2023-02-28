import { ApiResponse, API_URL } from './types';

export enum CensorType {
  ALL = 'all',
  ONE = 'one',
}
export interface Censor {
  _id?: string;
  project?: string;
  condition: any;
  description: string;
  type: CensorType;
  createdAt: Date,
}

export const defaultCensor: Censor = {
  _id: '',
  project: '',
  condition: {
    method: '',
    origin: '',
    path: '',
  },
  description: '',
  type: CensorType.ONE,
  createdAt: new Date(),
}
export const CENSOR_CONDITION = ['method', 'origin', 'path'];

export async function getCensors(projectName?: string): Promise<ApiResponse<Censor[]>> {
  const endpoint = `${API_URL}/censors?project=${projectName}`;
  const resp = await fetch(endpoint, {
    headers: {
      Authorization: localStorage.getItem('authorization') || '',
    }
  });
  const result = await resp.json() as unknown as ApiResponse<Censor[]>;
  result.data = result.data.map(p => ({
    ...p,
    createdAt: new Date(p.createdAt),
  }));
  return result;
}

export async function createCensor(project: string | undefined, condition: any, description: string, isAll: boolean): Promise<ApiResponse<string>> {
  const endpoint = `${API_URL}/censors`;
  const resp = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: localStorage.getItem('authorization') || '',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      condition,
      project,
      description,
      type: isAll ? CensorType.ALL : CensorType.ONE,
    }),
  });
  return resp.json() as unknown as ApiResponse<string>;
}

export async function deleteCensor(_id: string): Promise<ApiResponse<string>> {
  const endpoint = `${API_URL}/censors/${_id}`;
  const resp = await fetch(endpoint, {
    method: 'DELETE',
    headers: {
      Authorization: localStorage.getItem('authorization') || '',
    },
  });
  return resp.json() as unknown as ApiResponse<string>;
}

export async function editCensor(_id: string, condition: any, description: string): Promise<ApiResponse<string>> {
  const endpoint = `${API_URL}/censors/${_id}`;
  const resp = await fetch(endpoint, {
    method: 'PUT',
    headers: {
      Authorization: localStorage.getItem('authorization') || '',
    },
    body: JSON.stringify({ condition, description }),
  });
  return resp.json() as unknown as ApiResponse<string>;
}
