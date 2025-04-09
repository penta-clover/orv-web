import Scene from "./scene";
import dayjs, { Dayjs } from "dayjs";

export default class InterviewContext {
    priorScenes: Scene[] = [];              // 인터뷰 중 표시한 씬들
    interviewStartDate: Dayjs = dayjs();    // 인터뷰 시작 시간
    templateData: { key: string; value: string }[] = [];
    
    addScene(scene: Scene) {
        this.priorScenes.push(scene);
    }
}
