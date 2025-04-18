import { Storyboard } from "../model/Storyboard";
import { Topic } from "../model/Topic";

export interface TopicRepository {
    getTopics(): Promise<Topic[]>;
    getStoryboardOfTopic(topicId: string): Promise<Storyboard>;
    getTopicById(topicId: string): Promise<Topic>;
    getTopicByCategoryCode(categoryCode: string): Promise<Topic[]>;
}