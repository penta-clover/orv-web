import { SceneInfo } from "@/domain/model/SceneInfo";
import InterviewContext from "./interviewContext";

export default class Scene {
    id: string;
    name: string;
    sceneType: string;
    content: any;
    storyboardId: string;
    interviewContext: InterviewContext;

    constructor(sceneInfo: SceneInfo, interviewContext: InterviewContext) {
        this.id = sceneInfo.id;
        this.name = sceneInfo.name;
        this.sceneType = sceneInfo.sceneType;
        this.content = sceneInfo.content;
        this.storyboardId = sceneInfo.storyboardId;
        this.interviewContext = interviewContext;
    }

    static canResolve(sceneInfo: SceneInfo): boolean {
        throw new Error("Method not implemented. You need to implement this method in the subclass.");
    }
}