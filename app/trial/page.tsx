"use client";

import { useEffect, useRef, useState } from "react";
import "@/app/trial/blackBody.css";

import Image from "next/image";

export default function Page() {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);

  const questions = [
    "나를 설명하는 한 단어는 무엇인가요?",
    "살아오며 가장 행복했던 순간은 언제인가요?",
    "나에게 가장 소중한 것은 무엇인가요?",
    "내일 죽는다면 오늘은 무얼 하고 싶은가요?",
    "무엇들 사이에서 갈등하고 있나요?",
    "지난 1년 동안 얻은 것중 가장 값진 것은 무엇인가요?",
  ];

  return (
    <div className="relative w-full h-[100dvh] flex flex-col justify-center">
      <div className="relative inset-y-0 max-h-[100dvh] overflow-y-hidden">
        <div>
          <Image src="/images/studio-lighting.png" fill alt="studio-lighting" />
        </div>
        <CameraComponent />
        <div className="absolute top-[0] z-50 w-full h-full flex flex-col justify-end items-start">
          {/* <div className="bg-grayscale-black text-grayscale-white text-head3 px-[10px] py-[5px] flex justify-center items-center">
            {`Q${currentQuestionIdx + 1}. ${questions[currentQuestionIdx]}`}
          </div> */}

          <div className="font-semibold text-head4 lg:text-[33px] lg:leading-[54px] text-grayscale-white text-center ml-[25px] lg:ml-[72px]">
            다섯번째 질문
          </div>
          <div className="font-light text-body1 lg:text-[44px] lg:leading-[54px] text-grayscale-white text-center ml-[25px] lg:ml-[72px] text-start">
            어렸을 때 상상했던 지금 나이의 내 모습과 지금의 나는 무엇이
            다른가요?
          </div>
          <div className="h-[3vh] lg:h-[70px]" />
        </div>
      </div>

      {/* <div className="absolute bottom-[50px] flex flex-row w-full justify-end">
        <button
          className="bg-grayscale-100 rounded px-[10px] py-[10px]"
          onClick={() =>
            setCurrentQuestionIdx((prev) => (prev + 1) % questions.length)
          }
        >
          다음으로
        </button>
      </div> */}
    </div>
  );
}

function CameraComponent() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // 브라우저 환경인지 확인
    if (typeof window !== "undefined" && navigator.mediaDevices) {
      const enableCamera = async () => {
        try {
          // 사용자에게 카메라 접근 권한 요청
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
          });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (error) {
          console.error("카메라를 활성화하는 도중 에러 발생:", error);
        }
      };

      enableCamera();
    }
  }, []);

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      //   style={{ width: "100%", filter: "grayscale(100%)" }}
      style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover" }}
    />
  );
}
