// 본 인터페이스는 Preview 화면에 Overlay를 표시하는 기능을 구현하는 인터페이스입니다.
// 본 인터페이스를 상속해 getOverlays의 반환 값으로 React 컴포넌트를 반환하면 미리보기 영상의 Overlay로 표시합니다.
// Recording 영상에는 Overlay를 표시하지 않습니다.
export interface PreviewOverlay {
  getOverlays: () => React.ReactNode;
}

export function isPreviewOverlay(obj: any): obj is PreviewOverlay {
  return obj && typeof obj.getOverlays === "function";
}