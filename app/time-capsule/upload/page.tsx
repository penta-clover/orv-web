"use client";

import { useArchiveRepository } from "@/providers/ArchiveRepositoryContext";
import { useTempBlobRepository } from "@/providers/TempBlobRepositoryContext";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import "@/app/components/blackBody.css";
import { useMemberRepository } from "@/providers/MemberRepositoryContext";

export default function Page() {
  return (
    <Suspense>
      <Body />
    </Suspense>
  );
}

function Body() {
  const searchParams = useSearchParams();
  const blobKey = searchParams.get("blobKey")!;
  const topic = searchParams.get("topic")!;
  const gifts = searchParams.get("gift")?.split(",")!;
  const storyboardId = "C2D8A9C7-293F-4215-A717-E0C9BECD6D9B";

  const [isUploaded, setIsUploaded] = useState<boolean>(false);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [localVideoUrl, setLocalVideoUrl] = useState<string | null>(null);
  const [dotCount, setDotCount] = useState<number>(1);
  const [tipIndex, setTipIndex] = useState(0);

  const tempBlobRepository = useTempBlobRepository();
  const archiveRepository = useArchiveRepository();
  const memberRepository = useMemberRepository();

  const didProcessBlobRef = useRef(false); // 개발 환경에서 blob에 대한 중복 처리를 방지하기 위한 값

  const router = useRouter();

  const loadingTip = [
    `빛의 속도로 가속하는 중`,
    `타임워프 게이트에 접근 중`,
    `사건의 지평선을 건너가는 중`,
    `은하계를 가로질러 1년 뒤로 떠나는 중`,
  ];
  const tipDurations = [4800, 4800, 4800];

  // 점 개수 타이머
  useEffect(() => {
    const interval = setInterval(() => {
      setDotCount((prev) => (prev % 6) + 1);
    }, 400);
    return () => clearInterval(interval);
  }, []);

  // 팁 교체 타이머
  useEffect(() => {
    // tipIndex 0 → 1 after 2s, 1→2 after 4s, 2→3 after 6s
    const timers: NodeJS.Timeout[] = [];
    let acc = 0;
    for (let i = 0; i < tipDurations.length; i++) {
      acc += tipDurations[i];
      timers.push(
        setTimeout(() => {
          setTipIndex(i + 1);
        }, acc)
      );
    }
    return () => timers.forEach((t) => clearTimeout(t));
  }, []);

  useEffect(() => {
    if (!blobKey) return;
    if (didProcessBlobRef.current) return;
    didProcessBlobRef.current = true;

    async function processBlob() {
      try {
        console.time("IndexedDB에서 Blob 가져오기 및 전체 변환/업로드 시간");

        console.log("0️⃣ IndexedDB에서 Blob 가져오기 시작 (key:", blobKey, ")");
        console.time("IndexedDB 읽기 시간");
        const inputBlob = await tempBlobRepository.getBlob(blobKey);
        console.timeEnd("IndexedDB 읽기 시간");

        if (!inputBlob) {
          console.error("IndexedDB에서 Blob을 찾을 수 없습니다. key:", blobKey);
          router.replace("/");
          return;
        }
        console.log(
          `📊 가져온 blob 파일 크기: ${(inputBlob.size / (1024 * 1024)).toFixed(
            2
          )}MB`
        );

        const blobUrl = URL.createObjectURL(inputBlob);
        setLocalVideoUrl(blobUrl);

        console.log("2️⃣ FFmpeg 초기화 시작");
        console.time("FFmpeg 초기화 시간");
        const ffmpeg = new FFmpeg();
        if (!ffmpeg.loaded) {
          await ffmpeg.load();
        }
        console.timeEnd("FFmpeg 초기화 시간");

        console.log("3️⃣ 가상 파일 시스템에 파일 쓰기 시작");
        console.time("파일 쓰기 시간");
        const inputVideoData = await fetchFile(inputBlob);
        ffmpeg.writeFile("input.webm", inputVideoData);
        console.timeEnd("파일 쓰기 시간");
        console.log("   ✅ 파일 쓰기 완료");

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

        console.log("5️⃣ 변환된 MP4 파일 읽기");
        console.time("MP4 파일 읽기 시간");
        const mp4Data = await ffmpeg.readFile("output.mp4");
        const mp4Blob = new Blob([mp4Data], { type: "video/mp4" });
        console.timeEnd("MP4 파일 읽기 시간");
        console.log(
          `📊 MP4 파일 크기: ${(mp4Blob.size / (1024 * 1024)).toFixed(2)}MB`
        );

        console.log("6️⃣ 서버에 MP4 파일 업로드 시작");
        console.time("업로드 시간");
        const uploadedVideoId = await archiveRepository.uploadVideo(
          mp4Blob,
          storyboardId
        );
        console.timeEnd("업로드 시간");

        setIsUploaded(true);
        setVideoId(uploadedVideoId);
        console.log(
          "✅ 전체 프로세스 완료 - 비디오 업로드 성공:",
          uploadedVideoId
        );
        console.timeEnd("IndexedDB에서 Blob 가져오기 및 전체 변환/업로드 시간");

        console.log("7️⃣ IndexedDB에서 Blob 삭제 시작 (key:", blobKey, ")");
        console.time("IndexedDB 삭제 시간");
        await tempBlobRepository.deleteBlob(blobKey);
        console.timeEnd("IndexedDB 삭제 시간");
        console.log("✅ IndexedDB Blob 삭제 완료");

        // 썸네일 및 비디오 이름 설정
        const myInfo = await memberRepository.getMyInfo();

        await archiveRepository.renameVideo(
          uploadedVideoId,
          `${myInfo.nickname}님의 타임캡슐`
        );

        const blob = await fetch(
          "https://d3bdjeyz3ry3pi.cloudfront.net/static/images/time-capsule-thumbnail.jpg"
        );

        const thumbnail = await archiveRepository.updateThumbnail(
          uploadedVideoId,
          await blob.blob()
        );

        router.replace(`/time-capsule/result?topic=${topic}&gift=${gifts}`);
      } catch (error) {
        console.error("Blob 처리 또는 업로드 중 에러 발생:", error);
        // 현재 페이지 새로고침
        router.refresh();
      }
    }

    processBlob();

    return () => {
      if (localVideoUrl) {
        URL.revokeObjectURL(localVideoUrl);
        console.log("미리보기 Blob URL 해제됨");
      }
    };
  }, [blobKey, tempBlobRepository, archiveRepository, storyboardId]);

  return (
    <div className="w-[100%] h-[calc(100dvh)] flex flex-col items-center justify-center">
      <Image
        src="/icons/rolling-spinner-grayscale-white.gif"
        alt="loading spinner"
        width={48}
        height={48}
      />
      <div className="h-[20px]" />
      <span className="text-body4 text-grayscale-white">
        {loadingTip[tipIndex]}
        {".".repeat(dotCount)}
      </span>
    </div>
  );
}
