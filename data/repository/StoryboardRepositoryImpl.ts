import { StoryBoardRepository } from "@/domain/repository/StoryboardRepository";
import { Api } from "../Api";
import { StoryboardInfo } from "@/domain/model/StoryboardInfo";
import { SceneInfo } from "@/domain/model/SceneInfo";
import { Storage } from "../Storage";

export class StoryboardRepositoryImpl implements StoryBoardRepository {
  constructor(private api: Api, private storage: Storage) {}

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
}
