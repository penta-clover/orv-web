import { SceneInfo } from "@/domain/model/SceneInfo";
import Scene from "../scene";
import { Ending } from "../renderingOptions/ending";
import InterviewContext from "../interviewContext";

export default class EndScene
  extends Scene
  implements Ending
{
  constructor(sceneInfo: SceneInfo, interviewContext: InterviewContext) {
    super(sceneInfo, interviewContext);
  }

  static canResolve(sceneInfo: SceneInfo): boolean {
    return sceneInfo.sceneType === "END";
  }

  getEndingSongCode(): string {
    return "muTUmQnqGDY";
  }
}
