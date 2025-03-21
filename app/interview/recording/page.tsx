"use client";

import "@/app/components/blackBody.css";
import { CameraComponent } from "./cameraComponent";
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function Page() {
  const searchParams = useSearchParams();
  const storyboardId = searchParams.get("storyboardId")!;
  const [recording, setRecording] = useState<boolean>(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter()

  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    // 컴포넌트가 마운트될 때 인터뷰 시작 시간 기록
    startTimeRef.current = Date.now();
  }, []);


  // 녹화 시작 함수
  const startRecording = () => {
    if (!videoRef.current) return;
    // video의 srcObject에 할당된 stream을 가져옵니다.
    const stream = videoRef.current.srcObject as MediaStream;
    if (!stream) return;

    try {
      const recorder = new MediaRecorder(stream, {
        mimeType: "video/webm; codecs=vp9,opus",
      });
      mediaRecorderRef.current = recorder;
      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          setRecordedChunks((prev) => [...prev, event.data]);
        }
      };
      recorder.start();
      setRecording(true);
    } catch (error) {
      console.error("녹화 시작 에러:", error);
    }
  };

  // 녹화 중지 함수
  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  // 녹화된 파일 다운로드 함수
  const downloadRecording = () => {
    if (recordedChunks.length === 0) return;
    const blob = new Blob(recordedChunks, { type: "video/webm" });
    const url = URL.createObjectURL(blob);

    // 인터뷰 전체 시간 계산 (초 단위)
    const totalInterviewTime = Math.floor((Date.now() - startTimeRef.current) / 1000);

    router.replace(`/interview/finish/credit?videoUrl=${url}&storyboardId=${storyboardId}&totalInterviewTime=${totalInterviewTime}`);

    setRecordedChunks([]); // 다운로드 후 초기화
  };

  return (
    <div className="flex flex-col items-center">
      {/* 카메라 영역 */}
      <div className="relative inset-y-0">
        <div style={{ transform: "scaleX(-1)" }}>
          <CameraComponent ref={videoRef} />
        </div>
      </div>

      {/* (개발용) 녹화 관련 버튼 영역 */}
      <div className="absolute bottom-20 left-4 flex gap-2">
        {!recording ? (
          <button
            className="bg-green-500 text-white rounded px-4 py-2"
            onClick={startRecording}
          >
            녹화 시작
          </button>
        ) : (
          <button
            className="bg-red-500 text-white rounded px-4 py-2"
            onClick={stopRecording}
          >
            녹화 중지
          </button>
        )}
        <button
          className="bg-blue-500 text-white rounded px-4 py-2"
          onClick={downloadRecording}
          disabled={recordedChunks.length === 0}
        >
          파일 다운로드
        </button>
      </div>
    </div>
  );
}
