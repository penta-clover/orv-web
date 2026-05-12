import { ApiResult } from "./ApiResult";

export class Api {
  static baseUrl: string = `${process.env.NEXT_PUBLIC_API_SERVER_BASE_URL}/api/v0`;
  static baseUrlV1: string = `${process.env.NEXT_PUBLIC_API_SERVER_BASE_URL}/api/v1`;

  static authLoginUrl(provider: string): string {
    return `${Api.baseUrl}/auth/login/${provider}`;
  }

  async get<T>(path: string, headers: HeadersInit = {}): Promise<ApiResult<T>> {
    return this.getFromBaseUrl(Api.baseUrl, path, headers);
  }

  async getV1<T>(
    path: string,
    headers: HeadersInit = {}
  ): Promise<ApiResult<T>> {
    return this.getFromBaseUrl(Api.baseUrlV1, path, headers);
  }

  private async getFromBaseUrl<T>(
    baseUrl: string,
    path: string,
    headers: HeadersInit = {}
  ): Promise<ApiResult<T>> {
    const response = await fetch(`${baseUrl}${path}`, {
      method: "GET",
      headers: headers,
      credentials: "include",
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
      credentials: "include",
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
      credentials: "include",
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
    return this.putToBaseUrl(Api.baseUrl, path, body, headers);
  }

  async putV1<T>(
    path: string,
    body: object,
    headers: object = {}
  ): Promise<ApiResult<T>> {
    return this.putToBaseUrl(Api.baseUrlV1, path, body, headers);
  }

  private async putToBaseUrl<T>(
    baseUrl: string,
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

    const response = await fetch(`${baseUrl}${path}`, {
      method: "PUT",
      headers: requestHeaders,
      body: isFormData ? body : JSON.stringify(body),
      credentials: "include",
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
