import { Packet, defaultPacket } from "./packets";
import { Project, defaultProject } from "./projects";
import { JaelesScanner, defaultJaelesScanner } from "./scanners";
import { API_URL, ApiResponse } from "./types";

export enum ScanRunStatus {
  RUNNING = 0,
  DONE = 1,
}

export function parseScanRunStatus(inp: ScanRunStatus): string {
  if (inp === ScanRunStatus.RUNNING) return 'Running';
  return 'Done';
}

export interface ScanRunDetail {
  _id: string;
  project: Project;
  scanner: JaelesScanner;
  packet: Packet;
  status: ScanRunStatus;
  createdAt: Date;
}

export const defaultScanRunDetail: ScanRunDetail = {
  _id: '',
  project: defaultProject,
  scanner: defaultJaelesScanner,
  packet: defaultPacket,
  status: ScanRunStatus.RUNNING,
}

export interface ScanRun {
  _id?: string;
  status: ScanRunStatus;
  project: string;
  scannerId: string;
  requestPacketId: string;
}

export const defaultScanRun: ScanRun = {
  _id: '',
  status: ScanRunStatus.RUNNING,
  project: '',
  scannerId: '',
  requestPacketId: '',
}

export async function triggerScanRun (requestPacketId: string, project: string, scannerId: string): Promise<ApiResponse<string>> {
  const data = await fetch(`${API_URL}/scanRuns`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ requestPacketId, project, scannerId }),
  });
  return data.json() as unknown as ApiResponse<string>;
}

export async function getProjectScanRuns (project: string): Promise<ApiResponse<ScanRunDetail[]>> {
  const data = await fetch(`${API_URL}/projects/${project}/scanRuns`, {
    method: 'GET',
  });
  const result = await data.json() as unknown as ApiResponse<ScanRunDetail[]>;
  result.data = result.data.map(p => ({
    ...p,
    createdAt: new Date(p.createdAt),
  }));
  return result;
}

export async function getScanRunDetail(id: string): Promise<ApiResponse<ScanRunDetail>> {
  const data = await fetch(`${API_URL}/scanRuns/${id}`, {
    method: 'GET',
  });
  return data.json() as unknown as ApiResponse<ScanRunDetail>;
}

export async function getScanRunLog(id: string): Promise<ApiResponse<string>> {
  const data = await fetch(`${API_URL}/scanRuns/${id}`, {
    method: 'GET',
  });
  return data.json() as unknown as ApiResponse<string>;
}
