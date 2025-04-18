"use client";

import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import "@/app/components/blackBody.css";

export default function Page() {
  return (
    <div className="flex flex-col relative bg-dark w-full h-[calc(100dvh)]">
      <div className="h-[20dvh]" />

      <div className="text-head1 text-grayscale-white mx-[16px]">
        다음 타임캡슐 참여자를
        <br />
        초대할 수 있는 링크를 생성했어요!
      </div>

      <div className="text-grayscale-300 text-body4 mx-[16px]">
        타임캡슐 프로젝트에 함께 하고 싶은 친구를 직접 초대할 수 있어요.
        생각나는 친구에게 초대링크를 선물해주세요
      </div>
      <div className="grow" />
    </div>
  );
}
