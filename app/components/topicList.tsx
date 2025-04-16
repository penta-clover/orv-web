import { Topic } from "@/domain/model/Topic";
import { useStoryboardRepository } from "@/providers/StoryboardRepositoryContext";
import { useTopicRepository } from "@/providers/TopicRepositoryContext";
import { useEffect, useState } from "react";
import { usePopup } from "../dashboard/popup";
import TopicPreviewPopup from "../dashboard/popup/topicPreviewPopup";
import { useRouter } from "next/navigation";
import { StoryboardPreview } from "@/domain/model/StoryboardPreview";
import ReservationPopup from "../dashboard/popup/reservationPopup";
import CompletePopup from "../dashboard/popup/completePopup";
import { useReservationRepository } from "@/providers/ReservationRepositoryContext";
import DragScroll from "react-indiana-drag-scroll";
import { cn } from "@/lib/utils";
import { v4 as uuidv4 } from "uuid";

export default function TopicList(props: {
  title: string;
  categoryCode: string[];
  itemClassName?: string;
  titleClassName?: string;
  listClassName?: string;
}) {
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
    async function fetchTopics() {
      const topics: Topic[] = (
        await Promise.all(
          props.categoryCode.map(async (categoryCode) => {
            const topics: Topic[] =
              await topicRepository.getTopicByCategoryCode(categoryCode);
            return topics;
          })
        )
      ).flat();

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
    }

    fetchTopics();
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
            // 만약 모바일 화면 (30rem 이하)라면 /dashboard/reservation으로 이동
            if (typeof window !== "undefined" && window.innerWidth < 480) {
              router.push(
                `/dashboard/mobile-reservation?storyboardId=${popupState.content.topicItem.preview.storyboardId}`
              );
              setPopupState(null);
              return;
            }

            setPopupState({
              name: "reservation",
              content: { topicItem: popupState.content.topicItem },
            });
          }}
          onClickStart={() => {
            hidePopup();
            reservationRepository.reserveInstantInterview(
              popupState.content.topicItem.preview.storyboardId
            );
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
        <span
          className={`text-grayscale-100 ${cn(
            "text-head3 ml-[40px] mb-[12px]",
            props.titleClassName
          )}`}
        >
          {props.title}
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <span
        className={`text-grayscale-100 ${cn(
          "text-head3 ml-[40px] mb-[12px]",
          props.titleClassName
        )}`}
      >
        {props.title}
      </span>
      <DragScroll
        style={{ overflowX: "scroll" }}
        className={cn(
          "flex flex-row px-[40px] gap-[12px] overflow-scroll hide-scrollbar",
          props.listClassName
        )}
      >
        {topicItems.map((topicItem) => (
          <div
            key={topicItem.topic.id + uuidv4()}
            className={cn(
              "flex flex-col flex-shrink-0 justify-start items-start w-[200px] h-[240px] p-[12px] rounded-[8.32px] bg-grayscale-800 transition-all active:scale-95",
              props.itemClassName
            )}
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

            <div className="grow" />

            <div className="flex flex-row items-center justify-start gap-[3px]">
              {topicItem.topic.hashtags.map((hashtag, index) => {
                return (
                  <span
                    key={index}
                    className="text-caption1 text-grayscale-500 mr-[4px] h-[22px] px-[9px] rounded-[11px] bg-grayscale-600"
                    style={{
                      color: `${hashtag.color}`,
                    }}
                  >
                    {`#${hashtag.name}`}
                  </span>
                );
              })}
            </div>
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
