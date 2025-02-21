"use client";

import ActionBar from "./actionBar";
import "@/app/landing/blackBody.css";
import Deadline from "../deadline";
import { useRouter } from "next/navigation";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useEarlybirdRepository } from "@/providers/earlybirdRepositoryContext";

export default function Page() {
  useEffect(() => {
    const viewport = document.querySelector('meta[name="viewport"]');

    if (!viewport) return;

    viewport.setAttribute(
      "content",
      "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
    );
  }, []);

  return (
    <div className="flex flex-col h-[calc(100dvh)]">
      <ActionBar />
      <div className="flex flex-col h-full items-center">
        <div className="h-[23px]" />
        <Headline />
        <div className="h-[24px]" />
        <Description />
        <div className="h-[28px]" />
        <CarouselContainer />
      </div>
    </div>
  );
}

function Headline() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center">
      <div className="text-head2 text-main-lilac50">
        오브 얼리버드 혜택 마감까지
      </div>
      <div className="h-[4px]" />
      <Deadline
        deadline={new Date("2025-02-26T00:00:00Z")}
        onDeadline={() => {
          router.push("/");
        }}
      />
    </div>
  );
}

function Description() {
  return (
    <div className="flex flex-col items-center">
      <div className="text-medium text-grayscale-500">
        현재 많은 사용자 분들이 동시에 몰리고 있습니다.
      </div>
      <div className="text-medium text-grayscale-500">
        원활한 서비스를 제공드리기 위해
      </div>
      <div className="text-medium text-grayscale-500">
        예약해주신 순서대로 서비스를 제공하고 있어요.
      </div>
      <div className="h-[16px]" />
      <div className="text-medium text-grayscale-500">
        아래 양식에 따라 신청해주시면 예약이 확정되고
      </div>
      <div className="text-medium text-grayscale-500">문자로 알려 드려요!</div>
    </div>
  );
}

function CarouselContainer() {
  const [emblaApi, setEmblaApi] = useState<CarouselApi | null>(null);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [inProgressIndex, setInProgressIndex] = useState(0);

  const totalSlides = 3; // 실제 슬라이드 개수에 맞게 수정

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    setScrollSnaps(emblaApi.scrollSnapList());

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    // 초기 선택 인덱스 설정 및 이벤트 구독
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi]);

  return (
    <div className="flex flex-col items-center w-full">
      <Carousel className="w-full" setApi={setEmblaApi}>
        <CarouselContent>
          <CarouselItem>
            <Step1
              onComplete={() => {
                setInProgressIndex((prev) => Math.max(1, prev));
                setTimeout(() => {
                  emblaApi?.scrollNext();
                }
                , 50); // waiting until rendering next card
              }}
            />
          </CarouselItem>
          {inProgressIndex >= 1 && (
            <CarouselItem>
              <Step2
                onRegister={() => {
                  setInProgressIndex((prev) => Math.max(2, prev));
                  setTimeout(() => {
                    emblaApi?.scrollNext();
                  }
                  , 50); // waiting until rendering next card
                }}
              />
            </CarouselItem>
          )}
          {inProgressIndex >= 2 && (
            <CarouselItem>
              <Step3 />
            </CarouselItem>
          )}
        </CarouselContent>
      </Carousel>
      <div className="flex gap-2 mt-4">
        {Array.from({ length: totalSlides }).map((_, idx) => (
          <div
            key={idx}
            className={`w-[8px] h-[8px] rounded-full transition-colors ${
              selectedIndex === idx ? "bg-grayscale-500" : "bg-grayscale-700"
            }`}
          />
        ))}
      </div>
      <div className="h-[37px]" />
    </div>
  );
}

function Card(props: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col w-[calc(100%-34px)] mx-[17px] p-[16px] bg-grayscale-900 rounded-[12px]">
      {props.children}
    </div>
  );
}

