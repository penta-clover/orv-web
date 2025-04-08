"use client";

import "@/app/components/blackBody.css";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import { useArchiveRepository } from "@/providers/ArchiveRepositoryContext";
import { Video } from "@/domain/model/Video";
import FAQ from "@/app/components/faq";
import { VideoMetadata } from "@/domain/model/VideoMetadata";

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
  const [isNotFound, setIsNotFound] = useState<boolean>();
  const [isExpired, setIsExpired] = useState<boolean>();

  const archiveRepository = useArchiveRepository();

  useEffect(() => {
    archiveRepository
      .getVideo(videoId)
      .then((video: VideoMetadata) => {
        if (!video) {
          setIsNotFound(true);
          return;
        }

        setIsExpired(
          new Date(video.createdAt) < new Date(Date.now() - 1000 * 60 * 60 * 3)
        );

        setVideo(video);
      })
      .catch(() => {
        setIsNotFound(true);
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
          const percent = Math.round((loaded / total) * 100);
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

  if (video === null || isNotFound || isExpired) {
    return (
      <div className="flex w-full h-[calc(100vh)] justify-center bg-grayscale-black overflow-y-auto hide-scrollbar">
        <div className="flex flex-col w-full max-w-[600px] bg-[#101212] items-center">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 max-w-[600px] flex w-full justify-start">
            <ActionBar />
          </div>
          <div className="flex flex-col items-center justify-center h-[calc(100vh)] w-full">
            <Image
              src="/icons/logo.svg"
              alt="orv logo"
              width={120}
              height={57}
              className="mb-[40px]"
            />

            {(isNotFound || isExpired) ? (
              <div className="h-[100px] flex flex-col justify-center">
                <div className="text-grayscale-white text-head1 text-center">
                  영상을 찾을 수 없습니다
                </div>
                <div className="text-grayscale-400 text-body3 text-center">
                  올바른 링크인지 다시 확인해주세요.
                </div>
              </div>
            ) : (
              <div className="h-[100px] flex items-center">
                <Image
                  src="/icons/rolling-spinner-grayscale-white.gif"
                  alt="loading"
                  width={24}
                  height={24}
                />
              </div>
            )}

            <div className="h-[100px]" />

            <div className="w-[calc(100%)] h-[300px] self-center">
              <FAQ faqData={faqData()} title="다운로드 참고사항" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full h-full justify-center bg-grayscale-black overflow-y-auto hide-scrollbar">
      <div className="flex flex-col w-full max-w-[600px] bg-[#101212]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 max-w-[600px] flex w-full justify-start">
          <ActionBar />
        </div>
        <div className="flex flex-col items-center justify-center w-full max-w-[600px]">
          <div className="h-[56px]" />
          <div className="h-[43px] text-main-lilac50 text-head2 text-center">
            나를 마주하는 시간, 오브
          </div>

          <div className="h-[33px]" />

          <div className="w-full self-center">
            <video
              src={video?.videoUrl}
              controls
              autoPlay
              muted
              className="px-[16px] w-full"
            />
          </div>

          <div className="h-[4px]" />

          <div className="text-grayscale-100 text-head3 h-[28px] w-full px-[16px]">
            {video?.title}
          </div>

          <div className="h-[4px]" />

          <div className="text-grayscale-100 text-body2 h-[28px] w-full px-[16px]">
            {video?.createdAt ? formatDate(new Date(video!.createdAt)) : ""}
          </div>

          <div className="h-[34px]" />

          <div className="w-full px-[16px]">
            <button
              className={`w-full h-[56px] rounded-[12px] text-head3 text-grayscale-800 active:scale-95 duration-all ${
                isDownloading ? "bg-grayscale-50" : "bg-main-lilac50"
              }`}
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

          <div className="h-[36px]" />

          <div className="w-[calc(100%)] h-[300px] self-center">
            <FAQ faqData={faqData()} title="다운로드 참고사항" />
          </div>
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

function faqData() {
  return [
    {
      question: "버튼 클릭 후 다운로드가 안되는 경우",
      answer:
        "다운로드 버튼을 클릭한 이후에도 다운로드 안내가 뜨지 않는다면 지금 화면에서 새로고침을 한번 진행해주세요. 그럼에도 안될 경우 바로 1:1 문의를 통해 연락 부탁드립니다.",
    },
    {
      question: "인터뷰 영상에서 소리가 들리지 않을 경우",
      answer:
        "미리보기 영상 및 실제 다운로드된 영상에서 소리가 들리지 않는 경우 바로 1:1 문의를 통해 연락 부탁드립니다.",
    },
    {
      question: "그 외 오류가 있는 경우",
      answer:
        "1:1 문의를 통해 설명해주시면 빠르게 문제해결을 도와드리겠습니다.",
    },
  ];
}
