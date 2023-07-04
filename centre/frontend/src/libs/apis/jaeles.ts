import { ApiResponse, API_URL } from "./types";

export interface JaelesScanner {
  _id?: string;
  name: string;
  description: string;
  scanKeyword: string;
  createdAt: Date;
}

export interface ScanRun {
  _id?: string;
  project: string;
  scannerId: string;
  requestPacketId: string;
}
export const defaultJaelesScanner: JaelesScanner = {
  name: '',
  description: '',
  scanKeyword: '',
  createdAt: new Date(),
}

export async function getAllScanners (): Promise<ApiResponse<JaelesScanner[]>> {
  const data = await fetch(`${API_URL}/jaeles/scanners`);
  const result = await data.json() as unknown as ApiResponse<JaelesScanner[]>;
  result.data = result.data.map(scanner => ({
    ...scanner,
    createdAt: new Date(scanner.createdAt),
  }));
  return result;
}

export async function getAllSignatures (): Promise<ApiResponse<string[]>> {
  const data = await fetch(`${API_URL}/jaeles/signatures`);
  const result = await data.json() as unknown as ApiResponse<string[]>;
  return result;
}

export async function getOneSignature (name: string): Promise<ApiResponse<string>> {
  const data = await fetch(`${API_URL}/jaeles/signatures/${name}`);
  const result = await data.json() as unknown as ApiResponse<string>;
  return result;
}

export async function createNewScanner (
  name: string,
  description: string,
  scanKeyword: string,
): Promise<ApiResponse<string>> {
  const endpoint = `${API_URL}/jaeles/scanners`;
  const data = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name,
      description,
      scanKeyword,
    }),
  });
  return data.json() as unknown as ApiResponse<string>;
}

export async function deleteScanner (_id: string): Promise<ApiResponse<string>> {
  const endpoint = `${API_URL}/jaeles/scanners/${_id}`;
  const data = await fetch(endpoint, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' }
  });
  return data.json() as unknown as ApiResponse<string>;
}

export async function editScanner (_id: string, name: string, description: string, scanKeyword: string): Promise<ApiResponse<string>> {
  const data = await fetch(`${API_URL}/jaeles/scanners/${_id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, description, scanKeyword }),
  });
  return data.json() as unknown as ApiResponse<string>;
}

export async function triggerScanRun (requestPacketId: string, project: string, scannerId: string): Promise<ApiResponse<string>> {
  const data = await fetch(`${API_URL}/projects/${project}/scanRuns`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ requestPacketId, project, scannerId }),
  });
  return data.json() as unknown as ApiResponse<string>;
}

export async function getScanRuns (project: string): Promise<ApiResponse<ScanRun[]>> {
  const data = await fetch(`${API_URL}/projects/${project}/scanRuns`, {
    method: 'GET',
  });
  return data.json() as unknown as ApiResponse<ScanRun[]>;
}
