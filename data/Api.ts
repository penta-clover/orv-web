import { ApiResult } from "./ApiResult";

export class Api {
  static baseUrl: string = "https://api.orv.im/api/v0";

  async get<T>(path: string, headers: HeadersInit = {}): Promise<ApiResult<T>> {
    const response = await fetch(`${Api.baseUrl}${path}`, {
      method: "GET",
      headers: headers,
    });

    if (response.ok) {
      return await response.json();
    }

    return {
      statusCode: response.status,
      message: response.statusText,
      data: null,
    };
  }

  async post<T>(
    path: string,
    body: object,
    headers: object = {}
  ): Promise<ApiResult<T>> {
    const requestHeaders: HeadersInit = {
      ...headers,
      "Content-Type": "application/json; charset=UTF-8",
    };

    const response = await fetch(`${Api.baseUrl}${path}`, {
      method: "POST",
      headers: requestHeaders,
      body: JSON.stringify(body),
    });

    if (response.ok) {
      return await response.json();
    }

    return {
      statusCode: response.status,
      message: response.statusText,
      data: null,
    };
  }
}
