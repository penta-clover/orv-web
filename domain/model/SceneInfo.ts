export interface SceneInfo {
  id: string;
  name: string;
  sceneType: "QUESTION" | "EPILOGUE" | "END";
  content: any;
  storyboardId: string;
}
