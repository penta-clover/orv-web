import { TopicRepository } from "@/domain/repository/TopicRepository";
import { Api } from "../Api";
import { Storage } from "../Storage";
import { Topic } from "@/domain/model/Topic";
import { Storyboard } from "@/domain/model/Storyboard";

export class TopicRepositoryImpl implements TopicRepository {
    constructor(private api: Api, private storage: Storage) {}

    async getTopics(): Promise<Topic[]> {
        const requestPath = `/topic/list`;
        const result = await this.api.get<Topic[]>(requestPath, {
            'Authorization': `Bearer ${this.storage.getAuthToken()}`
        });

        if (result.statusCode != '200') {
            throw new Error(
                `[API Error] TopicRepositoryImpl.getTopics\n` +
                `Headers:\n` +
                `  - Authorization: ${this.storage.getAuthToken()}\n` +
                `Response:\n` +
                `  - Status: ${result.statusCode}\n` +
                `  - Message: ${result.message}`
            );
        }
        return result.data!;
    }

    async getStoryboardOfTopic(topicId: string): Promise<Storyboard> {
        const requestPath = `/topic/${topicId}/storyboard/next`;
        const result = await this.api.get<Storyboard>(requestPath, {
            'Authorization': `Bearer ${this.storage.getAuthToken()}`
        });
        
        if (result.statusCode != '200') {
            throw new Error(
                `[API Error] TopicRepositoryImpl.getStoryboardOfTopic\n` +
                `Headers:\n` +
                `  - Authorization: ${this.storage.getAuthToken()}\n` +
                `Parameters:\n` +
                `  - topicId: ${topicId}\n` +
                `Response:\n` +
                `  - Status: ${result.statusCode}\n` +
                `  - Message: ${result.message}`
            );
        }
        return result.data!;
    }

    async getTopicById(topicId: string): Promise<Topic> {
        const requestPath = `/topic/${topicId}`;
        const result = await this.api.get<Topic>(requestPath, {
            'Authorization': `Bearer ${this.storage.getAuthToken()}`
        });

        if (result.statusCode != '200') {
            throw new Error(
                `[API Error] TopicRepositoryImpl.getTopicById\n` +
                `Headers:\n` +
                `  - Authorization: ${this.storage.getAuthToken()}\n` +
                `Parameters:\n` +
                `  - topicId: ${topicId}\n` +
                `Response:\n` +
                `  - Status: ${result.statusCode}\n` +
                `  - Message: ${result.message}`
            );
        }
        
        return result.data!;
    }

    async getTopicByCategoryCode(categoryCode: string): Promise<Topic[]> {
        const requestPath = `/topic/list?category=${categoryCode}`;
        const result = await this.api.get<Topic[]>(requestPath, {
            'Authorization': `Bearer ${this.storage.getAuthToken()}`
        });

        if (result.statusCode != '200') {
            throw new Error(
                `[API Error] TopicRepositoryImpl.getTopicByCategoryCode\n` +
                `Headers:\n` +
                `  - Authorization: ${this.storage.getAuthToken()}\n` +
                `Parameters:\n` +
                `  - categoryCode: ${categoryCode}\n` +
                `Response:\n` +
                `  - Status: ${result.statusCode}\n` +
                `  - Message: ${result.message}`
            );
        }

        return result.data!;
    }
}