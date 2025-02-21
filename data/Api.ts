import { ApiResult } from './ApiResult';

export class Api {
  static baseUrl: string = "https://api.orv.im/api/v0";

  get<T>(path: string, headers: HeadersInit = {}): Promise<ApiResult<T>> {
    return fetch(`${Api.baseUrl}${path}`, {
    	method: "GET",
      headers: headers,
    }).then((response) => response.json()).then((data) => (data as ApiResult<T>));
  }

  post<T>(path: string, body: object, headers: object = {}): Promise<ApiResult<T>> {
    const requestHeaders: HeadersInit = {
      ...headers,
      "Content-Type": "application/json; charset=UTF-8",
    };
    
    return fetch(`${Api.baseUrl}${path}`, {
    	method: "POST",
      headers: requestHeaders,
      body: JSON.stringify(body),
    }).then((response) => response.json()).then((data) => (data as ApiResult<T>));
  }
}