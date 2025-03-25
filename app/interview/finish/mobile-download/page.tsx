"use client";

import "@/app/components/blackBody.css";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import { useArchiveRepository } from "@/providers/ArchiveRepositoryContext";
import { Video } from "@/domain/model/Video";

export default function Page() {
  return (
    <Suspense>
      <Body />
    </Suspense>
  );
}

function Body() {
  const [video, setVideo] = useState<Video | null>(null);
  const searchParams = useSearchParams();
  const videoId = searchParams.get("videoId")!;
  const router = useRouter();

  const archiveRepository = useArchiveRepository();

  useEffect(() => {
    archiveRepository.getVideo(videoId).then((video) => {
      setVideo(video);
    });
  });

  const handleDownload = async () => {
    if (video?.videoUrl) {
      try {
        const response = await fetch(video.videoUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = video.title ? `${video.title}.webm` : "video.webm";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error("다운로드 중 오류 발생", error);
      }
    }
  };

  return (
    <div className="flex flex-col h-[100dvh]">
      <ActionBar />
      <div className="flex flex-col grow items-center justify-center pb-[182px]">
        <div className="h-[43px] text-main-lilac50 text-head2 text-center">
          나를 마주하는 시간, 오브
        </div>

        <div className="h-[33px]" />

        <video
          src={video?.videoUrl}
          controls
          autoPlay
          muted
          className="px-[33px]"
        />

        <div className="h-[4px]" />

        <div className="text-grayscale-100 text-head3 h-[28px] w-full px-[33px]">
          {video?.title}
        </div>

        <div className="h-[4px]" />

        <div className="text-grayscale-100 text-head3 h-[28px] w-full px-[33px]">
          {video?.createdAt ? formatDate(new Date(video!.createdAt)) : ""}
        </div>

        <div className="h-[34px]" />

        <div className="w-full px-[33px]">
          <button
            className="w-full h-[56px] rounded-[12px] text-head3 bg-main-lilac50 text-grayscale-800 bg-grayscale-800 text-grayscale-500 active:scale-95"
            onClick={handleDownload}
          >
            인터뷰 영상 다운로드
          </button>
        </div>

        <div className="h-[11px]" />

        <div className="text-body4 text-grayscale-100">
          24시간 동안 동영상 다운로드가 가능합니다.
        </div>
      </div>
    </div>
  );
}

function ActionBar() {
  return (
    <div className="h-[56px] w-full flex flex-row pl-[16px]">
      <Image src="/icons/logo.svg" alt="logo" width={42} height={20} />
    </div>
  );
}

function formatDate(date: Date): string {
  return (
    date.getFullYear() +
    "." +
    String(date.getMonth() + 1).padStart(2, "0") +
    "." +
    String(date.getDate()).padStart(2, "0")
  );
}
