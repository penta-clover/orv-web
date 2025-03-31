export interface KnowNextScene {
    getNextSceneId: () => string;
}

export function isKnowNextScene(obj: any): obj is KnowNextScene {
    return obj && typeof obj.getNextSceneId === "function";
}