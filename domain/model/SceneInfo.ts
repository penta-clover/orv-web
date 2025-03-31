export interface SceneInfo {
  id: string;
  name: string;
  sceneType: "QUESTION" | "EPILOGUE" | "END" | string;
  content: any;
  storyboardId: string;
}
