import { ApiResponse, API_URL } from "./types";

export const defaultProject: Project = {
  _id: '',
  name: '',
  description: '',
  createdAt: new Date(),
};

export type Project = {
  _id: string,
  name: string,
  description: string,
  createdAt: Date,
};

export async function getOneProject(name: string): Promise<ApiResponse<Project>> {
  const project = await fetch(`${API_URL}/projects/${name}`);
  const result = await project.json() as unknown as ApiResponse<Project>;
  result.data.createdAt = new Date(result.data.createdAt);
  return result;
}

export async function getAllProjects(): Promise<ApiResponse<Project[]>> {
  const projects = await fetch(`${API_URL}/projects`);
  const result = await projects.json() as unknown as ApiResponse<Project[]>;
  result.data = result.data.map(p => ({
    ...p,
    createdAt: new Date(p.createdAt),
  }));
  return result;
}

export async function createProject(body: { name: string; description: string }): Promise<ApiResponse<string>> {
  const createProject = await fetch(`${API_URL}/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return createProject.json() as unknown as ApiResponse<string>;
}

export async function editProject (body: Partial<Project>, name: string): Promise<ApiResponse<string>> {
  const editProject = await fetch(`${API_URL}/projects/${name}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return editProject.json() as unknown as ApiResponse<string>;
}

export async function deleteProject (projectName: string) {
  const delProject = await fetch(`${API_URL}/projects/${projectName}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });
  return delProject.json() as unknown as ApiResponse<string>;
}
