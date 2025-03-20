export interface ApiResult<T> {
  statusCode: string;
  message: string;
  data: T | null;
};