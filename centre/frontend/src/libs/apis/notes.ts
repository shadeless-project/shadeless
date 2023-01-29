import storage from 'src/libs/storage';
import { Packet } from './packets';
import { ApiResponse, API_URL } from './types';

export interface Note {
  _id?: string,
  codeName: string,
  tags: string,
  description: string,
  requestPacketId: string,
  updatedAt?: Date,
  createdAt?: Date,
}

export type ModalNote = Note & {
  path: string;
};

export const defaultNote: Note = {
  codeName: '',
  tags: '',
  description: '',
  requestPacketId: '',
};

type ApiNotes = {
  notes: Note[],
  packets: Packet[],
}
export async function getCurrentProjectNotes(): Promise<ApiResponse<ApiNotes>> {
  const endpoint = `${API_URL}/projects/${storage.getProject()}/notes`;
  const resp = await fetch(endpoint);
  return resp.json() as unknown as ApiResponse<ApiNotes>;
}

export async function createNote(newNote: Note): Promise<ApiResponse<string>> {
  const resp = await fetch(`${API_URL}/projects/${storage.getProject()}/notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newNote),
  });
  return resp.json() as Promise<ApiResponse<string>>;
}

export async function deleteNote(id: string): Promise<ApiResponse<string>> {
  const resp = await fetch(`${API_URL}/projects/${storage.getProject()}/notes/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });
  return resp.json() as Promise<ApiResponse<string>>;
}

