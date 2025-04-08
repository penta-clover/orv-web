import { StoryboardPreview } from "../model/StoryboardPreview";
import { SceneInfo } from "../model/SceneInfo";
import { StoryboardInfo } from "../model/StoryboardInfo";
import { Topic } from "../model/Topic";
import Scene from "@/app/interview/(components)/scene/scene";

export interface StoryboardRepository {
  getStoryboardInfo(storyboardId: string): Promise<StoryboardInfo>;
  getSceneInfo(sceneId: string): Promise<SceneInfo>;
  getStoryboardPreview(storyboardId: string): Promise<StoryboardPreview>;
  getTopicOfStoryboard(storyboardId: string): Promise<Topic[]>;
  getScenesByStoryboardId(storyboardId: string): Promise<SceneInfo[]>;
}
