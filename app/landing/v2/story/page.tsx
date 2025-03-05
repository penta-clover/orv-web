"use client";

import { useRouter } from "next/navigation";
import ActionBar from "./actionBar";
import Image from "next/image";

import "@/app/components/blackBody.css";
import { useEffect, useState } from "react";
import YouTube, { YouTubeEvent, YouTubePlayer } from "react-youtube";
import { useSidebar } from "../sidebarContext";

export default function Page() {
  const router = useRouter();
  const { setIsSidebarOpen } = useSidebar()!;

  return (
    <div className="flex flex-col w-full items-center">
      <ActionBar
        title="브랜드 스토리"
        onClickBack={router.back}
        onClickMenu={() => setIsSidebarOpen(true)}
      />

      <CoverImage />

      <div className="h-[24px]" />

      <FirstQuestion />

      <div className="h-[48px]" />

      <SecondQuestion />

      <div className="h-[72px]" />

      <div
        className="flex flex-row justify-center items-center bg-gd rounded-[12px] h-[56px] w-[calc(100%-32px)] mx-[16px] text-head4 text-grayscale-800 active:scale-95 transition-all"
        onClick={() => router.push("/landing/v2/pricing")}
      >
        오브 얼리버드 신청하기
      </div>

      <div className="h-[20px]" />

      <div
        className="flex flex-row justify-center items-center bg-main-lilac50 rounded-[12px] h-[56px] w-[calc(100%-32px)] mx-[16px] text-head4 text-grayscale-800 active:scale-95 transition-all"
        onClick={() => router.push("/landing/v2")}
      >
        소개 페이지로 돌아가기
      </div>

      <div className="h-[32px]" />
    </div>
  );
}

function CoverImage() {
  return (
    <div className="relative w-full h-[294px] overflow-hidden">
      <Image
        src="/images/writing-hand.png"
        fill
        alt="cover image"
        style={{
          objectFit: "cover",
          objectPosition: "center",
        }}
        className="w-full h-full"
      />

      <div className="absolute bottom-[27px] mx-[16px] text-head3 text-grayscale-200 break-words">
        안녕하세요 나를 마주하는 시간, 오브를 만들고 있습니다. 이 글에서는
        여러분들이 궁금해하실 2가지에 대해 인터뷰 형식으로 답변 드려 볼게요ㅎㅎ
      </div>
    </div>
  );
}

function FirstQuestion() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [player, setPlayer] = useState<YouTubePlayer>(null);

  const onReady = (event: YouTubeEvent) => {
    setPlayer(event.target);
  };

  useEffect(() => {
    if (isPlaying && player) {
      // 사용자 클릭 이벤트로 트리거되었으므로 재생을 시도함
      player.playVideo();
    }
  }, [isPlaying, player]);

  return (
    <div className="flex flex-col w-full px-[15px]">
      <span className="text-grayscale-white text-head2 mb-[16px]">
        Q. 왜 오브를 만들었나요?
      </span>

      <div className="relative w-[calc(100%-30px)] aspect-video mb-[24px] mx-[15px] flex items-center justify-center">
        <div className="h-full w-full rounded-[8px] overflow-hidden">
          <YouTube
            videoId="AJ9vAOwWmGI"
            opts={{
              width: "100%",
              height: "100%",
            }}
            onReady={onReady}
            className="w-full h-full"
          />
          <Image
            src={"/images/billie-interview-thumbnail.png"}
            fill
            alt="Billie interview thumbnail"
            className="w-full h-full"
            hidden={isPlaying}
            onClick={() => setIsPlaying(true)}
          />
        </div>
      </div>

      <div className="flex flex-row gap-[12px]">
        <div className="w-[2px] shrink-0 rounded inset-y-0 bg-grayscale-600" />

        <div className="flex flex-col gap-[24px]">
          <div className="text-head4 text-grayscale-100">
            이 영상 때문이었어요!
            <br />꼭 먼저 보시기를 추천 드려요!
          </div>

          <div className="text-body2 text-grayscale-400 break-words">
            빌리 아일리시의 4년간의 인터뷰를 보고 모든 사람에게 이 경험을
            시켜주고 싶었어요. 꼭 유명인이나 성공한 사람이 아니어도 나를 인터뷰
            한다는 것은 너무나도 가슴 뛰는 일이라고 느꼈거든요.
          </div>
          <div className="text-body2 text-grayscale-400 break-words">
            요즘은 외부에 너무 자극적이고 재미있는게 너무 많다보니 우리의 모든
            관심이 밖에 쏠려있었어요. 그러면서 나 스스로에 대해 궁금해하지 않는
            것 같아요.
          </div>

          <div className="text-body2 text-grayscale-400 break-words">
            하지만 나 스스로를 알아가는 일은 내가 하지 않는다면 그 누구도
            대신해주지 않아요. 그래서 나한테 질문을 던지는 인터뷰 포맷으로
            사람들이 스스로를 마주하는 것을 도와주려고요! 오브는 그렇게
            시작되었답니다ㅎㅎ
          </div>
        </div>
      </div>
    </div>
  );
}

function SecondQuestion() {
  return (
    <div className="flex flex-col w-full px-[15px]">
      <span className="text-grayscale-white text-head2 mb-[16px]">
        Q. 오브는 왜 무료가 아닌가요?
      </span>

      <div className="flex flex-row gap-[12px]">
        <div className="w-[2px] shrink-0 rounded inset-y-0 bg-grayscale-600" />

        <div className="flex flex-col gap-[24px]">
          <div className="text-body2 text-grayscale-400 break-words">
            첫번째로는 나를 알아가는 것의 가치를 알고 계신 분들이 와주시기를
            바라는 마음이었어요. 나 스스로를 알아볼 기회에 어느 정도를 투자할 수
            있는 분들이어야만 오브의 가치를 그대로 느낄 수 있을 것이라고
            생각했습니다.
          </div>
          <div className="text-body2 text-grayscale-400 break-words">
            두번째로는 더 많은 사람들이 이 서비스를 오래 사용할 수 있도록 하려면
            지속 가능함이 필요했어요. 장기적으로 여러분께 더 가치 있는 경험을
            제공하기 위한 선택이라고 생각해주시면 될 것 같아요.
          </div>

          <div className="text-body2 text-grayscale-400 break-words">
            오브를 꼭 추천 드려요. 이번 기회를 놓치면 스스로를 알아볼 기회는
            아마 영영 없을 거거든요. 지금 눈 딱 감고 한번 나 스스로를 인터뷰
            해보세요! 기다리고 있을게요ㅎㅎ
          </div>
        </div>
      </div>
    </div>
  );
}
