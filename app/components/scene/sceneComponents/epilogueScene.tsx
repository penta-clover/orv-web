import { SceneInfo } from "@/domain/model/SceneInfo";
import Scene from "../scene";
import { Subtitle, Subtitled } from "../renderingOptions/subtitled";
import { PreviewOverlay } from "../renderingOptions/previewOverlay";
import { KnowNextScene } from "../renderingOptions/knowNextScene";
import InterviewContext from "../interviewContext";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

export default class EpilogueScene
  extends Scene
  implements Subtitled, PreviewOverlay, KnowNextScene
{
  constructor(sceneInfo: SceneInfo, interviewContext: InterviewContext) {
    dayjs.extend(utc);
    dayjs.extend(timezone);
    super(sceneInfo, interviewContext);
  }

  static canResolve(sceneInfo: SceneInfo): boolean {
    return sceneInfo.sceneType === "EPILOGUE";
  }

  getSubtitles(): Subtitle[] {
    return [
      {
        text: `${this.interviewContext.interviewStartDate.tz("Asia/Seoul").format(
          "YYYY년 M월 D일 오늘은 여기까지"
        )}`,
        x: 50,
        y: -60,
        fontSize: 30,
        color: "white",
      },
    ];
  }

  getOverlays(): React.ReactNode {
    return (
      <div className="absolute bottom-[32px] left-[32px] mr-[32px] text-white">
        <div className="text-head3">아래 문구를 따라 읽어주세요</div>
        <div className="text-head2 leading-1 mt-[8px]">
          {`${this.interviewContext.interviewStartDate.tz("Asia/Seoul").format(
            "YYYY년 M월 D일 오늘은 여기까지"
          )}`}
        </div>
      </div>
    );
  }

  getNextSceneId(): string {
    return this.content.nextSceneId;
  }
}
