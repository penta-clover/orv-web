import { SceneInfo } from "@/domain/model/SceneInfo";
import Scene from "../scene";
import { Subtitle, Subtitled } from "../renderingOptions/subtitled";
import { PreviewOverlay } from "../renderingOptions/previewOverlay";
import { KnowNextScene } from "../renderingOptions/knowNextScene";
import InterviewContext from "../interviewContext";

export default class QuestionScene
  extends Scene
  implements Subtitled, PreviewOverlay, KnowNextScene
{
  offset: number;

  constructor(sceneInfo: SceneInfo, interviewContext: InterviewContext) {
    super(sceneInfo, interviewContext);

    this.offset = interviewContext.priorScenes.filter(item => item.sceneType === "QUESTION").length + 1;
  }

  static canResolve(sceneInfo: SceneInfo): boolean {
    return sceneInfo.sceneType === "QUESTION";
  }

  getSubtitles(): Subtitle[] {
    return [
      {
        text: `${this.offset}번째 질문`,
        x: 50,
        y: -110,
        fontSize: 25,
        color: "white",
      },
      {
        text: `${this.content.question}`,
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
        <div className="text-head3">
          {toKoreanOrdinal(this.offset)}
          번째 질문
        </div>
        <div className="text-head2 leading-1 mt-[8px]">
          {this.content.question}
          <br />
          {this.content.hint}
        </div>
      </div>
    );
  }

  getNextSceneId(): string {
    return this.content.nextSceneId;
  }
}

export function toKoreanOrdinal(num: number): string {
  if (num <= 0 || num > 100) return `${num}`; // 0 이하나 100 초과는 fallback

  const irregular: { [key: number]: string } = {
    1: "첫",
  };

  if (irregular[num]) return irregular[num];

  const units: string[] = [
    "", "한", "두", "세", "네", "다섯", "여섯", "일곱", "여덟", "아홉",
  ];
  const tens: string[] = [
    "", "열", "스물", "서른", "마흔", "쉰", "예순", "일흔", "여든", "아흔",
  ];

  const ten = Math.floor(num / 10);
  const unit = num % 10;

  const tenWord = tens[ten];
  const unitWord = units[unit];

  return tenWord + unitWord;
}