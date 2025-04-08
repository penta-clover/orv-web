"use client";

import "@/app/components/blackBody.css";

import Image from "next/image";

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="flex flex-col items-center justify-center h-[calc(100vh)] w-full">
        <Image
          src="/icons/logo.svg"
          alt="orv logo"
          width={120}
          height={57}
          className="mb-[40px]"
        />

        <div className="h-[100px] flex flex-col justify-center">
          <div className="text-grayscale-white text-head2 text-center">
            노트북 또는 데스크탑에서 이용해주세요
          </div>
          <div className="h-[8px]" />
          <div className="text-grayscale-400 text-body4 text-center">
            아직은 모바일에서 오브를 이용할 수 없어요.<br/>
            빠른 시일 안에 오브 모바일 버전으로 찾아뵐게요!
          </div>
        </div>
      </div>
    </div>
  );
}
