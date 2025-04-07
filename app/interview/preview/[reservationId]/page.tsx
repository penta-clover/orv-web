"use client";

import { Reservation } from "@/domain/model/Reservation";
import { Storyboard } from "@/domain/model/Storyboard";
import { StoryboardPreview } from "@/domain/model/StoryboardPreview";
import { Video } from "@/domain/model/Video";
import { useArchiveRepository } from "@/providers/ArchiveRepositoryContext";
import { useReservationRepository } from "@/providers/ReservationRepositoryContext";
import {
  StoryboardRepositoryProvider,
  useStoryboardRepository,
} from "@/providers/StoryboardRepositoryContext";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Scene from "../../(components)/scene/scene";
import { StoryboardInfo } from "@/domain/model/StoryboardInfo";
import { Topic } from "@/domain/model/Topic";
import Image from "next/image";

import "@/app/components/blackBody.css";
import { useMemberRepository } from "@/providers/MemberRepositoryContext";
import { useTemplateService } from "@/providers/TemplateServiceContext";
import { evaluteTemplate } from "../../(components)/scene/evalutateTemplate";

export default function Page({
  params,
}: {
  params: Promise<{ reservationId: string }>;
}) {
  return (
    <Suspense>
      <Body params={params} />
    </Suspense>
  );
}

function Body({ params }: { params: Promise<{ reservationId: string }> }) {
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [storyboardInfo, setStoryboardInfo] = useState<StoryboardInfo | null>(
    null
  );
  const [storyboardPreview, setStoryboardPreview] =
    useState<StoryboardPreview | null>(null);
  const [topic, setTopic] = useState<Topic | null>(null);
  const [scenes, setScenes] = useState<Scene[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [templateData, setTemplateData] = useState<{ key: string; value: string }[] | null>(null);

  const reservationRepository = useReservationRepository();
  const storyboardRepository = useStoryboardRepository();
  const templateService = useTemplateService();

  useEffect(() => {
    const fetchData = async () => {
      const resolvedParams = await params;
      const reservation = await reservationRepository.getReservation(
        resolvedParams.reservationId
      );

      if (!reservation) {
        return;
      }

      const [storyboardInfo, storyboardPreview, topics, scenes, templateData] =
        await Promise.all([
          storyboardRepository.getStoryboardInfo(reservation.storyboardId),
          storyboardRepository.getStoryboardPreview(reservation.storyboardId),
          storyboardRepository.getTopicOfStoryboard(reservation.storyboardId),
          storyboardRepository.getScenesByStoryboardId(
            reservation.storyboardId
          ),
          templateService.getTemplateData(reservation.memberId),
        ]);

      setReservation(reservation);
      setStoryboardInfo(storyboardInfo);
      setStoryboardPreview(storyboardPreview);
      setTopic(topics[0]);
      setScenes(scenes);
      setTemplateData(templateData);

      setIsLoading(false);
    };

    fetchData();
  }, [params, reservationRepository, storyboardRepository, templateService]);

  return (
    <div className="flex justify-center w-[calc(100dvw)] bg-grayscale-900 hide-scrollbar">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[600px] h-[56px] bg-dark flex items-center px-[16px] z-[30]">
        <Image src={"/icons/logo.svg"} alt="logo" width={42} height={20} />
      </div>

      <div className="relative flex flex-col max-w-[600px] w-full min-h-[calc(100dvh)] bg-grayscale-white">
        <div className="h-[73px]" />

        {isLoading ? (
          <Skeleton />
        ) : (
          <div className="flex flex-col px-[17px]">
            <div className="text-head2 text-grayscale-black">{topic?.name}</div>

            <div className="h-[16px]" />

            <div className="flex">
              <div className="h-full w-[2px] mr-[11px] bg-grayscale-600" />
              <div className="text-head3 text-grayscale-300">
                {topic?.description}
              </div>
            </div>

            <div className="h-[20px]" />

            {sceneToList(scenes!, storyboardInfo!.startSceneId).map(
              (scene: Scene, index: number) => {
                const content = JSON.parse(scene.content);

                return (
                  <div key={scene.id}>
                    <QuestionComponent
                      question={evaluteTemplate(content.question, templateData!)}
                      order={index + 1}
                      hint={evaluteTemplate(content.hint, templateData!)}
                    />
                    <div className="h-[20px]" />
                  </div>
                );
              }
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function sceneToList(scenes: Scene[], startSceneId: string) {
  const startScene = scenes.find((scene) => scene.id === startSceneId);

  if (!startScene || startScene.sceneType !== "QUESTION") {
    return [];
  }

  const sceneList = [startScene];

  while (true) {
    const lastScene = sceneList[sceneList.length - 1];
    const nextSceneId = JSON.parse(lastScene.content).nextSceneId;
    const nextScene = scenes.find(
      (scene) => scene.id.toUpperCase() === nextSceneId.toUpperCase()
    );

    if (!nextScene || nextScene.sceneType !== "QUESTION") {
      break;
    }

    sceneList.push(nextScene);
  }

  return sceneList;
}

function QuestionComponent({
  question,
  order,
  hint,
}: {
  question: string;
  order: number;
  hint: string;
}) {
  return (
    <div className="flex flex-col">
      <div className="text-body4 text-grayscale-300">{`${numberToKorean(
        order
      )} 질문`}</div>
      <div className="text-head3 text-grayscale-800">{question}</div>
      <div className="text-body3 text-grayscale-300">{hint}</div>
    </div>
  );
}

function numberToKorean(number: number) {
  const korean = [
    "첫",
    "두",
    "세",
    "네",
    "다섯",
    "여섯",
    "일곱",
    "여덟",
    "아홉",
    "열",
    "열한",
    "열두",
    "열세",
    "열네",
    "열다섯",
    "열여섯",
    "열일곱",
    "열여덟",
    "열아홉",
    "스무",
  ];
  return `${korean[number - 1]}번째`;
}

function Skeleton() {
  return (<div className="flex flex-col px-[17px]">
    <div className="w-[200px] h-[32px] bg-grayscale-100 rounded-md animate-pulse" />
    
    <div className="h-[16px]" />
    
    <div className="flex">
      <div className="h-full w-[2px] mr-[11px] bg-grayscale-600" />
      <div className="w-[250px] h-[48px] bg-grayscale-100 rounded-md animate-pulse" />
    </div>
    
    <div className="h-[20px]" />
    
    {[1, 2, 3].map((_, index) => (
      <div key={index} className="mb-[20px]">
        <div className="w-[80px] h-[16px] bg-grayscale-100 rounded-md animate-pulse mb-[8px]" />
        <div className="w-full h-[24px] bg-grayscale-100 rounded-md animate-pulse mb-[8px]" />
        <div className="w-[180px] h-[20px] bg-grayscale-100 rounded-md animate-pulse" />
      </div>
    ))}
  </div>);
}