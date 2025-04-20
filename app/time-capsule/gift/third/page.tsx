"use client";

import { Suspense } from "react";
import OptionButton from "../(components)/OptionButton";
import { useRouter, useSearchParams } from "next/navigation";
import "@/app/components/blackBody.css";

export default function Page() {
  return (
    <Suspense>
      <Body />
    </Suspense>
  );
}

function Body() {
  const params = useSearchParams();
  const blobKey = params.get("blobKey");
  const topic = params.get("topic");
  const gifts = params.get("gift")?.split(",") || ["", "", ""];

  const router = useRouter();

  const handleGiftClick = (selected: string) => {
    const newGifts = [...gifts];
    newGifts[2] = selected; // Update the selected gift
    const giftString = newGifts.join(",");
    router.push(
      `/time-capsule/finish?blobKey=${blobKey}&topic=${topic}&gift=${giftString}`
    );
  };

  return (
    <div className="flex flex-col w-full h-full">
      <div className="grow" />
      <ThirdGiftSelector handleSelectGift={handleGiftClick} />
      <div className="grow" />
    </div>
  );
}


function ThirdGiftSelector({
    handleSelectGift,
  }: {
    handleSelectGift: (selected: string) => void;
  }) {
    return (
      <div className="flex flex-col mx-[20px]">
        <div className="text-head1 text-grayscale-white">마지막으로 담을</div>
        <div className="text-head1 text-grayscale-white">선물을 골라주세요</div>
        <div className="text-body4 text-grayscale-300">
          1년 뒤 나에게 영상과 함께 보낼 선물을 골라주세요
        </div>
  
        <div className="h-[40px]" />
  
        <OptionButton onClick={() => handleSelectGift("ban")}>
          {"약간 상한 바나나"}
        </OptionButton>
        <div className="h-[20px]" />
        <OptionButton onClick={() => handleSelectGift("dol")}>
          {"돌"}
        </OptionButton>
      </div>
    );
  }