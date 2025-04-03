"use client";

import "@/app/components/blackBody.css";
import "./credit.css";
import YouTube from "react-youtube";

import { useRouter, useSearchParams } from "next/navigation";
import { useArchiveRepository } from "@/providers/ArchiveRepositoryContext";
import { Suspense, use, useEffect, useRef, useState } from "react";
import { useMemberRepository } from "@/providers/MemberRepositoryContext";
import RecapCheckbox from "./recapCheckbox";
import { MyInfo } from "@/domain/model/MyInfo";
import Image from "next/image";
import NextButton from "../../(components)/nextButton";
import ExitInterviewModal from "../../(components)/exitInterviewModal";
import { useReservationRepository } from "@/providers/ReservationRepositoryContext";
import { useStoryboardRepository } from "@/providers/StoryboardRepositoryContext";
import { Topic } from "@/domain/model/Topic";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";

export default function Page() {
  return (
    <Suspense>
      <Body />
    </Suspense>
  );
}

function Body() {
  const searchParams = useSearchParams();
  const localVideoUrl = searchParams.get("videoUrl")!;
  const storyboardId = searchParams.get("storyboardId")!;
  const totalInterviewTime = searchParams.get("totalInterviewTime")!;
  const topicId = searchParams.get("topicId")!;

  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [videoId, setVideoId] = useState<string | null>(null);
  const [nickname, setNickname] = useState<string>("");
  const [isUploaded, setIsUploaded] = useState<boolean>(false);
  const [isRecapAgreed, setIsRecapAgreed] = useState<boolean>(true);
  const [is25SecondsPassed, setIs25SecondsPassed] = useState<boolean>(false);
  const [is30SecondsPassed, setIs30SecondsPassed] = useState<boolean>(false);
  const videoPlayerRef = useRef<HTMLVideoElement>(null);
  const [topic, setTopic] = useState<Topic | null>(null);

  const archiveRepository = useArchiveRepository();
  const memberRepository = useMemberRepository();
  const reservationRepository = useReservationRepository();
  const storyboardRepository = useStoryboardRepository();

  // 중복 실행 방지
  const didUploadRef = useRef(false);
  useEffect(() => {
    if (!localVideoUrl) return;
    if (didUploadRef.current) return;
    didUploadRef.current = true;

    async function fetchAndUpload() {
      try {
        console.time("전체 변환 및 업로드 시간");

        // localVideoUrl로부터 mp4 blob 파일을 가져옵니다.
        console.log("1️⃣ blob 파일 다운로드 시작");
        console.time("blob 다운로드 시간");
        const response = await fetch(localVideoUrl);
        const inputBlob = await response.blob();
        console.timeEnd("blob 다운로드 시간");
        console.log(
          `📊 blob 파일 크기: ${(inputBlob.size / (1024 * 1024)).toFixed(2)}MB`
        );

        // ffmpeg.js 초기화 (최초 실행 시 로드)
        console.log("2️⃣ FFmpeg 초기화 시작");
        console.time("FFmpeg 초기화 시간");
        const ffmpeg = new FFmpeg();
        if (!ffmpeg.loaded) {
          await ffmpeg.load();
        }
        console.timeEnd("FFmpeg 초기화 시간");

        // ffmpeg 가상 파일 시스템에 webm 파일 작성
        console.log("3️⃣ 가상 파일 시스템에 MP4 쓰기 시작");
        console.time("파일 쓰기 시간");
        const inputVideoData = await fetchFile(inputBlob);
        ffmpeg.writeFile("input.webm", inputVideoData);
        console.timeEnd("파일 쓰기 시간");
        console.log("   ✅ 파일 쓰기 완료");

        // ffmpeg를 이용한 코덱 및 확장자 전환
        console.log("4️⃣ 변환 시작");
        console.time("변환 시간");
        
        await ffmpeg.exec([
          "-i",
          "input.webm",
          "-preset",
          "veryfast",
          "-c",
          "copy",
          "-movflags",
          "faststart",
          "output.mp4",
        ]);
        console.timeEnd("변환 시간");
        console.log("✅ 변환 완료");

        // 변환된 mp4 파일 읽어오기
        console.log("5️⃣ 변환된 MP4 파일 읽기");
        console.time("MP4 파일 읽기 시간");
        const mp4Data = await ffmpeg.readFile("output.mp4");
        const mp4Blob = new Blob([mp4Data], {
          type: "video/mp4",
        });
        console.timeEnd("MP4 파일 읽기 시간");
        console.log(
          `📊 MP4 파일 크기: ${(mp4Blob.size / (1024 * 1024)).toFixed(2)}MB`
        );

        // mp4 Blob을 이용해 영상 업로드 요청
        console.log("6️⃣ 서버에 MP4 파일 업로드 시작");
        console.time("업로드 시간");
        const videoId = await archiveRepository.uploadVideo(
          mp4Blob,
          storyboardId
        );
        console.timeEnd("업로드 시간");

        setIsUploaded(true);
        setVideoId(videoId);
        console.log("✅ 전체 프로세스 완료 - 비디오 업로드 성공:", videoId);
        console.timeEnd("전체 변환 및 업로드 시간");
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

  // blob 영상 2배속 설정
  useEffect(() => {
    if (videoPlayerRef.current) {
      videoPlayerRef.current.playbackRate = 2;
    }
  }, []);

  useEffect(() => {
    storyboardRepository
      .getTopicOfStoryboard(storyboardId)
      .then((topics: Topic[]) => {
        if (topics === null || topics.length === 0) {
          console.error("topics not found");
          return;
        }

        setTopic(topics[0]);
      });
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setIs25SecondsPassed(true);
    }, 25000);

    setTimeout(() => {
      setIs30SecondsPassed(true);
    }, 30000);
  }, []);

  return (
    <ExitInterviewModal
      isOpen={isModalOpen}
      setIsOpen={setIsModalOpen}
      onExitInterview={() => router.replace("/")}
    >
      <div className="relative h-[calc(100dvh)] w-[calc(100dvw)]">
        <Image
          unoptimized
          src="/icons/x.svg"
          width={32}
          height={32}
          alt="close"
          onClick={() => setIsModalOpen(true)}
          className="fixed top-[10px] right-[10px] px-[16px] py-[12px] w-[64px] h-[56px] focus:outline-none cursor-pointer"
        />
        {/* 왼쪽 하단 blob 영상 */}
        <div className="fixed flex flex-col bottom-[24px] left-[24px] z-[2]">
          <video
            ref={videoPlayerRef}
            src={localVideoUrl}
            autoPlay
            loop
            muted
            className="rounded-[10px] w-[450px] h-[240px]"
            style={{
              objectFit: "cover",
            }}
          />
          <div className="text-body4 text-grayscale-200 w-full flex justify-start mt-[10px]">
            <Image
              src="/icons/rolling-spinner-grayscale-white.gif"
              alt="spinner"
              width={24}
              height={24}
              className="mr-[8px]"
              style={{ color: "white" }}
            />
            영상이 변환되고 있어요. 잠시만 기다려주세요. 이 작업은 30초 정도
            소요돼요.
          </div>
        </div>

        {/* 우측 하단 react-youtube 플레이어 */}
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
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
                start: 3,
                autoplay: 1,
                controls: 1,
                modestbranding: 1,
                rel: 0,
              },
            }}
          />
          <div className="text-body4 text-grayscale-200 w-full flex justify-center mt-[4px]">
            DANIEL - 은방울
          </div>
        </div>

        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center">
          <div
            className={`flex flex-col items-end gap-[10px] transition-all ${
              is25SecondsPassed
                ? "opacity-100"
                : "opacity-0 pointer-events-none"
            }`}
          >
            <RecapCheckbox onChange={(checked) => setIsRecapAgreed(checked)} />
          </div>

          <div
            className={`flex flex-col items-end gap-[10px] transition-all  ${
              isUploaded && is25SecondsPassed
                ? "opacity-100"
                : "opacity-0 pointer-events-none"
            }`}
          >
            <NextButton
              onClick={() => {
                if (isRecapAgreed) {
                  const after7Day = new Date(Date.now());
                  after7Day.setDate(after7Day.getDate() + 7);
                  reservationRepository.reserveVideoRecap(videoId!, after7Day);
                }
                router.push(`/interview/finish/naming?videoId=${videoId}`);
              }}
              useKeyboardShortcut={false}
            />
          </div>
        </div>

        {/* 크레딧 애니메이션 영역 */}
        <div className="absolute top-0 left-0 creditsAnimation flex flex-col items-center h-[100dvh] overflow-hidden w-[100dvw]">
          <Roster
            myNickname={nickname}
            totalInterviewTime={Number(totalInterviewTime)}
            topic={topic ? topic.name : ""}
          />
        </div>
      </div>
    </ExitInterviewModal>
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
