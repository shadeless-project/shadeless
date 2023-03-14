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
  const resp = await fetch(endpoint);
  const result = await resp.json() as unknown as ApiResponse<Censor[]>;
  result.data = result.data.map(p => ({
    ...p,
    createdAt: new Date(p.createdAt),
  }));
  return result;
}

export async function createCensor(project: string | undefined, condition: any, description: string, isAll: boolean): Promise<ApiResponse<string>> {
  const resp = await fetch(`${API_URL}/censors`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
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
  const resp = await fetch(`${API_URL}/censors/${_id}`, { method: 'DELETE' });
  return resp.json() as unknown as ApiResponse<string>;
}

export async function editCensor(_id: string, project: string, condition: any, description: string, type: CensorType): Promise<ApiResponse<string>> {
  const resp = await fetch(`${API_URL}/censors/${_id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ project, condition, description, type }),
  });
  return resp.json() as unknown as ApiResponse<string>;
}
