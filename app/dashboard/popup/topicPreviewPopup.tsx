import { NL2BR } from "@/app/components/nl2br";
import { Storyboard } from "@/domain/model/Storyboard";
import { Topic } from "@/domain/model/Topic";
import { useStoryboardRepository } from "@/providers/StoryboardRepositoryContext";
import { useTopicRepository } from "@/providers/TopicRepositoryContext";
import { useEffect, useState } from "react";
import ExampleQuestions from "../topic/exampleQuestions";
import Image from "next/image";
import { usePopup } from "../popup";
import { useTemplateService } from "@/providers/TemplateServiceContext";
import { evaluateTemplate } from "@/app/components/scene/evaluateTemplate";
import { encode } from "html-entities";

export default function TopicPreviewPopup(props: {
  topic: Topic;
  onClickClose: () => void;
  onClickReservation: () => void;
  onClickStart: () => void;
}) {
  const storyboardRepository = useStoryboardRepository();
  const topicRepository = useTopicRepository();
  const templateService = useTemplateService();
  
  const [questionCount, setQuestionCount] = useState<number>(0);
  const [questionExamples, setQuestionExamples] = useState<string[]>([]);
  const { showPopup, hidePopup } = usePopup();
  const [templateData, setTemplateData] = useState<{ key: string; value: string }[]>([]);

  useEffect(() => {
    templateService.getTemplateData().then((templateData) => {
      setTemplateData(templateData);
    });
  }, []);

  useEffect(() => {
    topicRepository
      .getStoryboardOfTopic(props.topic.id)
      .then(async (storyboard: Storyboard) => {
        const storyboardPreview =
          await storyboardRepository.getStoryboardPreview(storyboard.id);
        setQuestionCount(storyboardPreview.questionCount);
        setQuestionExamples(storyboardPreview.questions);
      });
  }, []);

  return (
    <div className="relative flex flex-col w-[548px] h-[400px] bg-grayscale-800 rounded-[14px] p-[24px]">
      <span className="text-head1 text-main-lilac50">
        인터뷰 주제 : {props.topic.name}
      </span>
      <span className="text-body2 text-grayscale-100">
        {props.topic.description.replace("\\n", "\r")}
      </span>

      <div className="h-[24px]" />

      <div className="text-head2 text-main-lilac50">
        총 {questionCount}개의 질문으로 이루어져 있어요
      </div>

      <div className="h-[8px]" />

      <ExampleQuestions questions={questionExamples.map((question) => evaluateTemplate(question, templateData))} />

      <div className="h-[16px]" />

      <div className="text-caption2 text-grayscale-500">
        *나머지 주제는 인터뷰를 시작/예약하면
        <br />
        바로 카카오톡 채널을 통해서 전달돼요.
      </div>

      <div className="h-[40px]" />

      <div className="flex flex-row justify-end items-center gap-[8px]">
        <div
          className="flex flex-row justify-center items-center w-[129px] h-[44px] bg-grayscale-600 text-grayscale-50 text-head4 rounded-[10px] transition-all active:scale-95"
          onClick={props.onClickReservation}
        >
          인터뷰 예약하기
        </div>
        <div
          className="flex flex-row justify-center items-center w-[113px] h-[44px] bg-main-lilac50 text-grayscale-800 text-head4 rounded-[10px] transition-all active:scale-95"
          onClick={props.onClickStart}
        >
          지금 시작하기
        </div>
      </div>

      <Image
        src="/icons/x-grayscale-300.svg"
        alt="cancel"
        width={24}
        height={24}
        className="absolute top-[16px] right-[16px] rounded"
        onClick={props.onClickClose}
      />
    </div>
  );
}
