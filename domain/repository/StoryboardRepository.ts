import { StoryboardPreview } from "../model/StoryboardPreview";
import { SceneInfo } from "../model/SceneInfo";
import { StoryboardInfo } from "../model/StoryboardInfo";

export interface StoryboardRepository {
  getStoryboardInfo(storyboardId: string): Promise<StoryboardInfo>;
  getSceneInfo(sceneId: string): Promise<SceneInfo>;
  getStoryboardPreview(storyboardId: string): Promise<StoryboardPreview>;
}
