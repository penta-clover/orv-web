'use client';

import "@/app/components/blackBody.css";
import VideoList from "./videoList";
import { useEffect, useState } from "react";
import { useArchiveRepository } from "@/providers/ArchiveRepositoryContext";
import { Video } from "@/domain/model/Video";

export default function Page() {
  const archiveRepository = useArchiveRepository();
  const [videos, setVideos] = useState<Video[] | null>(null);

  useEffect(() => {
    archiveRepository.getMyVideos().then((videos: Video[]) => setVideos(videos));
  }, []);

  if (!videos) return <div>Loading...</div>;

  // videos를 "YYYY.MM" 형식으로 그룹화
  const groupedVideos = videos.reduce((acc: Record<string, Video[]>, video) => {
    const date = new Date(video.createdAt);
    if (isNaN(date.getTime())) return acc;
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
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
    </div>
  );
}
