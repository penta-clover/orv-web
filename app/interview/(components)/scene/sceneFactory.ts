import { SceneInfo } from "@/domain/model/SceneInfo";
import EndScene from "./sceneComponents/endScene";
import EpilogueScene from "./sceneComponents/epilogueScene";
import QuestionScene from "./sceneComponents/questionScene";
import DefaultScene from "./sceneComponents/emptyScene";
import Scene from "./scene";
import InterviewContext from "./interviewContext";

export default class SceneFactory {
  private static sceneComponents = [QuestionScene, EpilogueScene, EndScene];

  static createScene(sceneInfo: SceneInfo | null, interviewContext: InterviewContext): Scene {
    if (!sceneInfo) {
      return new DefaultScene();
    }

    for (const SceneComponent of SceneFactory.sceneComponents) {
      // canResolve 함수가 true를 반환하면 해당 클래스를 인스턴스화해 반환합니다.
      if (SceneComponent.canResolve(sceneInfo)) {
        return new SceneComponent(sceneInfo, interviewContext);
      }
    }

    throw new Error("No matching SceneComponent found for the given sceneInfo");
  }
}
