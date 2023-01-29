/* eslint-disable no-unused-vars */
export enum ErrorType {
  FILE_RESPONSE_NON_READDABLE = 1001,
  FILE_RESPONSE_NOT_FOUND = 1002,
}

export const ErrorMessage = {
  [ErrorType.FILE_RESPONSE_NON_READDABLE]: 'Error: file is nonreaddable, please download',
  [ErrorType.FILE_RESPONSE_NOT_FOUND]: 'Error: file not found',
};

export class MyError extends Error {
  type?: ErrorType = undefined;

  constructor (type: ErrorType) {
    super();
    this.type = type;
    this.message = ErrorMessage[type];
  }
}
