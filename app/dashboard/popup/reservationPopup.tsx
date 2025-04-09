import { useEffect, useState } from "react";
import Image from "next/image";
import Spinner from "./spinner";
import { useTemplateService } from "@/providers/TemplateServiceContext";

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

function SelectableCalendar(props: { onSelect: (date: Date) => void }) {
  const [today] = useState<Date>(new Date(Date.now()));
  const [firstDate, setFirstDate] = useState<Date>(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [lastDate, setLastDate] = useState<Date>(
    new Date(today.getFullYear(), today.getMonth() + 1, 0)
  );

  const [year, setYear] = useState<number>(today.getFullYear());
  const [month, setMonth] = useState<number>(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<Date | null>();
  const [days, setDays] = useState<DayItem[]>();

  useEffect(() => {
    // year와 month를 기반으로 새로운 날짜들을 즉시 계산합니다.
    const newFirstDate = new Date(year, month, 1);
    const newLastDate = new Date(year, month + 1, 0);

    const newDays = [];

    // 새로운 firstDate의 요일을 기반으로 공백 아이템 추가
    for (let i = 0; i < newFirstDate.getDay(); ++i) {
      newDays.push({ dayOfMonth: null, isSelectable: false });
    }

    // 새로운 lastDate의 날짜 수 만큼 day 아이템 추가
    for (let i = 1; i <= newLastDate.getDate(); ++i) {
      newDays.push({
        dayOfMonth: i,
        isSelectable:
          // 오늘 이후인 날짜만 선택 가능하도록 계산 (오늘 포함)
          new Date(today.getFullYear(), today.getMonth(), today.getDate()) <=
          new Date(year, month, i),
      });
    }

    // 상태 업데이트
    setFirstDate(newFirstDate);
    setLastDate(newLastDate);
    setDays(newDays);
  }, [year, month]);

  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-between">
        <div className="text-grayscale-100 text-head4 mb-[8px]">
          {year}년 {(month + 1).toString().padStart(2, "0")}월
        </div>
        <div className="flex flex-row gap-[2px]">
          <Image
            src={
              new Date(today.getFullYear(), today.getMonth(), 1) <=
              new Date(year, month, 0)
                ? "/icons/left-arrow-grayscale-white.svg"
                : "/icons/left-arrow-grayscale-600.svg"
            }
            alt="prior month"
            width={20}
            height={20}
            onClick={() => {
              if (
                new Date(today.getFullYear(), today.getMonth(), 1) >
                new Date(year, month, 0)
              )
                return;

              const priorMonth = new Date(year, month, 0);
              setYear(priorMonth.getFullYear());
              setMonth(priorMonth.getMonth());
            }}
          />
          <Image
            src="/icons/right-arrow-grayscale-white.svg"
            alt="next month"
            width={20}
            height={20}
            onClick={() => {
              const nextMonth = new Date(year, month, lastDate.getDate() + 1);
              setYear(nextMonth.getFullYear());
              setMonth(nextMonth.getMonth());
            }}
          />
        </div>
      </div>

      <div className="flex flex-row justify-around text-grayscale-300 text-head4 mb-[22px] gap-x-[20px]">
        {["일", "월", "화", "수", "목", "금", "토"].map(
          (day: string, index: number) => (
            <div key={index}>{day}</div>
          )
        )}
      </div>

      <div className="grid grid-cols-7 gap-y-[22px] gap-x-[20px]">
        {days?.map((item: DayItem, index: number) => {
          const isSelectedDate: boolean =
            selectedDate?.getTime() ==
            new Date(year, month, item.dayOfMonth ?? 0).getTime();
          return (
            <span
              key={index}
              className={`flex items-center justify-center text-center rounded-full w-[28px] h-[28px] ${
                !isSelectedDate && item.isSelectable
                  ? "text-body2 text-grayscale-300 hover:bg-grayscale-900"
                  : ""
              } ${
                isSelectedDate
                  ? "bg-main-lilac50 text-grayscale-800 text-head4"
                  : ""
              } ${!item.isSelectable ? "text-head4 text-grayscale-600" : ""}`}
              onClick={
                item.isSelectable
                  ? () => {
                      const selectedDate = new Date(
                        year,
                        month,
                        item.dayOfMonth!
                      );
                      setSelectedDate(selectedDate);
                      props.onSelect(selectedDate);
                    }
                  : undefined
              }
            >
              {item.dayOfMonth}
            </span>
          );
        })}
      </div>
    </div>
  );
}

interface DayItem {
  dayOfMonth: number | null;
  isSelectable: boolean;
}

function TimeSelector(props: {
  onChangeTime: (hour: number, minute: number) => void;
  initialTime?: { hour: number; minute: number };
}) {
  const HOURS = Array.from({ length: 24 }, (_, i) => i);
  const MINUTES = Array.from({ length: 60 }, (_, i) => i);

  const [hour, setHour] = useState<number>(props.initialTime?.hour ?? 0);
  const [minute, setMinute] = useState<number>(props.initialTime?.minute ?? 0);

  return (
    <div className="relative flex w-[324px] h-[172px]">
      {/* 시(Hour) 스피너 */}
      <Spinner
        items={HOURS}
        selected={hour}
        onChange={(val: number) => {
          setHour(val);
          props.onChangeTime(val, minute);
        }}
        className="z-40 absolute left-[70px] w-[48px]"
      />

      {/* 분(Minute) 스피너 */}
      <Spinner
        items={MINUTES}
        selected={minute}
        onChange={(val: number) => {
          setMinute(val);
          props.onChangeTime(hour, val);
        }}
        className="z-40 absolute left-[182px] w-[48px]"
      />
      <div className="absolute flex items-center top-[60px] left-[0px] bg-grayscale-700 rounded-[10px] w-[324px] h-[52px]">
        <span className="ml-[126px] text-head3 text-grayscale-300">시</span>
        <span className="ml-[96px] text-head3 text-grayscale-300">분</span>
      </div>
    </div>
  );
}
