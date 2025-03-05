"use client";

import { useRouter, useSearchParams } from "next/navigation";
import ActionBar from "./actionBar";
import "@/app/components/blackBody.css";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useEarlybirdRepository } from "@/providers/EarlybirdRepositoryContext";

import Image from "next/image";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import ChannelTalkButton from "@/app/components/channelTalkButton";

export default function Page() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center w-full min-h-[calc(100dvh)]">
      <ActionBar title="오브 티켓 구매하기" onClickBack={() => router.back()} />

      <div className="h-[24px]" />

      <Suspense>
        <CarouselContainer
        // productName={productName}
        // productPrice={productPrice}
        />
      </Suspense>
    </div>
  );
}

function CarouselContainer(props: {
  // productName: string;
  // productPrice: number;
}) {
  const searchParams = useSearchParams();
  // query parameter로부터 productName과 price를 읽어옴
  const productName = searchParams.get("productName") || "";
  const productPrice = Number(searchParams.get("price")) || 0;

  const router = useRouter();
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
                }, 50); // waiting until rendering next card
              }}
            />

            <div className="w-[calc(100%-32px)] mx-[16px] my-[16px]">
              <GuideCaption />
            </div>
          </CarouselItem>
          {inProgressIndex >= 1 && (
            <CarouselItem>
              <Step2
                productName={productName}
                productPrice={productPrice}
                onComplete={() => {
                  setInProgressIndex((prev) => Math.max(2, prev));
                  setTimeout(() => {
                    emblaApi?.scrollNext();
                  }, 50); // waiting until rendering next card
                }}
              />
            </CarouselItem>
          )}
          {inProgressIndex >= 2 && (
            <CarouselItem>
              <Step3 onClickBackHome={() => router.push("/")} />
            </CarouselItem>
          )}
        </CarouselContent>
      </Carousel>
    </div>
  );
}

function Card(props: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col w-[calc(100%-32px)] mx-[16px] px-[15px] py-[16px] bg-grayscale-900 rounded-[12px]">
      {props.children}
    </div>
  );
}

function Step1(props: { onComplete: () => void }) {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  const earlybirdRepository = useEarlybirdRepository();

  return (
    <Card>
      <div className="text-head3 text-grayscale-100 mb-[4px]">
        step 1. 결제 전 정보를 입력해주세요
      </div>

      <div className="text-body4 text-grayscale-400 mb-[12px] break-words">
        입력하신 내용은 결제 확인 및 확정 알림 목적으로만 사용됩니다. 정확한
        정보를 입력해 주세요😊
      </div>

      <div className="text-caption1 text-grayscale-500 mb-[2px] h-[22px]">
        성함
      </div>
      <input
        id="name"
        type="text"
        placeholder="입금자명과 동일하게 입력해주세요."
        defaultValue=""
        suppressHydrationWarning
        className="bg-grayscale-700 rounded-[8px] h-[48px] text-white text-body3 px-[16px] py-[13px] border border-transparent placeholder-grayscale-500 placeholder-body3 focus:border-grayscale-200 focus:outline-none focus:ring-0"
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
        placeholder="01012345678"
        defaultValue=""
        suppressHydrationWarning
        className="bg-grayscale-700 rounded-[8px] h-[48px] text-white text-body3 px-[16px] py-[13px] border border-transparent placeholder-grayscale-500 placeholder-body3 focus:border-grayscale-200 focus:outline-none focus:ring-0"
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
            className="appearance-none w-[16px] h-[16px] mx-[4px] bg-[url('/icons/checkbox-unchecked.svg')] checked:bg-[url('/icons/checkbox-checked.svg')] transition-all"
            onChange={(e) => setIsAgreed(e.target.checked)}
          />
          <div className="flex flex-row items-center text-body3 text-grayscale-100">
            개인정보 수집 및 이용 동의&nbsp;
            <div className="text-body3 text-system-info">(필수)</div>
          </div>
        </label>

        <div
          className="flex flex-col justify-center items-center h-[24px] w-[24px]"
          onClick={() => {
            window.open(
              "https://cac.notion.site/1a2bfb0d0b4e80c0a034df3ac3b8ae09?pvs=4",
              "_blank"
            );
          }}
        >
          <Image
            src="/icons/right-arrow.svg"
            alt="right-arrow"
            width={6}
            height={11}
          />
        </div>
      </div>

      <div className="h-[18px]" />

      <button
        className="pt-[6px]"
        onClick={async () => {
          try {
            setIsLoading(true);

            await earlybirdRepository.register({
              name: name,
              phoneNumber: phoneNumber,
            });

            setIsLoading(false);

            props.onComplete();
          } catch (e) {
            alert("신청 중 오류가 발생했습니다. 다시 시도해주세요.");
          }
        }}
        disabled={!name || !phoneNumber || !isAgreed || isLoading}
      >
        <div
          className={`flex flex-col justify-center items-center w-full h-[48px] rounded-[12px] text-head4 active:scale-95 transition-all ${
            name && phoneNumber && isAgreed
              ? "bg-main-lilac50 text-grayscale-800"
              : "bg-grayscale-800 text-grayscale-500"
          }`}
        >
          {isLoading ? (
            <Image
              src="/icons/rolling-spinner.gif"
              width={20}
              height={20}
              alt="loading spinner"
            />
          ) : (
            "신청하기"
          )}
        </div>
      </button>
    </Card>
  );
}

