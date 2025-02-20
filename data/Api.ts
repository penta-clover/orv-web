import { ApiResult } from './ApiResult';

export class Api {
  static baseUrl: string = "https://api.orv.im/api/v0";

  get<T>(path: string): Promise<ApiResult<T>> {
    return fetch(`${Api.baseUrl}${path}`, {
    	method: "GET"
    }).then((response) => response.json()).then((data) => (data as ApiResult<T>));
  }

  post<T>(path: string, body: object): Promise<ApiResult<T>> {
    return fetch(`${Api.baseUrl}${path}`, {
    	method: "POST",
      body: JSON.stringify(body)
    }).then((response) => response.json()).then((data) => (data as ApiResult<T>));
  }
}