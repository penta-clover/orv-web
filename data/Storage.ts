"use client";

export class Storage {
  get(key: string): string | null {
    if (window === undefined) return null;
    return window.localStorage.getItem(key);
  }

  set(key: string, value: string) {
    if (window === undefined) return;
    return window.localStorage.setItem(key, value);
  }
}