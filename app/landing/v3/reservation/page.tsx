"use client";

import { useRouter } from "next/navigation";
import ActionBar from "./actionBar";
import { useSidebar } from "../sidebarContext";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useState } from "react";
import { useEarlybirdRepository } from "@/providers/EarlybirdRepositoryContext";
import Image from "next/image";

import "@/app/components/blackBody.css";
import { track } from "@/app/amplitude";

export default function Page() {
  const router = useRouter();
  const { setIsSidebarOpen } = useSidebar()!;
  const [emblaApi, setEmblaApi] = useState<CarouselApi | null>(null);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [inProgressIndex, setInProgressIndex] = useState(0);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100dvh)]">
      <ActionBar
        title="알림 예약하기"
        onClickBack={() => router.back()}
        onClickMenu={() => setIsSidebarOpen(true)}
      />

      <div className="flex flex-col items-center justify-center w-full h-[228px] gap-[16px] mt-[40px] mb-[40px] text-center">
        <div className="text-head0 text-grayscale-white">
          아래 내용을 꼭 확인해주세요
        </div>
        <div className="text-body2 text-grayscale-300">
          현재 많은 사용자 분들이 동시에 몰리고 있습니다.
        </div>
        <div className="text-body2 text-grayscale-300">
          원활한 서비스를 제공드리기 위해
          <br />
          신청해주신 순서대로 서비스를 제공하고 있으니
          <br />
          양해 부탁드려요 😢
        </div>
        <div className="text-body2 text-grayscale-300">
          아래 양식에 따라 신청해주시면
          <br />
          확정 알림을 보내드려요!
        </div>
      </div>

      <div className="flex flex-col items-center w-full">
        <Carousel className="w-full" setApi={setEmblaApi}>
          <CarouselContent>
            <CarouselItem>
              <Step1
                onComplete={() => {
                  track("click_apply_reservation");
                  setInProgressIndex((prev) => Math.max(1, prev));
                  setTimeout(() => {
                    emblaApi?.scrollNext();
                  }, 50); // waiting until rendering next card
                }}
              />
              <div className="h-[34px]" />
            </CarouselItem>
            {inProgressIndex >= 1 && (
              <CarouselItem>
                <Step2
                  onComplete={() => {
                    track("click_complete_deposit");
                    setInProgressIndex((prev) => Math.max(2, prev));
                    setTimeout(() => {
                      emblaApi?.scrollNext();
                    }, 50); // waiting until rendering next card
                  }}
                />
                <div className="h-[34px]" />
              </CarouselItem>
            )}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
}

function Step1(props: { onComplete: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  const earlybirdRepository = useEarlybirdRepository();

  return (
    <Card>
      <div className="text-head3 text-grayscale-100 mb-[4px]">
        이메일 남기기
      </div>

      <div className="text-caption1 text-grayscale-500 mb-[2px] h-[22px]">
        성함
      </div>
      <input
        id="name"
        type="text"
        placeholder="본명을 입력해주세요"
        defaultValue=""
        suppressHydrationWarning
        className="bg-grayscale-700 rounded-[8px] h-[48px] text-white text-body3 !text-[16px] px-[16px] py-[13px] border border-transparent placeholder-grayscale-500 placeholder-body3 focus:border-grayscale-200 focus:outline-none focus:ring-0"
        onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
          setName(e.target.value)
        }
      />

      <div className="h-[12px]"></div>

      <div className="text-caption1 text-grayscale-500 mb-[2px] h-[22px]">
        이메일
      </div>
      <input
        id="email"
        type="email"
        placeholder="orv@gmail.com"
        defaultValue=""
        suppressHydrationWarning
        className="bg-grayscale-700 rounded-[8px] h-[48px] text-white text-body3 !text-[16px] px-[16px] py-[13px] border border-transparent placeholder-grayscale-500 placeholder-body3 focus:border-grayscale-200 focus:outline-none focus:ring-0"
        onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
          setEmail(e.target.value)
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
            unoptimized
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
              email: email,
            });

            setIsLoading(false);

            props.onComplete();
          } catch (e) {
            alert("신청 중 오류가 발생했습니다. 다시 시도해주세요.");
          }
        }}
        disabled={!name || !email || !isAgreed || isLoading}
      >
        <div
          className={`flex flex-col justify-center items-center w-full h-[48px] rounded-[12px] text-head4 active:scale-95 transition-all ${
            name && email && isAgreed
              ? "bg-main-lilac50 text-grayscale-800"
              : "bg-grayscale-800 text-grayscale-500"
          }`}
        >
          {isLoading ? (
            <Image
              unoptimized
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

function Step2(props: { onComplete: () => void }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  const earlybirdRepository = useEarlybirdRepository();

  return (
    <Card>
      <div className="text-head3 text-grayscale-100 mb-[4px]">
        알림 받기
      </div>

      <div className="text-body4 text-grayscale-400 mb-[12px] break-words">
        신청이 완료됐어요. 전화번호를 남겨주시는 분들께는 알림을 보내드려요.
      </div>

      <div className="text-caption1 text-grayscale-500 mb-[2px] h-[22px]">
        전화번호
      </div>
      <input
        id="phone-number"
        type="tel"
        placeholder="01012345678"
        defaultValue=""
        suppressHydrationWarning
        className="bg-grayscale-700 rounded-[8px] h-[48px] text-white text-body3 !text-[16px] px-[16px] py-[13px] border border-transparent placeholder-grayscale-500 placeholder-body3 focus:border-grayscale-200 focus:outline-none focus:ring-0"
        onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
          setPhoneNumber(e.target.value)
        }
      />

      <div className="h-[18px]" />

      <button
        className="pt-[6px]"
        onClick={async () => {
          try {
            setIsLoading(true);

            await earlybirdRepository.register({
              phoneNumber: phoneNumber,
            });

            setIsLoading(false);
            setIsComplete(true);

            props.onComplete();
          } catch (e) {
            alert("신청 중 오류가 발생했습니다. 다시 시도해주세요.");
          }
        }}
        disabled={!phoneNumber || isLoading || isComplete}
      >
        <div
          className={`flex flex-col justify-center items-center w-full h-[48px] rounded-[12px] text-head4 active:scale-95 transition-all ${
            phoneNumber && !isComplete
              ? "bg-main-lilac50 text-grayscale-800"
              : "bg-grayscale-800 text-grayscale-500"
          }`}
        >
          {isLoading ? (
            <Image
              unoptimized
              src="/icons/rolling-spinner.gif"
              width={20}
              height={20}
              alt="loading spinner"
            />
          ) : (
            isComplete ? "신청 완료!" : "신청하기"
          )}
        </div>
      </button>
    </Card>
  );
}

function Card(props: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col w-[calc(100%-32px)] mx-[16px] px-[15px] py-[16px] bg-grayscale-900 rounded-[12px]">
      {props.children}
    </div>
  );
}
