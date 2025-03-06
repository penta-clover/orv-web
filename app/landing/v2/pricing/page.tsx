"use client";

import { useRouter } from "next/navigation";
import ActionBar from "./actionBar";
import "@/app/components/blackBody.css";

import FAQ from "@/app/components/faq";
import ChannelTalkButton from "@/app/components/channelTalkButton";
import { useSidebar } from "../sidebarContext";

export default function Page() {
  const router = useRouter();
  const { setIsSidebarOpen } = useSidebar()!;

  return (
    <div className="flex flex-col items-center justify-center">
      <ActionBar
        title="오브 티켓 구매하기"
        onClickBack={() => router.back()}
        onClickMenu={() => setIsSidebarOpen(true)}
      />

      <div className="h-[16px]" />

      <Headline />

      <div className="h-[40px]" />

      <OneTimeTicket
        onClickBuyTicket={() => {
          router.push(
            "/landing/v2/payment?productName=<삶과 나> 인터뷰 1회 이용권&price=2200"
          );
        }}
      />

      <div className="h-[32px]" />

      <PackageTicket
        onClickBuyTicket={() => {
          router.push(
            "/landing/v2/payment?productName=<삶과 나> 인터뷰 패키지 평생 이용권&price=7800"
          );
        }}
      />

      <div className="h-[44px]" />

      <FAQ faqData={getFAQData()} />

      <div className="h-[36px]" />

      <div className="w-full pl-[16px]">
        <ChannelTalkButton text="1:1 문의" className="h-[38px]" />
      </div>

      <div className="h-[32px]" />

      <div className="text-head3 text-grayscale-white w-full pl-[16px]">
        아직 고민된다면?
      </div>

      <div className="h-[16px]" />

      <button
        className="w-[calc(100%-32px)] h-[56px] text-head3 text-grayscale-800 bg-main-lilac50 rounded-[12px] transition-all active:scale-95"
        onClick={() => {
          router.push("/landing/v2/story");
        }}
      >
        오브의 첫 탄생 영상 보러가기
      </button>

      <div className="h-[32px]" />
    </div>
  );
}

function Headline() {
  return (
    <div className="flex flex-col items-center w-full">
      <div className="text-head1 text-grayscale-white mb-[16px]">
        오브에서 인터뷰를 경험해보세요
      </div>

      <div className="text-body2 text-grayscale-400">
        나 스스로를 알아보는 일, 혼자라면 하지 않을 거예요
      </div>
      <div className="text-body2 text-grayscale-400">
        오브와 그 시작을 함께 해요
      </div>
    </div>
  );
}

function OneTimeTicket(props: { onClickBuyTicket: () => void }) {
  return (
    <div className="flex flex-col w-[calc(100%-60px)] min-w-[315px] mx-[30px] bg-grayscale-white rounded-[8px] p-[18px]">
      <span className="text-head3 text-grayscale-black mb-[2px]">
        &lt;삶과 나&gt; 인터뷰 1회 이용권
      </span>
      <span className="text-body3 text-grayscale-500 mb-[16px]">
        커피 한잔의 가격으로 인터뷰를 경험해볼 수 있어요
      </span>
      <span className="bg-grayscale-100 w-full h-[1px] mb-[12px]" />

      <div className="flex justify-between items-center mb-[16px]">
        <span className="text-system-warning text-head4 line-through">
          정가 3,300원
        </span>
        <span className="text-head1">2,200원</span>
      </div>

      <div
        className="flex justify-center items-center bg-main-lilac50 rounded-[10px] w-full h-[44px] active:scale-95 transition-all text-head4 text-grayscale-800 mb-[16px]"
        onClick={props.onClickBuyTicket}
      >
        티켓 구매하기
      </div>

      <div className="flex flex-col text-body4 text-grayscale-500">
        <span>&nbsp;&middot; 15가지 주제 중 택 1</span>
        <span>&nbsp;&middot; 4가지 카메라 필터</span>
        <span>&nbsp;&middot; 인터뷰 마무리 즉시 인코딩</span>
        <span>&nbsp;&middot; 제한 없는 인터뷰 시간</span>
      </div>
    </div>
  );
}

function PackageTicket(props: { onClickBuyTicket: () => void }) {
  return (
    <div className="flex flex-col w-[calc(100%-60px)] min-w-[315px] mx-[30px] bg-grayscale-white rounded-[8px] p-[18px]">
      <div className="flex flex-row gap-[4px] mb-[12px]">
        <span className="flex items-center justify-center w-[39px] h-[24px] bg-system-info text-grayscale-white rounded-[4px] text-body3">
          추천
        </span>
        <span className="flex items-center justify-center w-[63px] h-[24px] bg-grayscale-black text-grayscale-white rounded-[4px] text-body3">
          평생이용
        </span>
      </div>
      <span className="text-head3 text-grayscale-black mb-[2px]">
        &lt;삶과 나&gt; 인터뷰 패키지 평생 이용권
      </span>
      <span className="text-body3 text-grayscale-500">
        생각이 많은 날이라면 언제든 와서 털어놓으세요
      </span>

      <span className="bg-grayscale-100 w-full h-[1px] mb-[12px]" />

      <div className="flex justify-between items-center mb-[16px]">
        <span className="text-system-warning text-head4 line-through">
          정가 12,500원
        </span>
        <span className="text-head1">7,800원</span>
      </div>

      <div
        className="flex justify-center items-center bg-main-lilac50 rounded-[10px] w-full h-[44px] active:scale-95 transition-all text-head4 text-grayscale-800 mb-[16px]"
        onClick={props.onClickBuyTicket}
      >
        티켓 구매하기
      </div>

      <div className="flex flex-col text-body4 text-grayscale-500">
        <span>&nbsp;&middot; 15가지 주제 평생 소장 및 이용</span>
        <span>&nbsp;&middot; 4가지 카메라 필터</span>
        <span>&nbsp;&middot; 인터뷰 마무리 즉시 인코딩</span>
        <span>&nbsp;&middot; 녹화 영상 다운로드</span>
        <span>&nbsp;&middot; 제한 없는 인터뷰 시간</span>
      </div>
    </div>
  );
}

function getFAQData() {
  const faqData = [
    {
      question: "1회권이 아닌 이유는 무엇인가요?",
      answer: "예시 답변: 1회권이 아닌 이유에 대한 자세한 설명...",
    },
    {
      question: "인터뷰 주제는 몇 개로 구성되어 있나요?",
      answer:
        "예시 답변: 인터뷰 주제는 총 몇 개이며 어떤 내용들로 구성되어 있는지...",
    },
    {
      question: "오브 프로세스가 어떻게 되나요?",
      answer: "예시 답변: 오브 프로세스(OB Process)에 대한 상세한 진행 절차...",
    },
    {
      question: "오브 프로세스가 어떻게 되나요? (중복)",
      answer: "예시 답변: 동일 질문에 대한 예시 답변...",
    },
  ];

  return faqData;
}
