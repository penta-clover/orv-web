"use client";

import "@/app/components/blackBody.css";
import VideoList from "./videoList";
import { useEffect, useState } from "react";
import { useArchiveRepository } from "@/providers/ArchiveRepositoryContext";
import { Video } from "@/domain/model/Video";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Page() {
  const archiveRepository = useArchiveRepository();
  const [videos, setVideos] = useState<Video[] | null>(null);
  const router = useRouter();

  useEffect(() => {
    archiveRepository
      .getMyVideos()
      .then((videos: Video[]) => setVideos(videos));
  }, []);

  if (!videos) return <div>Loading...</div>;

  // videos를 "YYYY.MM" 형식으로 그룹화
  const groupedVideos = videos.reduce((acc: Record<string, Video[]>, video) => {
    const date = new Date(video.createdAt);
    if (isNaN(date.getTime())) return acc;
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const key = `${year}.${month}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(video);
    return acc;
  }, {});

  // 키(월)를 내림차순으로 정렬 (예: 2025.03, 2025.02, ...)
  const sortedMonths = Object.keys(groupedVideos).sort((a, b) =>
    b.localeCompare(a)
  );

  return (
    <div className="relative text-grayscale-white w-full h-full pt-[78px] overflow-scroll hide-scrollbar">
      <h1 className="text-2xl font-bold text-head0 mx-[40px] mb-[24px]">
        인터뷰 기록
      </h1>
      {sortedMonths.map((month) => (
        <div key={month} className="mb-8">
          <VideoList title={month} videos={groupedVideos[month]} />
        </div>
      ))}

      {sortedMonths.length === 0 && (
        <div key="none" className="mb-8">
          <div className="flex flex-col">
            <span className="text-head3 text-grayscale-100 ml-[40px] mb-[12px]">
              {new Date().getFullYear() +
                "." +
                (new Date().getMonth() + 1).toString().padStart(2, "0")}
            </span>
            <div
              className="flex flex-col w-[320px] h-[236px] ml-[40px]"
              onClick={() => {
                router.push("/dashboard/topic?guide-popup=first");
              }}
            >
              <div className="relative w-[320px] h-[180px] mb-[8px] transition-all active:scale-95">
                <Image
                  unoptimized
                  src="/icons/video-addition-thumbnail.svg"
                  width={320}
                  height={180}
                  alt="video thumbnail"
                  className="w-full h-[180px] rounded-[8.32px]"
                  style={{ objectFit: "cover" }}
                />
              </div>

              <span className="text-grayscale-100 text-head4">
                오늘이 아니면 남지 않을 기록, 인터뷰 시작하기
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
