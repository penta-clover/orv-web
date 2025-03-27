import { Topic } from "@/domain/model/Topic";
import { useStoryboardRepository } from "@/providers/StoryboardRepositoryContext";
import { useTopicRepository } from "@/providers/TopicRepositoryContext";
import { useEffect, useState } from "react";
import { usePopup } from "../popup";
import TopicPreviewPopup from "../popup/topicPreviewPopup";
import { useRouter } from "next/navigation";
import { StoryboardPreview } from "@/domain/model/StoryboardPreview";
import ReservationPopup from "../popup/reservationPopup";
import CompletePopup from "../popup/completePopup";
import { useReservationRepository } from "@/providers/ReservationRepositoryContext";
import DragScroll from "react-indiana-drag-scroll";

export default function TopicList() {
  const topicRepository = useTopicRepository();
  const storyboardRepository = useStoryboardRepository();
  const reservationRepository = useReservationRepository();
  const { showPopup, hidePopup } = usePopup();

  const [topicItems, setTopicItems] = useState<TopicItem[] | null>(null);
  const router = useRouter();

  const [popupState, setPopupState] = useState<{
    name: string;
    content: any;
  } | null>(null);

  useEffect(() => {
    topicRepository.getTopics().then((topics: Topic[]) => {
      topics.map((topic: Topic) => {
        return { topic: topic, questionCount: null };
      });
    });
  }, []);

  useEffect(() => {
    topicRepository.getTopics().then(async (topics: Topic[]) => {
      const items = await Promise.all(
        topics.map(async (topic) => {
          const storyboard = await topicRepository.getStoryboardOfTopic(
            topic.id
          );
          const preview = await storyboardRepository.getStoryboardPreview(
            storyboard.id
          );
          return { topic, preview };
        })
      );
      setTopicItems(items);
    });
  }, [topicRepository, storyboardRepository]);

  useEffect(() => {
    if (popupState === null) {
      hidePopup();
    } else if (popupState.name === "preview") {
      showPopup(
        <TopicPreviewPopup
          topic={popupState.content.topicItem.topic}
          onClickClose={() => {
            setPopupState(null);
          }}
          onClickReservation={() => {
            setPopupState({
              name: "reservation",
              content: { topicItem: popupState.content.topicItem },
            });
          }}
          onClickStart={() => {
            hidePopup();
            router.push(
              `/interview/guide?storyboardId=${popupState.content.topicItem.preview.storyboardId}`
            );
          }}
        />
      );
    } else if (popupState.name === "reservation") {
      showPopup(
        <ReservationPopup
          topicId={popupState.content.topicItem.topic.id}
          topicName={popupState.content.topicItem.topic.name}
          storyboardId={popupState.content.topicItem.preview.storyboardId}
          onClickBack={() => {
            setPopupState({
              name: "preview",
              content: { topicItem: popupState.content.topicItem },
            });
          }}
          onConfirm={(date: Date) => {
            reservationRepository.reserveInterview(
              popupState.content.topicItem.preview.storyboardId,
              date
            );
            setPopupState({
              name: "complete",
              content: {
                topicItem: popupState.content.topicItem,
                scheduledAt: date,
              },
            });
          }}
        />
      );
    } else if (popupState.name === "complete") {
      showPopup(
        <CompletePopup
          onClickClose={() => {
            setPopupState(null);
          }}
          topicName={popupState.content.topicItem.topic.name}
          scheduledAt={popupState.content.scheduledAt}
        />
      );
    }
  }, [popupState]);

  if (topicItems === null) {
    return (
      <div className="flex flex-col">
        <span className="text-head3 text-grayscale-100 ml-[40px] mb-[12px]">
          기본 주제
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <span className="text-head3 text-grayscale-100 ml-[40px] mb-[12px]">
        기본 주제
      </span>
      <DragScroll
        style={{ overflowX: "scroll" }}
        className="flex flex-row px-[40px] gap-[12px] overflow-scroll hide-scrollbar"
      >
        {topicItems.map((topicItem) => (
          <div
            key={topicItem.topic.id}
            className="flex flex-col flex-shrink-0 justify-start items-start w-[200px] h-[240px] p-[12px] rounded-[8.32px] bg-grayscale-800 transition-all active:scale-95"
            onClick={() => {
              setPopupState({ name: "preview", content: { topicItem } });
            }}
          >
            <span className="text-head4 text-grayscale-100 mb-[4px]">
              {topicItem.topic.name}
            </span>
            <span className="text-body4 text-grayscale-500">
              질문 {topicItem.preview.questionCount}개
            </span>
          </div>
        ))}
      </DragScroll>
    </div>
  );
}

interface TopicItem {
  topic: Topic;
  preview: StoryboardPreview;
}
