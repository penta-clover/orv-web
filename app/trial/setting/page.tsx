"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import "@/app/components/blackBody.css";
import { CameraComponent } from "./cameraComponent";
import ActionBar from "./actionBar";

export default function Page() {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [filter, setFilter] = useState<string>("");

  const [recording, setRecording] = useState<boolean>(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

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
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = "recorded-video.webm";
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    setRecordedChunks([]); // 다운로드 후 초기화
  };

  const questions = [
    "나를 설명하는 한 단어는 무엇인가요?",
    "살아오며 가장 행복했던 순간은 언제인가요?",
    "나에게 가장 소중한 것은 무엇인가요?",
    "내일 죽는다면 오늘은 무얼 하고 싶은가요?",
    "무엇들 사이에서 갈등하고 있나요?",
    "지난 1년 동안 얻은 것중 가장 값진 것은 무엇인가요?",
    "어렸을 때 상상했던 지금 나이의 내 모습과 지금의 나는 무엇이 다른가요?",
  ];

  return (
    <div className="relative w-full flex flex-col items-center">
      <div className="absolute top-0 w-full max-w-[1200px] ">
        <ActionBar
          onClickGuide={() => console.log("사용 가이드")}
          onClickExplore={() => console.log("둘러보기")}
        />
      </div>
      <div className="relative w-full max-w-[1200px] h-[100dvh] flex flex-col justify-center">
        <div className="relative inset-y-0 max-h-[100dvh] lg:max-h-[90dvh] overflow-y-hidden">
          <div
            className="relative inset-y-0"
            style={{ filter: filter || "none" }}
          >
            <div className="absolute inset-0 z-10">
              <Image unoptimized 
                src="https://d3bdjeyz3ry3pi.cloudfront.net/static/images/studio-lighting.png"
                fill
                alt="studio-lighting"
              />
            </div>
            <div style={{ transform: "scaleX(-1)" }}>
            <CameraComponent ref={videoRef} />
            </div>
          </div>
          <div className="absolute top-[0] z-50 w-full h-full flex flex-col justify-end items-start">
            <div className="font-semibold text-head4 lg:text-[24px] lg:leading-[36px] text-grayscale-white text-center ml-[20px] mr-[20px] lg:ml-[48px]">
              다섯번째 질문
            </div>
            <div className="font-light text-body1 leading-[20px] lg:text-[32px] lg:leading-[36px] text-grayscale-white text-center ml-[20px] mr-[20px] lg:ml-[48px] text-start">
              {questions[currentQuestionIdx]}
            </div>
            <div className="h-[2vh] lg:h-[48px]" />
          </div>
        </div>

        {/* 녹화 관련 버튼 영역 */}
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

        <div className="absolute bottom-0 w-full overflow-x-auto py-2 h-[50px] hide-scrollbar">
          <div className="absolute bottom-[0px] flex flex-row justify-end gap-[5px]">
            {/* 원본 – 중립 */}
            <button
              className="h-[50px] w-[100px] rounded bg-white text-black px-[10px] py-[5px] whitespace-nowrap"
              onClick={() => setFilter("")}
            >
              원본
            </button>
            {/* 갈색 – 따뜻한 느낌 */}
            <button
              className="h-[50px] w-[100px] rounded bg-orange-600 text-white px-[10px] py-[5px] whitespace-nowrap"
              onClick={() => setFilter("sepia(100%)")}
            >
              갈색
            </button>
            {/* 흑백 – 모던하고 심플 */}
            <button
              className="h-[50px] w-[100px] rounded bg-black text-white px-[10px] py-[5px] whitespace-nowrap"
              onClick={() => setFilter("grayscale(100%)")}
            >
              흑백
            </button>
            {/* 반전 – 대비가 뚜렷 */}
            <button
              className="h-[50px] w-[100px] rounded bg-gray-300 text-black px-[10px] py-[5px] whitespace-nowrap"
              onClick={() => setFilter("invert(100%)")}
            >
              반전
            </button>
            {/* 블러 – 부드러운 느낌 */}
            <button
              className="h-[50px] w-[100px] rounded bg-blue-300 text-white px-[10px] py-[5px] whitespace-nowrap"
              onClick={() => setFilter("blur(3px)")}
            >
              블러
            </button>
            {/* 높은 대비 – 강렬하게 */}
            <button
              className="h-[50px] w-[100px] rounded bg-gray-800 text-white px-[10px] py-[5px] whitespace-nowrap"
              onClick={() => setFilter("contrast(200%)")}
            >
              높은 대비
            </button>
            {/* 밝기 증가 – 밝고 환한 */}
            <button
              className="h-[50px] w-[100px] rounded bg-yellow-400 text-black px-[10px] py-[5px] whitespace-nowrap"
              onClick={() => setFilter("brightness(150%)")}
            >
              밝기 증가
            </button>
            {/* 채도 증가 – 강렬한 색감 */}
            <button
              className="h-[50px] w-[100px] rounded bg-red-500 text-white px-[10px] py-[5px] whitespace-nowrap"
              onClick={() => setFilter("saturate(150%)")}
            >
              채도 증가
            </button>
            {/* 색상 회전 – 컬러풀하게 */}
            <button
              className="h-[50px] w-[100px] rounded bg-purple-500 text-white px-[10px] py-[5px] whitespace-nowrap"
              onClick={() => setFilter("hue-rotate(80deg)")}
            >
              색상 회전
            </button>
            {/* 네추럴 – 자연스러운 느낌 */}
            <button
              className="h-[50px] w-[100px] rounded bg-green-300 text-black px-[10px] py-[5px] whitespace-nowrap"
              onClick={() =>
                setFilter("brightness(105%) contrast(105%) saturate(100%)")
              }
            >
              네추럴
            </button>
            {/* 소프트 – 부드러운 파스텔톤 */}
            <button
              className="h-[50px] w-[100px] rounded bg-blue-200 text-black px-[10px] py-[5px] whitespace-nowrap"
              onClick={() =>
                setFilter("brightness(110%) contrast(85%) saturate(110%)")
              }
            >
              소프트
            </button>
            {/* 세련된 – 모던하고 고급스러운 느낌 */}
            <button
              className="h-[50px] w-[100px] rounded bg-blue-600 text-white px-[10px] py-[5px] whitespace-nowrap"
              onClick={() =>
                setFilter(
                  "brightness(100%) contrast(115%) saturate(120%) hue-rotate(10deg)"
                )
              }
            >
              세련된
            </button>
            {/* 몽환적 – 신비로운 느낌 */}
            <button
              className="h-[50px] w-[100px] rounded bg-indigo-300 text-white px-[10px] py-[5px] whitespace-nowrap"
              onClick={() =>
                setFilter(
                  "sepia(20%) brightness(115%) saturate(125%) hue-rotate(15deg)"
                )
              }
            >
              몽환적
            </button>
            {/* 레트로 – 빈티지한 느낌 */}
            <button
              className="h-[50px] w-[100px] rounded bg-yellow-600 text-white px-[10px] py-[5px] whitespace-nowrap"
              onClick={() =>
                setFilter("sepia(50%) contrast(85%) brightness(105%)")
              }
            >
              레트로
            </button>
            {/* 차분한 – 안정적인 느낌 */}
            <button
              className="h-[50px] w-[100px] rounded bg-gray-300 text-black px-[10px] py-[5px] whitespace-nowrap"
              onClick={() =>
                setFilter("brightness(105%) contrast(95%) saturate(90%)")
              }
            >
              차분한
            </button>
            {/* 로맨틱 – 부드러운 핑크톤 */}
            <button
              className="h-[50px] w-[100px] rounded bg-pink-300 text-white px-[10px] py-[5px] whitespace-nowrap"
              onClick={() =>
                setFilter(
                  "sepia(40%) brightness(120%) contrast(100%) saturate(140%)"
                )
              }
            >
              로맨틱
            </button>
            {/* 신비로운 – 어두운 보라톤 */}
            <button
              className="h-[50px] w-[100px] rounded bg-purple-700 text-white px-[10px] py-[5px] whitespace-nowrap"
              onClick={() =>
                setFilter(
                  "hue-rotate(20deg) brightness(105%) contrast(105%) saturate(130%)"
                )
              }
            >
              신비로운
            </button>
            {/* Clarendon */}
            <button
              className="h-[50px] w-[100px] rounded bg-blue-500 text-white px-[10px] py-[5px] whitespace-nowrap"
              onClick={() =>
                setFilter("brightness(105%) contrast(115%) saturate(130%)")
              }
            >
              Clarendon
            </button>
            {/* Gingham */}
            <button
              className="h-[50px] w-[100px] rounded bg-orange-300 text-white px-[10px] py-[5px] whitespace-nowrap"
              onClick={() =>
                setFilter("brightness(105%) contrast(85%) saturate(90%)")
              }
            >
              Gingham
            </button>
            {/* Juno */}
            <button
              className="h-[50px] w-[100px] rounded bg-orange-500 text-white px-[10px] py-[5px] whitespace-nowrap"
              onClick={() =>
                setFilter("brightness(110%) contrast(110%) saturate(140%)")
              }
            >
              Juno
            </button>
            {/* Ludwig */}
            <button
              className="h-[50px] w-[100px] rounded bg-gray-200 text-black px-[10px] py-[5px] whitespace-nowrap"
              onClick={() =>
                setFilter("brightness(105%) contrast(110%) saturate(80%)")
              }
            >
              Ludwig
            </button>
            {/* Lark */}
            <button
              className="h-[50px] w-[100px] rounded bg-blue-100 text-black px-[10px] py-[5px] whitespace-nowrap"
              onClick={() =>
                setFilter("brightness(115%) contrast(95%) saturate(80%)")
              }
            >
              Lark
            </button>
            {/* Reyes */}
            <button
              className="h-[50px] w-[100px] rounded bg-pink-400 text-white px-[10px] py-[5px] whitespace-nowrap"
              onClick={() =>
                setFilter(
                  "sepia(15%) brightness(115%) contrast(90%) saturate(90%)"
                )
              }
            >
              Reyes
            </button>
            {/* Valencia */}
            <button
              className="h-[50px] w-[100px] rounded bg-yellow-300 text-black px-[10px] py-[5px] whitespace-nowrap"
              onClick={() =>
                setFilter(
                  "sepia(20%) brightness(110%) contrast(90%) saturate(100%)"
                )
              }
            >
              Valencia
            </button>
            {/* X-Pro II */}
            <button
              className="h-[50px] w-[100px] rounded bg-red-700 text-white px-[10px] py-[5px] whitespace-nowrap"
              onClick={() =>
                setFilter("brightness(95%) contrast(125%) saturate(150%)")
              }
            >
              X-Pro II
            </button>
            {/* VSCO A6 */}
            <button
              className="h-[50px] w-[100px] rounded bg-green-200 text-black px-[10px] py-[5px] whitespace-nowrap"
              onClick={() =>
                setFilter("brightness(110%) contrast(100%) saturate(110%)")
              }
            >
              VSCO A6
            </button>
            {/* 화사한 */}
            <button
              className="h-[50px] w-[100px] rounded bg-yellow-400 text-black px-[10px] py-[5px] whitespace-nowrap"
              onClick={() =>
                setFilter("brightness(120%) contrast(100%) saturate(140%)")
              }
            >
              화사한
            </button>
            {/* 따뜻한 */}
            <button
              className="h-[50px] w-[100px] rounded bg-orange-400 text-white px-[10px] py-[5px] whitespace-nowrap"
              onClick={() =>
                setFilter("sepia(30%) brightness(110%) saturate(130%)")
              }
            >
              따뜻한
            </button>
            {/* 빈티지 */}
            <button
              className="h-[50px] w-[100px] rounded bg-yellow-600 text-white px-[10px] py-[5px] whitespace-nowrap"
              onClick={() =>
                setFilter(
                  "sepia(40%) brightness(105%) contrast(85%) saturate(90%)"
                )
              }
            >
              빈티지
            </button>
            {/* 청량한 */}
            <button
              className="h-[50px] w-[100px] rounded bg-blue-400 text-white px-[10px] py-[5px] whitespace-nowrap"
              onClick={() =>
                setFilter(
                  "hue-rotate(-10deg) brightness(115%) contrast(105%) saturate(120%)"
                )
              }
            >
              청량한
            </button>
            {/* 모노톤 */}
            <button
              className="h-[50px] w-[100px] rounded bg-gray-800 text-white px-[10px] py-[5px] whitespace-nowrap"
              onClick={() =>
                setFilter("grayscale(100%) brightness(110%) contrast(90%)")
              }
            >
              모노톤
            </button>
            {/* 다음 질문 – 기본 스타일 */}
            <button
              className="h-[50px] w-[100px] rounded bg-blue-500 text-white px-[10px] py-[5px] whitespace-nowrap"
              onClick={() =>
                setCurrentQuestionIdx((prev) => (prev + 1) % questions.length)
              }
            >
              다음 질문
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
