
import { StoryboardRepository } from "@/domain/repository/StoryboardRepository";
import { Api } from "../Api";
import { Storage } from "../Storage";
import { StoryboardPreview } from "@/domain/model/StoryboardPreview";
import { StoryboardInfo } from "@/domain/model/StoryboardInfo";
import { SceneInfo } from "@/domain/model/SceneInfo";
import { Topic } from "@/domain/model/Topic";

export class StoryboardRepositoryImpl implements StoryboardRepository {
  constructor(private api: Api, private storage: Storage) {}

  async getStoryboardPreview(storyboardId: string): Promise<StoryboardPreview> {
    const result = await this.api.get<StoryboardPreview>(
      `/storyboard/${storyboardId}/preview`,
      {
        Authorization: `Bearer ${this.storage.getAuthToken()}`,
      }
    );


    if (result.statusCode !== "200") {
      throw new Error(result.message);
    }

    return result.data!;
  }

  async getStoryboardInfo(storyboardId: string): Promise<StoryboardInfo> {
    const result = await this.api.get<StoryboardInfo>(
      `/storyboard/${storyboardId}`,
      {
        Authorization: `Bearer ${this.storage.getAuthToken()}`,
      }
    );

    if (result.statusCode !== "200" || result.data === null) {
      throw new Error(result.message);
    }
    return result.data;
  }

  async getSceneInfo(sceneId: string): Promise<SceneInfo> {
    const result = await this.api.get<SceneInfo>(
      `/storyboard/scene/${sceneId}`,
      {
        Authorization: `Bearer ${this.storage.getAuthToken()}`,
      }
    );
    if (result.statusCode !== "200" || result.data === null) {
      throw new Error(result.message);
    }

    if (result.data.content) {
      result.data.content = JSON.parse(result.data.content);
    }

    return result.data;
  }

  async getTopicOfStoryboard(storyboardId: string): Promise<Topic[]> {
    const result = await this.api.get<Topic[]>(
      `/storyboard/${storyboardId}/topic/list`,
      {
        Authorization: `Bearer ${this.storage.getAuthToken()}`,
      }
    );

    if (result.statusCode !== "200" || result.data === null) {
      throw new Error(result.message);
    }

    return result.data;
  }
}
