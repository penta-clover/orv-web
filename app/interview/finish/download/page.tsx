"use client";

import "@/app/components/blackBody.css";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import QRCodeComponent from "./qrCodeComponent";
import Image from "next/image";
import ExitInterviewModal from "../../(components)/exitInterviewModal";

export default function Page() {
  return (
    <Suspense>
      <Body />
    </Suspense>
  );
}

function Body() {
  const searchParams = useSearchParams();
  const videoId = searchParams.get("videoId")!;
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const today = new Date();
  const formattedDate =
    today.getFullYear() +
    "." +
    String(today.getMonth() + 1).padStart(2, "0") +
    "." +
    String(today.getDate()).padStart(2, "0");

  return (
    <ExitInterviewModal
      isOpen={isModalOpen}
      setIsOpen={setIsModalOpen}
      onExitInterview={() => router.replace("/")}
    >
      <div className="relative flex flex-col h-[100dvh] justify-center">
        <Image
          unoptimized
          src="/icons/x.svg"
          width={32}
          height={32}
          alt="close"
          onClick={() => setIsModalOpen(true)}
          className="fixed top-[10px] right-[10px] px-[16px] py-[12px] w-[64px] h-[56px] focus:outline-none cursor-pointer"
        />
        <div className="flex flex-col items-center justify-center">
          <div className="text-white font-semibold text-[40px] leading-[64px] text-center">
            {formattedDate} 오늘은 여기까지
            <br />
            아래 QR을 통해 영상을 받으면 됩니다.
          </div>

          <div className="h-[84px]" />

          <div>
            <QRCodeComponent
              url={`https://www.orv.im/interview/finish/mobile-download?videoId=${videoId}`}
            />
          </div>

          <div className="h-[120px]" />

          <button
            className="flex items-center gap-[5px] justify-center w-[190px] h-[56px] rounded-[12px] active:scale-95 bg-main-lilac50 bg-grayscale-800"
            onClick={() => {
              router.push("/");
            }}
          >
            <Image
              unoptimized
              src="/icons/complete_check.svg"
              width={24}
              height={24}
              alt="left arrow"
            />
            <span className="text-head3 text-grayscale-800">
              홈으로 돌아가기
            </span>
          </button>
        </div>
      </div>{" "}
    </ExitInterviewModal>
  );
}
