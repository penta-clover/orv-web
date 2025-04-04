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
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const router = useRouter();

  const archiveRepository = useArchiveRepository();

  useEffect(() => {
    archiveRepository.getVideo(videoId).then((video) => {
      setVideo(video);
    });
  }, []);

  const handleDownload = async () => {
    if (!video?.videoUrl) return;
    setIsDownloading(true);
    setDownloadProgress(0);
    try {
      const response = await fetch(video.videoUrl);
      const contentLength = response.headers.get("content-length");

      if (!contentLength) {
        // content-length가 없으면 진행률 표시 없이 blob으로 처리
        const blob = await response.blob();
        triggerDownload(blob, video.title);
        setDownloadProgress(100);
        setIsDownloading(false);
        return;
      }

      const total = parseInt(contentLength, 10);
      let loaded = 0;
      const reader = response.body!.getReader();
      const chunks: Uint8Array[] = [];
      let reachedNinetyNine = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }

        if (value) {
          chunks.push(value);
          loaded += value.length;
          let percent = Math.round((loaded / total) * 100);
          // 다운로드 진행률이 99%에 도달했을 때 1초간 99% 상태 유지
          if (percent === 99 && !reachedNinetyNine) {
            setDownloadProgress(99);
            reachedNinetyNine = true;
            await new Promise((resolve) => setTimeout(resolve, 1000));
          } else {
            setDownloadProgress(percent);
          }
        }
      }
      // 읽기 완료 후 100%로 업데이트
      setDownloadProgress(100);
      const blob = new Blob(chunks);
      triggerDownload(blob, video.title);
      await new Promise((resolve) => setTimeout(resolve, 1500)); // 다운로드 완료 후 1.5초 대기
      setIsDownloading(false);
    } catch (error) {
      console.error("다운로드 중 오류 발생", error);
      setIsDownloading(false);
    }
  };

  const triggerDownload = (blob: Blob, title: string | undefined) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = title ? `${title}.mp4` : "video.mp4";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="flex w-full h-full justify-center">
      <div className="flex flex-col h-[100dvh] max-w-[600px] overflow-y-auto hide-scrollbar">
        <ActionBar />
        <div className="flex flex-col grow items-center justify-center">
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
              className={`w-full h-[56px] rounded-[12px] text-head3 text-grayscale-800 active:scale-95 duration-all ${isDownloading ? "bg-grayscale-50" : "bg-main-lilac50"}`}
              onClick={handleDownload}
              disabled={isDownloading}
            >
              {isDownloading
                ? `다운로드 중... (${downloadProgress}%)`
                : "인터뷰 영상 다운로드"}
            </button>
          </div>

          <div className="h-[11px]" />

          <div className="text-body4 text-grayscale-100">
            3시간 동안 동영상 다운로드가 가능합니다.
          </div>

          <div className="grow"/>
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
