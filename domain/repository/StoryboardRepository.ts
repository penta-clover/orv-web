import { SceneInfo } from "../model/SceneInfo";
import { StoryboardInfo } from "../model/StoryboardInfo";

export interface StoryBoardRepository {
  getStoryboardInfo(storyboardId: string): Promise<StoryboardInfo>;
  getSceneInfo(sceneId: string): Promise<SceneInfo>;
}
