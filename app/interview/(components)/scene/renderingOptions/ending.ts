export interface Ending {
  getEndingSongCode: () => string;
}

export function isEnding(obj: any): obj is Ending {
  return obj && typeof obj.getEndingSongCode === "function";
}
