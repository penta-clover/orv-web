"use client";

import "@/app/components/blackBody.css";
import "./credit.css";
import YouTube from "react-youtube";

import { useRouter, useSearchParams } from "next/navigation";
import { useArchiveRepository } from "@/providers/ArchiveRepositoryContext";
import { Suspense, useEffect, useRef, useState } from "react";
import { useMemberRepository } from "@/providers/MemberRepositoryContext";
import { MyInfo } from "@/domain/model/MyInfo";

export default function Page() {
  return <Suspense>
    <Body />
  </Suspense>
}

function Body() {
  const searchParams = useSearchParams();
  const localVideoUrl = searchParams.get("videoUrl")!;
  const storyboardId = searchParams.get("storyboardId")!;
  const totalInterviewTime = searchParams.get("totalInterviewTime")!;
  const topic = searchParams.get("topic")!;

  const router = useRouter();

  const [videoId, setVideoId] = useState<string | null>(null);
  const [nickname, setNickname] = useState<string>("");
  const videoPlayerRef = useRef<HTMLVideoElement>(null);

  const archiveRepository = useArchiveRepository();
  const memberRepository = useMemberRepository();

  // 중복 실행 방지
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

  useEffect(() => {
    memberRepository
      .getMyInfo()
      .then((myInfo: MyInfo) => setNickname(myInfo.nickname));
  }, []);

  // blob 영상 5배속 설정
  useEffect(() => {
    if (videoPlayerRef.current) {
      videoPlayerRef.current.playbackRate = 2;
    }
  }, []);

  return (
    <div className="relative">
      {/* 왼쪽 하단 blob 영상 */}
      <video
        ref={videoPlayerRef}
        src={localVideoUrl}
        autoPlay
        loop
        muted
        style={{
          position: "fixed",
          bottom: "48px",
          left: "48px",
          width: "450px",
          height: "240px",
          objectFit: "cover",
          zIndex: 1,
        }}
      />

      {/* 우측 하단 react-youtube 플레이어 */}
      <div
        style={{
          position: "fixed",
          bottom: "16px",
          right: "16px",
          zIndex: 2,
          textAlign: "center",
        }}
      >
        <YouTube
          videoId="muTUmQnqGDY"
          opts={{
            width: "200",
            height: "112",
            playerVars: {
              autoplay: 1,
              controls: 1,
              modestbranding: 1,
              rel: 0,
            },
          }}
        />
        <div className="text-body4 text-grayscale-200 w-full">
          DANIEL - 은방울
        </div>
      </div>

      {/* 크레딧 애니메이션 영역 */}
      <div className="absolute top-0 left-0 creditsAnimation flex flex-col items-center h-[100dvh] overflow-hidden w-[100dvw]">
        <Roster
          myNickname={nickname}
          totalInterviewTime={Number(totalInterviewTime)}
          topic={topic}
        />
      </div>

      <button
        className="absolute text-main-lilac50 p-2 right-0"
        onClick={() =>
          router.replace(`/interview/finish/naming?videoId=${videoId}`)
        }
      >
        다음으로
      </button>
    </div>
  );
}

function Roster(props: {
  myNickname: string;
  totalInterviewTime: number;
  topic: string;
}) {
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    const now = new Date();

    const year = now.getFullYear();
    const month = now.getMonth() + 1; // 0부터 시작하므로 +1
    const date = now.getDate();
    let hours = now.getHours();
    const minutes = now.getMinutes();

    const period = hours < 12 ? "오전" : "오후";
    hours = hours % 12;
    hours = hours ? hours : 12; // 0이면 12로 표시

    // 분이 한 자리이면 0을 붙임
    const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    const formatted = `${year}년 ${month}월 ${date}일 ${period} ${hours}시 ${paddedMinutes}분`;
    setFormattedDate(formatted);
  }, []);

  return (
    <div className="flex flex-col items-center text-head1 text-main-lilac50 w-[700px]">
      <span className="mb-[65px]">The End</span>
      <div className="flex flex-row gap-[32px] mb-[16px] w-full">
        <span className="w-[calc(50%-16px)] text-right">주인공</span>
        <span className="w-[calc(50%-16px)]">{props.myNickname}</span>
      </div>
      <div className="flex flex-row gap-[32px] mb-[16px] w-full">
        <span className="w-[calc(50%-16px)] text-right">감독</span>
        <span className="w-[calc(50%-16px)]">{props.myNickname}</span>
      </div>
      <div className="flex flex-row gap-[32px] mb-[16px] w-full">
        <span className="w-[calc(50%-16px)] text-right">각본가</span>
        <span className="w-[calc(50%-16px)]">{props.myNickname}</span>
      </div>
      <div className="flex flex-row gap-[32px] mb-[16px] w-full">
        <span className="w-[calc(50%-16px)] text-right">제작사</span>
        <span className="w-[calc(50%-16px)]">오브</span>
      </div>
      <div className="flex flex-row gap-[32px] mb-[16px] w-full">
        <span className="w-[calc(50%-16px)] text-right">주제</span>
        <span className="w-[calc(50%-16px)]">{props.topic}</span>
      </div>
      <div className="flex flex-row gap-[32px] mb-[16px] w-full">
        <span className="w-[calc(50%-16px)] text-right">날짜</span>
        <span className="w-[calc(50%-16px)]">{formattedDate}</span>
      </div>
      <div className="flex flex-row gap-[32px] mb-[16px] w-full">
        <span className="w-[calc(50%-16px)] text-right">상영시간</span>
        <span className="w-[calc(50%-16px)]">
          {formatTime(props.totalInterviewTime)}
        </span>
      </div>
    </div>
  );
}

function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes === 0) {
    return `${seconds}초`;
  }
  return `${minutes}분 ${seconds}초`;
}