function Step2(props: {
  productName: string;
  productPrice: number;
  onComplete: () => void;
}) {
  const [isCopied, setIsCopied] = useState(false);
  const copyTimeout = useRef<NodeJS.Timeout | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<
    "toss" | "kakao" | "directly" | null
  >(null);

  const onClickCopy = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    copyText("카카오뱅크(최현준) 3333-32-8277762");
    setIsCopied(true);

    // 이전 타임아웃이 존재하면 해제
    if (copyTimeout.current) {
      clearTimeout(copyTimeout.current);
    }
    // 새로운 타임아웃 설정
    copyTimeout.current = setTimeout(() => {
      setIsCopied(false);
    }, 5000);
  };

  const payActions = {
    none: () => {},
    toss: () => {
      // 모바일 환경 체크
      const isMobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );
      if (!isMobile) {
        alert("선택하신 결제 수단은 모바일에서만 이용할 수 있습니다");
        return;
      }
      // go to toss
      copyText("카카오뱅크(최현준) 3333-32-8277762");
      window.location.href = `supertoss://send?amount=${props.productPrice}&bank=%EC%B9%B4%EC%B9%B4%EC%98%A4%EB%B1%85%ED%81%AC&accountNo=3333328277762&origin=qr`;

      setTimeout(() => {
        props.onComplete();
      }, 1000);
    },
    kakao: () => {
      // 모바일 환경 체크
      const isMobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );
      if (!isMobile) {
        alert("선택하신 결제 수단은 모바일에서만 이용할 수 있습니다");
        return;
      }
      // go to kakao
      copyText("카카오뱅크(최현준) 3333-32-8277762");
      if (props.productPrice === 2200) {
        window.location.href = `https://qr.kakaopay.com/FZNAxtaQD44c09796`;
      } else {
        window.location.href = `https://qr.kakaopay.com/FZNAxtaQDf3c05080`;
      }

      setTimeout(() => {
        props.onComplete();
      }, 1000);
    },
    directly: () => {
      copyText("카카오뱅크(최현준) 3333-32-8277762");
      props.onComplete();
    },
  };

  return (
    <Card>
      <div className="text-head3 text-grayscale-100 mb-[12px]">
        step 2. 결제 진행하기
      </div>

      <div className="flex flex-col h-[90px] w-full p-[16px] bg-grayscale-700 rounded-[8px] gap-[6px]">
        <div className="flex flex-row items-end justify-between h-[24px] w-full">
          <span className="text-body4 text-grayscale-400">최종 결제 상품</span>
          <span className="text-body3 text-grayscale-100">
            {props.productName}
          </span>
        </div>
        <div className="flex flex-row items-end justify-between h-[28px] w-full">
          <span className="text-body4 text-grayscale-400">최종 결제 금액</span>
          <span className="text-head2 text-grayscale-100">
            {props.productPrice.toLocaleString()}원
          </span>
        </div>
      </div>

      <div className="h-[12px]" />

      <div className="flex flex-col gap-[12px]">
        <div className="text-caption2 text-grayscale-500">송금 수단 선택</div>

        <div className="flex flex-row items-start h-[26px]">
          <div
            className="flex flex-row items-center gap-[6px] "
            onClick={() => setSelectedMethod("toss")}
          >
            <CircleToggle isActive={selectedMethod === "toss"} />
            <span className="text-body2 text-grayscale-100">Toss</span>
            <span className="text-caption1 text-grayscale-white bg-grayscale-700 rounded-[11px] px-[12px] py-[2px]">
              모바일에서만 가능해요
            </span>
          </div>
        </div>

        <div className="flex flex-row items-start h-[26px]">
          <div
            className="flex flex-row items-center gap-[6px] "
            onClick={() => setSelectedMethod("kakao")}
          >
            <CircleToggle isActive={selectedMethod === "kakao"} />
            <span className="text-body2 text-grayscale-100">카카오</span>
            <span className="text-caption1 text-grayscale-white bg-grayscale-700 rounded-[11px] px-[12px] py-[2px]">
              모바일에서만 가능해요
            </span>
          </div>
        </div>

        <div className="flex flex-row items-start min-h-[26px]">
          <div
            className="flex flex-row items-start gap-[6px] "
            onClick={() => setSelectedMethod("directly")}
          >
            <CircleToggle isActive={selectedMethod === "directly"} />
            <div className="flex flex-col text-body2 text-grayscale-100">
              <span>직접 계좌이체</span>

              <div
                className={`flex flex-row items-center gap-[6px] active:scale-95 active:shadow-md transition-all rounded-[4px] pr-[4px] mt-[6px] ${
                  selectedMethod === "directly" ? "" : "hidden"
                }`}
                onClick={onClickCopy}
              >
                <div className="text-body2 text-grayscale-300">
                  카카오뱅크(최현준) 3333-32-8277762
                </div>
                <div className="text-grayscale-500 bg-grayscale-800 text-caption1 w-[37px] h-[22px] flex flex-row items-center justify-center rounded-[4px]">
                  {isCopied ? "완료" : "복사"}
                </div>
              </div>
              <div
                className={`text-body2 text-grayscale-300 ${
                  selectedMethod === "directly" ? "" : "hidden"
                }`}
              >
                계좌로 입금해주세요.
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="h-[24px]" />

      <button
        disabled={!selectedMethod}
        className={`rounded-[12px] h-[48px] text-head4 active:scale-95 transition-all ${
          selectedMethod
            ? "bg-main-lilac50 text-grayscale-800"
            : "bg-grayscale-800 text-grayscale-500"
        }`}
        onClick={payActions[selectedMethod ?? "none"]}
      >
        {
          {
            none: "송금 수단을 선택해주세요",
            toss: "토스로 원클릭 송금하기",
            kakao: "카카오페이로 원클릭 송금하기",
            directly: "송금 완료 후 넘어가기",
          }[selectedMethod ?? "none"]
        }
      </button>
    </Card>
  );
}

