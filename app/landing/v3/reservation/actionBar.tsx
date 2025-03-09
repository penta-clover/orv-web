"use client";

import Image from "next/image";

export default function ActionBar(props: {
  title?: string;
  onClickBack: () => void;
  onClickMenu: () => void;
}) {
  return (
    <div className="flex flex-row items-center justify-between h-[56px] w-full">
      <div className="h-[56px] w-[64px] flex items-center justify-center">
        <Image unoptimized 
          src="/icons/left-arrow.svg"
          width={32}
          height={32}
          alt="left arrow"
          onClick={() => props.onClickBack()}
        />
      </div>

      <div className="flex items-center justify-center grow text-head4 text-grayscale-white">
        {props.title}
      </div>

      <div className="h-[56px] w-[64px] flex items-center justify-center">
      </div>
    </div>
  );
}
