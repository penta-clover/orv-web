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
    newGifts[1] = selected; // Update the selected gift
    const giftString = newGifts.join(",");
    router.push(
      `/time-capsule/gift/third?blobKey=${blobKey}&topic=${topic}&gift=${giftString}`
    );
  };

  return (
    <div className="flex flex-col w-full h-full">
      <div className="grow" />
      <SecondGiftSelector handleSelectGift={handleGiftClick} />
      <div className="grow" />
    </div>
  );
}

function SecondGiftSelector({
  handleSelectGift,
}: {
  handleSelectGift: (selected: string) => void;
}) {
  return (
    <div className="flex flex-col">
      <div className="text-head2 text-grayscale-white mx-[20px]">두번째로 담을</div>
      <div className="text-head2 text-grayscale-white mx-[20px]">선물을 골라주세요</div>
      <div className="text-body4 text-grayscale-300 mx-[20px]">
        타임캡슐을 더 근사하게 만들기 위한 가상의 선물이에요
      </div>

      <div className="h-[40px]" />

      <div className="flex justify-center mx-[15px] gap-[10px]">
        <ImageOptionButton
          imgSrc="https://d3bdjeyz3ry3pi.cloudfront.net/static/images/milk.png"
          onClick={() => handleSelectGift("mil")}
        >
          <span className="text-head4 font-bold tracking-tight text-grayscale-white mb-[8px]">
            {"저지방 우유"}
          </span>
        </ImageOptionButton>

        <ImageOptionButton
          imgSrc="https://d3bdjeyz3ry3pi.cloudfront.net/static/images/dogfood.png"
          onClick={() => handleSelectGift("dog")}
        >
          <span className="text-head4 font-bold tracking-tight text-grayscale-white mb-[8px]">
            {"강아지 사료"}
          </span>
        </ImageOptionButton>
      </div>
    </div>
  );
}
