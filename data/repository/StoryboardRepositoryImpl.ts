import { StoryboardRepository } from "@/domain/repository/StoryboardRepository";
import { Api } from "../Api";
import { StoryboardPreview } from "@/domain/model/StoryboardPreview";
import { StoryboardInfo } from "@/domain/model/StoryboardInfo";
import { SceneInfo } from "@/domain/model/SceneInfo";
import { Topic } from "@/domain/model/Topic";
import Scene from "@/app/components/scene/scene";

export class StoryboardRepositoryImpl implements StoryboardRepository {
  constructor(private api: Api) {}

  async getStoryboardPreview(storyboardId: string): Promise<StoryboardPreview> {
    const result = await this.api.get<StoryboardPreview>(
      `/storyboard/${storyboardId}/preview`
    );

    if (result.statusCode !== "200") {
      throw new Error(
        `[API Error] StoryboardRepositoryImpl.getStoryboardPreview\n` +
          `Parameters:\n` +
          `  - storyboardId: ${storyboardId}\n` +
          `Response:\n` +
          `  - Status: ${result.statusCode}\n` +
          `  - Message: ${result.message}`
      );
    }

    return result.data!;
  }

  async getScenesByStoryboardId(storyboardId: string): Promise<SceneInfo[]> {
    const result = await this.api.get<Scene[]>(
      `/storyboard/${storyboardId}/scene/all`
    );

    if (result.statusCode !== "200") {
      throw new Error(
        `[API Error] StoryboardRepositoryImpl.getScenesByStoryboardId\n` +
          `Parameters:\n` +
          `  - storyboardId: ${storyboardId}\n` +
          `Response:\n` +
          `  - Status: ${result.statusCode}\n` +
          `  - Message: ${result.message}`
      );
    }

    result.data!.forEach((scene) => {
      if (typeof scene.content === "string") {
        scene.content = JSON.parse(scene.content);
      }
    });

    return result.data!;
  }

  async getStoryboardInfo(storyboardId: string): Promise<StoryboardInfo> {
    const result = await this.api.get<StoryboardInfo>(
      `/storyboard/${storyboardId}`
    );

    if (result.statusCode !== "200" || result.data === null) {
      throw new Error(
        `[API Error] StoryboardRepositoryImpl.getStoryboardInfo\n` +
          `Parameters:\n` +
          `  - storyboardId: ${storyboardId}\n` +
          `Response:\n` +
          `  - Status: ${result.statusCode}\n` +
          `  - Message: ${result.message}`
      );
    }

    return result.data;
  }

  async getSceneInfo(sceneId: string): Promise<SceneInfo> {
    const result = await this.api.get<SceneInfo>(
      `/storyboard/scene/${sceneId}`
    );

    if (result.statusCode !== "200" || result.data === null) {
      throw new Error(
        `[API Error] StoryboardRepositoryImpl.getSceneInfo\n` +
          `Parameters:\n` +
          `  - sceneId: ${sceneId}\n` +
          `Response:\n` +
          `  - Status: ${result.statusCode}\n` +
          `  - Message: ${result.message}`
      );
    }

    if (typeof result.data.content === "string") {
      result.data.content = JSON.parse(result.data.content);
    }
    return result.data;
  }

  async getTopicOfStoryboard(storyboardId: string): Promise<Topic[]> {
    const result = await this.api.get<Topic[]>(
      `/storyboard/${storyboardId}/topic/list`
    );

    if (result.statusCode !== "200" || result.data === null) {
      throw new Error(
        `[API Error] StoryboardRepositoryImpl.getTopicOfStoryboard\n` +
          `Parameters:\n` +
          `  - storyboardId: ${storyboardId}\n` +
          `Response:\n` +
          `  - Status: ${result.statusCode}\n` +
          `  - Message: ${result.message}`
      );
    }

    return result.data;
  }
}
