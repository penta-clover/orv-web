// 본 인터페이스는 Recording 영상에 자막을 입히는 기능을 구현하는 인터페이스입니다.
// 본 인터페이스의 getSubtitles의 반환 값으로 Subtitle[]를 반환하면 Recording 영상에 자막을 입힙니다.
// Preview 영상에는 자막을 입히지 않습니다.
export interface Subtitled {
  getSubtitles: () => Subtitle[];
}

export interface Subtitle {
  text: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
}

export function isSubtitled(obj: any): obj is Subtitled {
  return obj && typeof obj.getSubtitles === "function";
}