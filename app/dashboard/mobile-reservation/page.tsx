"use client";

import "@/app/components/blackBody.css";
import { SelectableCalendar } from "../popup/selectableCalendar";
import { Suspense, useEffect, useRef, useState } from "react";
import TimeSelector from "../popup/timeSelector";
import { cn } from "@/lib/utils";
import { Router } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useReservationRepository } from "@/providers/ReservationRepositoryContext";

export default function Page() {
  return (
    <Suspense>
      <Body />
    </Suspense>
  );
}

function Body() {
  const searchParams = useSearchParams();
  const storyboardId = searchParams.get("storyboardId")!;

  const containerRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const reservationRepository = useReservationRepository();

  const [isScrolled, setIsScrolled] = useState(false);
  const [today] = useState<Date>(new Date(Date.now()));
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<{
    hour: number;
    minute: number;
  }>({ hour: today.getHours(), minute: today.getMinutes() });

  // 스크롤을 맨 아래로 이동하는 함수
  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth", // 부드럽게 스크롤
      });
    }
  };

  useEffect(() => {
    // 날짜가 선택되면 0.1초 후에 스크롤을 맨 아래로 이동
    if (!isScrolled && selectedDate) {
      setIsScrolled(true);

      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }
  }, [selectedDate]);

  // 모바일 환경 적응형 예약 페이지
  return (
    <div
      ref={containerRef}
      className="relative text-grayscale-white w-full h-full pt-[78px] overflow-scroll hide-scrollbar"
    >
      <h1 className="text-2xl font-bold text-head0 mx-[20px] xs:mx-[40px]">
        인터뷰 예약
      </h1>
      <div className="flex flex-col">
        <span className="text-head4 text-grayscale-100 px-[20px]">
          노트북이나 데스크탑에서 인터뷰를 진행할 수 있어요.
        </span>
        <span className="text-head4 text-grayscale-100 px-[20px]">
          인터뷰 시간을 등록해주시면 지정된 시간에 링크를 보내드릴게요!
        </span>
      </div>

      <div className="h-[56px]" />
      <div className="flex flex-col mx-[20px] w-[calc(100dvw-40px)]">
        <span className="text-body2 text-grayscale-400 mb-[8px]">
          날짜를 선택해주세요.
        </span>
        <SelectableCalendar
          onSelect={(selectedDate: Date) => {
            setSelectedDate(selectedDate);
          }}
        />
      </div>
      <div className="h-[56px]" />
      <div className="flex flex-col mx-[20px] w-[calc(100dvw-40px)]">
        {selectedDate !== null && (
          <>
            <span className="text-body2 text-grayscale-400 mb-[8px]">
              시간을 선택해주세요.
            </span>
            <span className="text-head4 text-main-lilac50 mb-[8px]">
              {selectedDate!.getMonth() + 1}월 {selectedDate?.getDate()}일{" "}
              {
                ["일", "월", "화", "수", "목", "금", "토"][
                  selectedDate?.getDay()
                ]
              }
              요일
            </span>
            <div className="flex justify-center w-full">
              <TimeSelector
                onChangeTime={(hour, minute) => {
                  setSelectedTime({ hour, minute });
                }}
                initialTime={{
                  hour: today.getHours(),
                  minute: today.getMinutes(),
                }}
              />
            </div>
          </>
        )}
      </div>
      <div className="h-[120px]" />
      {selectedDate !== null && (
        <div className="fixed bottom-[26px] w-full z-50">
          <CTA
            text="다음으로"
            onClick={async () => {
              const date: Date = selectedDate!;
              date.setHours(selectedTime.hour, selectedTime.minute);

              await reservationRepository.reserveInterview(storyboardId, date);
              router.replace(`/dashboard/mobile-reservation/confirm`);
            }}
            className="w-full h-[56px] mx-[20px] text-head3"
          />
        </div>
      )}
    </div>
  );
}

function CTA(props: { text: string; onClick: () => void; className?: string }) {
  return (
    <div className="w-full flex justify-center">
      <button
        style={{ boxShadow: "0px 0px 12px rgba(197, 209, 255, 0.6)" }}
        className={cn(
          "bg-main-lilac50 px-[13px] py-[9px] text-grayscale-800 text-head4 rounded-[10px] transition-all active:scale-95",
          props.className
        )}
        onClick={props.onClick}
      >
        {props.text}
      </button>
    </div>
  );
}
