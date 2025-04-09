import { SceneInfo } from "@/domain/model/SceneInfo";
import Scene from "../scene";
import dayjs, { Dayjs } from "dayjs";

export default class DefaultScene extends Scene {
  constructor() {
    super(
      {
        id: "",
        name: "",
        sceneType: "",
        storyboardId: "",
        content: {},
      },
      {
        priorScenes: [],
        interviewStartDate: dayjs(),
        addScene: () => {},
        templateData: [],
      }
    );
  }

  static canResolve(sceneInfo: SceneInfo): boolean {
    throw new Error("this scene should not be used in floop");
  }
}