function Step3(props: { onClickBackHome: () => void }) {
  return (
    <Card>
      <div className="text-head3 text-grayscale-100 mb-[8px]">
        step 3. 1일 내로 확정 문자 받기
      </div>

      <div className="text-body4 text-grayscale-400 mb-[96px]">
        신청이 완료 되었어요.
        <br />
        영업일 기준 1일 내로 확정 안내를 문자로 보내드려요.
        <br />
        입금자 명과 예약자 정보가 일치해야
        <br />
        신청이 확정된다는 점 확인 부탁 드립니다.
      </div>

      <ChannelTalkButton
        className="!text-head4 bg-main-lilac50 text-grayscale-800 rounded-[12px] h-[48px] text-center no-underline"
        text={"1:1 문의하기"}
      />

      <div className="h-[16px]" />

      <div
        className="flex items-center justify-center text-head4 bg-main-lilac50 text-grayscale-800 rounded-[12px] h-[48px] active:scale-95"
        onClick={props.onClickBackHome}
      >
        메인으로 돌아가기
      </div>
    </Card>
  );
}

function GuideCaption() {
  return (
    <div className="flex flex-col w-full text-caption2 text-[#535353]">
      &nbsp;&middot;&nbsp;&nbsp;결제 관련 문의는 1:1문의(고객센터)로
      부탁드립니다.
      <br />
      &nbsp;&middot;&nbsp;&nbsp;상품 유료결제 후 7일 이내 이용내역이 없는 경우,
      전액 환불이 가능합니다.
    </div>
  );
}

function CircleToggle(props: { isActive: boolean }) {
  return (
    <div
      className={`w-[18px] h-[18px] m-[3px] rounded-full ${
        props.isActive
          ? "border-[5px] border-system-info bg-grayscale-white"
          : "border-[1.64px] border-grayscale-500"
      }
      }`}
    />
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
