"use client";

import Image from "next/image";

export default function ActionBar(
  props: {
    onClickIntroduction: () => void;
    onClickExplore: () => void;
  }
) {

  return (
    <div className="flex flex-row items-center justify-between h-[56px] px-[16px]">
      <div className="text-head2 text-white">
        사용 가이드
      </div>
      <div className="flex flex-row items-center h-full">
        <div
          className="text-body3 text-[#F1F1F4] px-[12px] h-full flex items-center"
          onClick={() => props.onClickIntroduction()}
        >
          서비스 소개
        </div>
        <div className="w-[1.5px] h-[12px]">
          <Image
            src="/icons/vertical-separator.svg"
            width={1.5}
            height={12}
            alt="separator"
          />
        </div>
        <div
          className="text-body3 text-[#F1F1F4] pl-[12px] h-full flex items-center"
          onClick={() => props.onClickExplore()}
        >
          둘러보기
        </div>
      </div>
    </div>
  );
}
