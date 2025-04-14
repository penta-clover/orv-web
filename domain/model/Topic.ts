import { Hashtag } from "./Hashtag"

export interface Topic {
    id: string,
    name: string,
    description: string,
    thumbnailUrl: string
    hashtags: Hashtag[]
};