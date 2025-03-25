"use client";

import { useRouter } from "next/navigation";
import ActionBar from "./actionBar";
import "@/app/components/blackBody.css";

import FAQ from "@/app/components/faq";
import ChannelTalkButton from "@/app/components/channelTalkButton";
import { useSidebar } from "../sidebarContext";
import { track } from "@/app/amplitude";
import Deadline from "../(components)/deadline";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import AutoScroll from "embla-carousel-auto-scroll";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

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
          track("click_buy_ticket", {
            product_name: "<삶과 나> 인터뷰 1회 이용권",
          });
          router.push(
            "/landing/v2/payment?productName=<삶과 나> 인터뷰 1회 이용권&price=2200"
          );
        }}
      />

      <div className="h-[32px]" />

      <PackageTicket
        onClickBuyTicket={() => {
          track("click_buy_ticket", {
            product_name: "<삶과 나> 인터뷰 패키지 평생 이용권",
          });
          router.push(
            "/landing/v2/payment?productName=<삶과 나> 인터뷰 패키지 평생 이용권&price=7800"
          );
        }}
      />

      <div className="h-[32px]" />

      <GiftTicket
        onClickBuyTicket={() => {
          track("click_buy_gift", {
            product_name: "<삶과 나> 인터뷰 이용권 선물하기"
          });
          router.push(
            "/landing/v2/payment?productName=<삶과 나> 인터뷰 이용권 선물하기&price=2800"
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
        아직 고민중인 당신이 꼭 봐야할 것👇
      </div>

      <div className="h-[16px]" />

      <button
        className="w-[calc(100%-32px)] h-[56px] text-head3 text-grayscale-800 bg-main-lilac50 rounded-[12px] transition-all active:scale-95"
        onClick={() => {
          track("click_brand_story");
          router.push("/landing/v2/story");
        }}
      >
        오브의 탄생 배경, 지금 확인하기
      </button>

      <div className="h-[32px]" />
    </div>
  );
}

function Headline() {
  const [activeIndex, setActiveIndex] = useState(0);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.6, // Increased threshold for better visibility detection
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = itemRefs.current.findIndex(
            (ref) => ref === entry.target
          );
          if (index !== -1) {
            setActiveIndex(index);
          }
        }
      });
    }, observerOptions);

    // Clear previous refs and observe current ones
    itemRefs.current.forEach((ref, index) => {
      if (ref) {
        observer.observe(ref);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [itemRefs]);

  return (
    <div className="flex flex-col items-center w-full">
      <div className="text-head1 text-grayscale-white mb-[16px]">
        오브에서만 경험할 수 있어요
      </div>

      <div className="text-body2 text-grayscale-400">
        나 스스로를 알아보는 일,{" "}
        <span className="text-grayscale-white">혼자라면 하지 않을 거예요</span>
      </div>
      <div className="text-body2 text-grayscale-400">
        오브와 그 시작을 함께 해요
      </div>

      <div className="h-[76px]" />

      <div className="flex flex-col items-center">
        <div className="text-head2 text-main-lilac50">
          얼리버드 혜택 마감까지
        </div>
        <div className="h-[4px]" />
        <Deadline
          deadline={new Date("2025-03-10T00:00:00+09:00")}
          onDeadline={() => {
            // nothing to do
          }}
        />
      </div>

      <div className="h-[33px]" />

      <Carousel
        opts={{
          align: "center",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="flex">
          {[
            "https://d3bdjeyz3ry3pi.cloudfront.net/static/images/gift-banner-item-1.jpg",
            "https://d3bdjeyz3ry3pi.cloudfront.net/static/images/gift-banner-item-2.jpg",
            "https://d3bdjeyz3ry3pi.cloudfront.net/static/images/gift-banner-item-3.jpg",
          ].map((image, index) => (
            <CarouselItem
              key={index}
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
              className={`w-[278.39px] h-[95.5px] p-0 ml-[25px] basis-auto rounded-[8px]
                ${activeIndex === index ? "opacity-100" : "opacity-60"}`}
            >
              <Image unoptimized 
                src={image}
                width={278.39}
                height={95.5}
                alt="card"
                className="rounded w-[278.39px] h-[95.5px] rounded-[8px]"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
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
        <span>&nbsp;&middot; 20가지 주제 중 택 1</span>
        <span>&nbsp;&middot; 4가지 카메라 필터</span>
        <span>&nbsp;&middot; 제한 없는 인터뷰 진행시간</span>
        <span>&nbsp;&middot; 인터뷰 녹화 영상 및 Recap</span>
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
        <span>&nbsp;&middot; 20가지 주제 평생 소장 및 이용</span>
        <span>&nbsp;&middot; 4가지 카메라 필터</span>
        <span>&nbsp;&middot; 제한 없는 인터뷰 진행시간</span>
        <span>&nbsp;&middot; 인터뷰 녹화 영상 및 Recap</span>
      </div>
    </div>
  );
}

function GiftTicket(props: { onClickBuyTicket: () => void }) {
  return (
    <div className="flex flex-col w-[calc(100%-60px)] min-w-[315px] mx-[30px] bg-grayscale-white rounded-[8px] p-[18px]">
      <div className="flex flex-row gap-[4px] mb-[12px]">
        <span className="flex items-center justify-center h-[24px] px-[7px] bg-[#F65454] text-grayscale-white rounded-[4px] text-body3">
          선물하기
        </span>
      </div>
      <span className="text-head3 text-grayscale-black mb-[2px]">
        &lt;삶과 나&gt; 인터뷰 이용권 선물하기
      </span>
      <span className="text-body3 text-grayscale-500">
        색다르고 뜻 깊은 선물을 할 수 있어요
      </span>

      <span className="bg-grayscale-100 w-full h-[1px] mb-[12px]" />

      <div className="flex justify-between items-center mb-[16px]">
        <span className="text-system-warning text-head4 line-through">
          정가 3,800원
        </span>
        <span className="text-head1">2,800원</span>
      </div>

      <div
        className="flex justify-center items-center bg-main-lilac50 rounded-[10px] w-full h-[44px] active:scale-95 transition-all text-head4 text-grayscale-800 mb-[16px]"
        onClick={props.onClickBuyTicket}
      >
        티켓 선물하기
      </div>

      <div className="flex flex-col text-body4 text-grayscale-500">
        <span>&nbsp;&middot; 1회 이용권의 모든 기능 포함</span>
        <span>&nbsp;&middot; 원하는 커스텀 질문 추가</span>
        <span>&nbsp;&middot; 직접 보낼 수 있는 선물 링크</span>
      </div>
    </div>
  );
}

function getFAQData() {
  const faqData = [
    {
      question: "평생 이용권을 사면 언제든지 이용할 수 있나요?",
      answer:
        "네. 해당 주제에 대해 인터뷰를 하는 것은 평생 가능하고 여러 번 이용할 수 있습니다.",
    },
    {
      question: "결제 후 환불이 가능한가요?",
      answer:
        "상품 유료결제 후 7일 이내 이용내역이 없는 경우, 전액환불이 가능합니다.",
    },
    {
      question: "인터뷰 길이는 어느 정도인가요?",
      answer:
        "일반적으로 5~15분 내외로 진행되지만 인터뷰에서 따로 시간을 제한하지 않습니다. 더 많은 이야기를 하고 싶다면 원하는 만큼 충분히 진행하시면 됩니다.",
    },
    {
      question: "영상이나 개인정보는 안전하게 보호되나요?",
      answer:
        "네. 업로드된 모든 영상은 이용자분이 설정한 비밀번호를 통해 암호화되며, 외부에 공개되지 않습니다. 개인정보 보호법 등 관련 법규를 준수하고 있으며, 엄격한 접근 권한 관리와 보안 체계를 갖추고 있습니다.",
    },
    {
      question: "이외에 문의 사항은 어디로 연락하면 되나요?",
      answer:
        "본 페이지 하단의 1:1 문의를 통해 문의 사항을 남겨주시면 빠른 시일 내에 답변 드리겠습니다.",
    },
  ];

  return faqData;
}
