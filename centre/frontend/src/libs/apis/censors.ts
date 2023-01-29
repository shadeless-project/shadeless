import { ApiResponse, API_URL } from './types';

export enum CensorType {
  ALL = 'all',
  ONE = 'one',
}
export interface Censor {
  _id?: string;
  project?: string;
  condition: any;
  type: CensorType;
}

export const defaultCensor = {
  _id: '',
  project: '',
  condition: {
    method: '',
    origin: '',
    path: '',
  },
  type: CensorType.ONE,
}
export const CENSOR_CONDITION = ['method', 'origin', 'path'];

export async function getCensors(projectName: string): Promise<ApiResponse<Censor[]>> {
  const endpoint = `${API_URL}/censors?project=${projectName}`;
  const resp = await fetch(endpoint, {
    headers: {
      Authorization: localStorage.getItem('authorization') || '',
    }
  });
  return resp.json() as unknown as ApiResponse<Censor[]>;
}

export async function createCensor(project: string, condition: any, isAll: boolean): Promise<ApiResponse<string>> {
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
