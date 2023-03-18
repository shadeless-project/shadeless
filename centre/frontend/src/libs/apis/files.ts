import { ErrorType, MyError } from 'src/libs/error';
import { API_URL } from './types';

function isNonReadableString (value: string): boolean {
  if (value.length <= 100) return false;
  let cntNonReaddable = 0;
  for (let i = 0; i < value.length; i++) {
    const cur = value.charCodeAt(i);
    if (cur < 32 || cur >= 127) cntNonReaddable++;
  }
  return (cntNonReaddable >= Math.floor(value.length / 2));
}

const NUMBER_OF_CHARACTER_NON_READDABLE = 300;

export async function getFileContentFromId (project: string, id: string): Promise<[string, MyError | null]> {
  const data = await fetch(`${API_URL}/files/${project}/${id}`);
  const header = data.status;
  if (header === 404) {
    return ['', new MyError(ErrorType.FILE_RESPONSE_NOT_FOUND)];
  }
  let response = await data.text();
  if (isNonReadableString(response)) {
    response = response.slice(0, NUMBER_OF_CHARACTER_NON_READDABLE);
    return [response, new MyError(ErrorType.FILE_RESPONSE_NON_READDABLE)];
  }
  return [response, null];
}
