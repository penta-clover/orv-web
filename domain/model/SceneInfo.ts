export interface SceneInfo {
  id: string;
  name: string;
  sceneType: "QUESTION" | "EPILOGUE" | "END" | string;
  content: Record<string, any>;
  storyboardId: string;
}
