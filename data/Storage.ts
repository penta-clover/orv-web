"use client";

export class Storage {
  getAuthToken(): string | null {
    if (window === undefined) return null;
    return window.localStorage.getItem("authToken");
  }

  setAuthToken(value: string) {
    if (window === undefined) return;
    return window.localStorage.setItem("authToken", value);
  }
}