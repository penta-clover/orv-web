"use client";

import { Suspense } from "react";
import OptionButton from "../(components)/OptionButton";
import { useRouter, useSearchParams } from "next/navigation";
import "@/app/components/blackBody.css";
import ImageOptionButton from "../(components)/ImageOptionButton";

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
    <div className="flex flex-col">
      <div className="text-head2 text-grayscale-white mx-[20px]">
        마지막으로 담을
      </div>
      <div className="text-head2 text-grayscale-white mx-[20px]">
        선물을 골라주세요
      </div>
      <div className="text-body4 text-grayscale-300 mx-[20px]">
        1년 뒤 나에게 영상과 함께 보낼 선물을 골라주세요
      </div>

      <div className="h-[40px]" />

      <div className="flex justify-center mx-[15px] gap-[10px]">
        <ImageOptionButton
          imgSrc="https://d3bdjeyz3ry3pi.cloudfront.net/static/images/banana.png"
          onClick={() => handleSelectGift("ban")}
        >
          <span className="text-head4 font-bold tracking-tight text-grayscale-white mb-[8px]">
          {"약간 상한 바나나"}
          </span>
        </ImageOptionButton>

        <ImageOptionButton
          imgSrc="https://d3bdjeyz3ry3pi.cloudfront.net/static/images/stone.png"
          onClick={() => handleSelectGift("dol")}
        >
          <span className="text-head4 font-bold tracking-tight text-grayscale-white mb-[8px]">
          {"돌"}
          </span>
        </ImageOptionButton>
      </div>
    </div>
  );
}
