import { NUM_PACKETS_PER_PAGE } from "src/pages/LoggerApp/Logger/Logger";
import { Query2ObjectResult } from "../query.parser";
import { ApiResponse, API_URL } from "./types";

export interface Packet {
  _id?: string;
  requestPacketId: string;
  requestPacketPrefix: string;
  requestPacketIndex: number;

  toolName: string;
  method: string
  requestLength: number;
  requestHttpVersion: string;
  requestContentType: string;
  referer: string;
  protocol: string;
  origin: string;
  port: number;
  path: string;
  requestCookies: string;
  hasBodyParam: boolean;
  querystring: string;
  requestBodyHash: string;
  parameters: string[];
  requestHeaders: string[];

  responseStatus: number;
  responseContentType: string;
  responseStatusText: string;
  responseLength: number;
  responseMimeType: string;
  responseHttpVersion: string;
  responseInferredMimeType: string;
  responseCookies: string;
  responseBodyHash: string;
  responseHeaders: string[];

  rtt: number;
  reflectedParameters: Record<string, string>;
  codeName: string;
  count: number;

  createdAt: string;
  updatedAt?: string;

  staticScore: number;
}

export const defaultPacket: Packet = {
  requestPacketId: '',
  requestPacketIndex: 0,
  requestPacketPrefix: '',
  toolName: '',
  method: '',
  requestLength: 0,
  requestHttpVersion: '',
  requestContentType: '',
  referer: '',
  protocol: '',
  origin: '',
  port: 0,
  path: '',
  requestCookies: '',
  hasBodyParam: false,
  querystring: '',
  requestBodyHash: '',
  parameters: [],
  requestHeaders: [],

  responseStatus: 0,
  responseContentType: '',
  responseStatusText: '',
  responseLength: 0,
  responseMimeType: '',
  responseHttpVersion: '',
  responseInferredMimeType: '',
  responseCookies: '',
  responseBodyHash: '',
  responseHeaders: [],

  rtt: 0,
  reflectedParameters: {},
  codeName: '',
  count: 0,

  staticScore: 0,
  createdAt: '',
};

export async function getPackets(
  projectName: string,
  filter: Query2ObjectResult,
  offset: number = 0,
  limit: number = NUM_PACKETS_PER_PAGE,
  minimal: boolean = false,
): Promise<ApiResponse<Packet[]>> {
  const results = await fetch(`${API_URL}/projects/${projectName}/query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...filter,
      limit, offset,
      minimal,
    })
  });
  return results.json() as unknown as ApiResponse<Packet[]>;
}

export type DashboardPackets = {
  origins: string[] | null,
  numPackets : number | null,
  uniqueEndpoints: number | null,
  packetMost: Packet[] | null,
  packetMin: Packet[] | null,
  numAllPackets: number,
  numAllOrigins: number,
  numMostAppeared: number,
  numLeastAppeared: number,
}
export const defaultDashboardPacket: DashboardPackets = {
  origins: [],
  numPackets: 0,
  uniqueEndpoints: 0,
  packetMost: [],
  packetMin: [],
  numAllPackets: 0,
  numAllOrigins: 0,
  numMostAppeared: 0,
  numLeastAppeared: 0,
}
export enum DashboardAdditionalDataType {
  NUM_PACKETS,
  ORIGINS,
  UNIQUE_ENDPOINTS,
}
export type DashboardAdditionalDataDto = Omit<Query2ObjectResult, 'body' | 'requestBody' | 'responseBody'> & {
  type: DashboardAdditionalDataType
}
export async function getDashboardPackets(projectName: string, filter: Query2ObjectResult): Promise<ApiResponse<DashboardPackets>> {
  const results = await fetch(`${API_URL}/projects/${projectName}/query_mini_dashboard`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(filter)
  });
  return results.json() as unknown as ApiResponse<DashboardPackets>;
}
export async function getDashboardAdditionalData(projectName: string, filter: DashboardAdditionalDataDto): Promise<ApiResponse<any>> {
  const results = await fetch(`${API_URL}/projects/${projectName}/query_mini_dashboard_additional_data`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(filter)
  });
  return results.json() as unknown as ApiResponse<any>;
}
