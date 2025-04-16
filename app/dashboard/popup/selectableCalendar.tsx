"use client";

import { useEffect } from "react";
import { useState } from "react";
import Image from "next/image";

export function SelectableCalendar(props: { onSelect: (date: Date) => void }) {
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

      <div className="grid grid-cols-7">
        {days?.map((item: DayItem, index: number) => {
          const isSelectedDate: boolean =
            selectedDate?.getTime() ==
            new Date(year, month, item.dayOfMonth ?? 0).getTime();
          return (
            <span
              key={index}
              className="flex items-center justify-center w-full h-[50px]"
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
              <span
                className={`flex items-center justify-center rounded-full w-[28px] h-[28px] ${
                  !isSelectedDate && item.isSelectable
                    ? "text-body2 text-grayscale-300 hover:bg-grayscale-900"
                    : ""
                } ${
                  isSelectedDate
                    ? "bg-main-lilac50 text-grayscale-800 text-head4"
                    : ""
                } ${!item.isSelectable ? "text-head4 text-grayscale-600" : ""}`}
              >
                {item.dayOfMonth}
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
}

export interface DayItem {
  dayOfMonth: number | null;
  isSelectable: boolean;
}
