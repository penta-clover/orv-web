"use client";

import "@/app/components/blackBody.css";
import { useRouter, useSearchParams } from "next/navigation";
import { useArchiveRepository } from "@/providers/ArchiveRepositoryContext";
import { useEffect, useRef, useState } from "react";

export default function Page() {
  const searchParams = useSearchParams();
  const localVideoUrl = searchParams.get("videoUrl")!;
  const storyboardId = searchParams.get("storyboardId")!;
  const archiveRepository = useArchiveRepository();
  const [videoId, setVideoId] = useState<string | null>(null);
  const router = useRouter();

  // 중복 실행을 방지하기 위한 ref
  const didUploadRef = useRef(false);
  useEffect(() => {
    if (!localVideoUrl) return;
    if (didUploadRef.current) return;

    didUploadRef.current = true;

    async function fetchAndUpload() {
      try {
        // blob 파일 URL로부터 실제 blob 데이터를 가져옵니다.
        const response = await fetch(localVideoUrl);
        const blob = await response.blob();
        const videoId = await archiveRepository.uploadVideo(blob, storyboardId);
        console.log(videoId);
        setVideoId(videoId);
        console.log("비디오 업로드 성공");
      } catch (error) {
        console.error("비디오 업로드 중 에러 발생:", error);
      }
    }

    fetchAndUpload();
  }, []);

  return (
    <div>
      <p>비디오 업로드 진행 중...</p>
      <button
        className="bg-main-lilac50 p-2 rounded-[12px]"
        onClick={() =>
          router.replace(`/interview/finish/naming?videoId=${videoId}`)
        }
      >
        다음으로
      </button>
    </div>
  );
}