function Step1(props: { onComplete: () => void }) {
  const [isCopied, setIsCopied] = useState(false);
  const [isLoadingImage, setIsLoadingImage] = useState(true);
  const onClickCopy = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    copyText("카카오뱅크(최현준) 3333-32-8277762");
    setIsCopied(true);
  };

  return (
    <Card>
      <div className="text-head3 text-grayscale-100 mb-[12px]">
        step 1. 오브 월간 사용권 구매하기
      </div>
      <div className="relative w-[calc(100%)] h-[106px] mb-[12px]">
        {
          isLoadingImage && <div className="w-full h-full bg-grayscale-800 rounded-[8px] animate-pulse-fast"/>
        }
        <Image
              src="/images/coupon.svg"
              alt="coupon"
              fill
              style={{
                objectFit: "contain",
                width: "100%",
                height: "100%",
              }}
              onLoad={() => setIsLoadingImage(false)}
            />
      </div>
      <div
        className="flex flex-row items-center pt-[4px] gap-[6px] active:scale-95 active:shadow-md transition-all rounded-[4px] pr-[4px]"
        onClick={onClickCopy}
      >
        <div className="text-body2 text-grayscale-300">
          카카오뱅크(최현준) 3333-32-8277762
        </div>
        <div className="text-grayscale-500 bg-grayscale-800 text-caption1 w-[37px] h-[22px] flex flex-row items-center justify-center rounded-[4px]">
          {isCopied ? "복사됨" : "복사"}
        </div>
      </div>
      <div className="text-body2 text-grayscale-300">계좌로 입금해주세요.</div>
      <div className="h-[8px]" />
      <div className="text-caption1 text-[#80808A]">
        *입금자 명을 꼭 본인 이름으로 부탁 드려요.
      </div>

      <button className="mt-[6px] py-[6px]" onClick={() => props.onComplete()}>
        <div className="flex flex-col justify-center items-center w-full h-[48px] bg-main-lilac50 rounded-[12px] text-grayscale-800 text-head4 active:scale-95 transition-all">
          입금을 완료했어요
        </div>
      </button>
    </Card>
  );
}

function Step2(props: { onRegister: () => void }) {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isAgreed, setIsAgreed] = useState(false);
  const earlybirdRepository = useEarlybirdRepository();

  return (
    <Card>
      <div className="text-head3 text-grayscale-100 mb-[12px]">
        step 2. 예약자 정보 보내기
      </div>

      <div className="text-caption1 text-grayscale-500 mb-[2px] h-[22px]">
        성함
      </div>
      <input
        id="name"
        type="text"
        defaultValue=""
        suppressHydrationWarning
        className="bg-grayscale-700 rounded-[8px] h-[48px] text-white text-body3 px-[16px] py-[13px] border border-transparent focus:border-grayscale-200 focus:outline-none focus:ring-0"
        onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
          setName(e.target.value)
        }
      />

      <div className="h-[12px]"></div>

      <div className="text-caption1 text-grayscale-500 mb-[2px] h-[22px]">
        연락처
      </div>
      <input
        id="phone-number"
        type="tel"
        defaultValue=""
        suppressHydrationWarning
        className="bg-grayscale-700 rounded-[8px] h-[48px] text-white text-body3 px-[16px] py-[13px] border border-transparent focus:border-grayscale-200 focus:outline-none focus:ring-0"
        onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
          setPhoneNumber(e.target.value)
        }
      />

      <div className="h-[13px]" />

      <div className="flex flex-row items-center">
        <label
          htmlFor="privacy-agreement"
          className="flex flex-row items-center h-[24px] gap-[6px]"
        >
          <input
            id="privacy-agreement"
            type="checkbox"
            suppressHydrationWarning
            className="appearance-none w-[16px] h-[16px] bg-[url('/icons/checkbox-unchecked.svg')] checked:bg-[url('/icons/checkbox-checked.svg')] transition-all"
            onChange={(e) => setIsAgreed(e.target.checked)}
          />
          <div className="flex flex-row items-center text-body3 text-grayscale-100">
            개인정보 수집 및 이용 동의&nbsp;
            <div className="text-body3 text-system-info">(필수)</div>
          </div>
        </label>

        <div className="flex flex-col justify-center items-center h-[24px] w-[24px]">
          <Image
            src="/icons/right-arrow.svg"
            alt="right-arrow"
            width={6}
            height={11}
          />
        </div>
      </div>

      <div className="h-[12px]" />

      <button
        className="mt-[6px] py-[6px]"
        onClick={() => {
          earlybirdRepository
            .register({
              name: name,
              phoneNumber: phoneNumber,
            })
            .then(() => {
              props.onRegister();
            });
        }}
        disabled={!name || !phoneNumber || !isAgreed}
      >
        <div
          className={`flex flex-col justify-center items-center w-full h-[48px] rounded-[12px] text-head4 active:scale-95 transition-all ${
            name && phoneNumber && isAgreed
              ? "bg-main-lilac50 text-grayscale-800"
              : "bg-grayscale-800 text-grayscale-500"
          }`}
        >
          신청하기
        </div>
      </button>
    </Card>
  );
}

