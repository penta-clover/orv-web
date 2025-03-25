import { ApiResult } from "./ApiResult";

export class Api {
  static baseUrl: string = `${process.env.NEXT_PUBLIC_API_SERVER_BASE_URL}/api/v0`;

  async get<T>(path: string, headers: HeadersInit = {}): Promise<ApiResult<T>> {
    const response = await fetch(`${Api.baseUrl}${path}`, {
      method: "GET",
      headers: headers,
    });

    if (response.ok) {
      return await response.json();
    }

    return {
      statusCode: response.status.toString(),
      message: response.statusText,
      data: null,
    };
  }

  async post<T>(
    path: string,
    body: object,
    headers: object = {}
  ): Promise<ApiResult<T>> {
    const isFormData = body instanceof FormData;
    const requestHeaders: HeadersInit = isFormData
      ? { ...headers }
      : {
          "Content-Type": "application/json; charset=UTF-8",
          ...headers,
        };

    const response = await fetch(`${Api.baseUrl}${path}`, {
      method: "POST",
      headers: requestHeaders,
      body: isFormData ? body : JSON.stringify(body),
    });

    if (response.ok) {
      return await response.json();
    }

    return {
      statusCode: response.status.toString(),
      message: response.statusText,
      data: null,
    };
  }

  async patch<T>(
    path: string,
    body: object,
    headers: object = {}
  ): Promise<ApiResult<T>> {
    const isFormData = body instanceof FormData;
    const requestHeaders: HeadersInit = isFormData
      ? { ...headers }
      : {
          "Content-Type": "application/json; charset=UTF-8",
          ...headers,
        };

    const response = await fetch(`${Api.baseUrl}${path}`, {
      method: "PATCH",
      headers: requestHeaders,
      body: isFormData ? body : JSON.stringify(body),
    });

    if (response.ok) {
      return await response.json();
    }

    return {
      statusCode: response.status.toString(),
      message: response.statusText,
      data: null,
    };
  }

  async put<T>(
    path: string,
    body: object,
    headers: object = {}
  ): Promise<ApiResult<T>> {
    const isFormData = body instanceof FormData;
    const requestHeaders: HeadersInit = isFormData
      ? { ...headers }
      : {
          "Content-Type": "application/json; charset=UTF-8",
          ...headers,
        };

    const response = await fetch(`${Api.baseUrl}${path}`, {
      method: "PUT",
      headers: requestHeaders,
      body: isFormData ? body : JSON.stringify(body),
    });

    if (response.ok) {
      return await response.json();
    }

    return {
      statusCode: response.status.toString(),
      message: response.statusText,
      data: null,
    };
  }
}
