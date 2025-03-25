import { StoryboardPreview } from "../model/StoryboardPreview";

export interface StoryboardRepository {
    getStoryboardPreview(storyboardId: string): Promise<StoryboardPreview>;
}