function Step3() {
  const earlybirdRepository = useEarlybirdRepository();

  // API에서 받아올 최종 숫자
  const [targetNumber, setTargetNumber] = useState(0);
  // 애니메이션으로 보여줄 숫자
  const [displayNumber, setDisplayNumber] = useState(0);

  // API 호출로 targetNumber 값을 가져오기
  useEffect(() => {
    earlybirdRepository.getWaitingNumber().then((number) => {
      setTargetNumber(1016 + number);
    });
  }, []);

  const loadNumber = () => {
    if (targetNumber > 0) {
      const interval = setInterval(() => {
        setDisplayNumber((prev) => {
          if (prev < targetNumber) {
            return prev + Math.max(Math.round((targetNumber - prev) * 0.15), 1);
          } else {
            clearInterval(interval);
            return prev;
          }
        });
      }, 20); // 20ms마다 업데이트 (0.02초)
      return () => clearInterval(interval);
    }
  };

  return (
    <Card>
      <div className="text-head3 text-grayscale-100 mb-[12px]">
        step 3. 1일 내로 확정 문자 받기
      </div>

      <div className="text-body2 text-grayscale-100">
        영업일 기준 1일 내로 확정 순번과
      </div>
      <div className="text-body2 text-grayscale-100">
        함께 문자로 회신드려요!
      </div>

      <div className="h-[24px]" />

      <div className="flex flex-row justify-center text-medium text-[80px] text-white h-[95px]">
        {displayNumber
          .toString()
          .padStart(4, "0")
          .split("")
          .map((digit, index) => (
            <div key={index} className="w-[50px] text-center">
              {digit}
            </div>
          ))}
      </div>

      <div className="h-[39px]" />

      <button className="mt-[6px] py-[6px]" onClick={loadNumber}>
        <div className="flex flex-col justify-center items-center w-full h-[48px] bg-main-lilac50 rounded-[12px] text-grayscale-800 text-head4 active:scale-95 transition-all">
          예상 순번 확인하기
        </div>
      </button>
    </Card>
  );
}

const copyText = (text: string) => {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    // Clipboard API가 지원되는 경우
    navigator.clipboard.writeText(text).catch((err) => {
      console.error("클립보드 복사 실패:", err);
    });
  } else {
    // Clipboard API가 지원되지 않을 때 fallback 방법 사용
    const textarea = document.createElement("textarea");
    textarea.value = text;
    // 화면에 보이지 않게 스타일 설정
    textarea.style.position = "fixed";
    textarea.style.top = "-9999px";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    try {
      const successful = document.execCommand("copy");
      if (!successful) {
        console.error("Fallback: 복사 명령이 실패했습니다.");
      }
    } catch (err) {
      console.error("Fallback: 복사 명령 실행 중 오류 발생:", err);
    }
    document.body.removeChild(textarea);
  }
};