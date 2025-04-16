import { useEffect, useState } from "react";
import Image from "next/image";
import Spinner from "./spinner";
import { useTemplateService } from "@/providers/TemplateServiceContext";
import { SelectableCalendar } from "./selectableCalendar";
import TimeSelector from "./timeSelector";

export default function ReservationPopup(props: {
  topicId: string;
  topicName: string;
  storyboardId: string;
  onClickBack: () => void;
  onConfirm: (date: Date) => void;
}) {
  const [today] = useState<Date>(new Date(Date.now()));
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<{
    hour: number;
    minute: number;
  }>({ hour: today.getHours(), minute: today.getMinutes() });

  return (
    <div className="flex flex-col w-[720px] h-[536px] rounded-[14px] p-[24px] bg-grayscale-800">
      <div className="text-head1 text-grayscale-white h-[36px]">
        인터뷰 날짜 예약하기
      </div>

      <div className="h-[24px]" />

      <div className="flex flex-row w-[672px] h-[344px] gap-[24px]">
        <div className="flex flex-col w-[324px] h-full">
          <span className="text-body2 text-grayscale-400 mb-[8px]">
            날짜를 선택해주세요.
          </span>
          <SelectableCalendar
            onSelect={(selectedDate: Date) => {
              setSelectedDate(selectedDate);
            }}
          />
        </div>
        <div className="flex flex-col w-[324px] h-full">
          {selectedDate === null ? (
            <span className="h-full flex flex-col justify-center items-center text-body2 text-grayscale-400">
              날짜를 먼저 선택해주세요
            </span>
          ) : (
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
              <TimeSelector
                onChangeTime={(hour, minute) => {
                  setSelectedTime({ hour, minute });
                }}
                initialTime={{
                  hour: today.getHours(),
                  minute: today.getMinutes(),
                }}
              />
            </>
          )}
        </div>
      </div>

      <div className="h-[40px]" />

      <div className="flex flex-row justify-end gap-[8px] h-[44px]">
        <div
          className="flex items-center justify-center w-[84px] h-[44px] rounded-[10px] text-head4 text-grayscale-50 bg-grayscale-600 transition-all active:scale-95"
          onClick={props.onClickBack}
        >
          뒤로가기
        </div>
        <div
          className="flex items-center justify-center w-[113px] h-[44px] rounded-[10px] text-head4 text-grayscale-800 bg-main-lilac50 transition-all active:scale-95"
          onClick={() => {
            const date: Date = selectedDate!;
            date.setHours(selectedTime.hour, selectedTime.minute);
            props.onConfirm(date);
          }}
        >
          예약 확정하기
        </div>
      </div>
    </div>
  );
}
