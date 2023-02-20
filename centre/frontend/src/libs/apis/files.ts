import storage from 'src/libs/storage';
import { HeuristicValidator } from 'src/libs/heuristic.validator';
import { ErrorType, MyError } from 'src/libs/error';
import { API_URL } from './types';

const NUMBER_OF_CHARACTER_NON_READDABLE = 200;
const validator = new HeuristicValidator();

export async function getFileContentFromId (project: string, id: string): Promise<[string, MyError | null]> {
  const endpoint = `${API_URL}/files/${project}/${id}`;
  const data = await fetch(endpoint, {
    headers: {
      'Authorization': localStorage.getItem('authorization') || '',
    }
  });
  const header = data.status;
  if (header === 404) {
    return ['', new MyError(ErrorType.FILE_RESPONSE_NOT_FOUND)];
  }
  let response = await data.text();
  if (validator.isNonReadableString(response)) {
    response = response.slice(0, NUMBER_OF_CHARACTER_NON_READDABLE);
    return [response, new MyError(ErrorType.FILE_RESPONSE_NON_READDABLE)];
  }
  return [response, null];
}
