import { StoryboardRepository } from "@/domain/repository/StoryboardRepository";
import { Api } from "../Api";
import { Storage } from "../Storage";
import { StoryboardPreview } from "@/domain/model/StoryboardPreview";

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
}