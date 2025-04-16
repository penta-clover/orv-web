'use client';

import { useState } from "react";
import Spinner from "./spinner";

export default function TimeSelector(props: {
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
