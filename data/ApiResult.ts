export interface ApiResult<T> {
  statusCode: number;
  message: string;
  data: T | null;
};