'use client';

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function StartButton() {
  const router = useRouter();

  return (
    <div
      className="flex flex-row items-center justify-center w-[139px] h-[56px] bg-main-lilac50 rounded-[12px] transition-all ease-out hover:scale-105 active:scale-95"
      onClick={() => router.push("/dashboard/topic?guide-popup=true")}
    >
      <Image
        unoptimized
        src="/icons/camcoder-grayscale-800.svg"
        alt="camcoder icon"
        width={24}
        height={24}
      />

      <div className="w-[4px]" />

      <span className="text-head3 text-grayscale-800">시작하기</span>
    </div>
  );
}
