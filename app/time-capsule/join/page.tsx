"use client";

import Image from "next/image";
import Link from "next/link";
import "@/app/components/blackBody.css";
import { Suspense, useEffect } from "react";
import { useSetRedirectUrl } from "@/app/components/hooks/useSetRedirect";
import { useSearchParams } from "next/navigation";

export default function Page() {
  return (
    <Suspense>
      <Body />
    </Suspense>
  );
}

function Body() {
  const searchParams = useSearchParams();
  const blobKey = searchParams.get("blobKey");
  const { setRedirectUrl } = useSetRedirectUrl();

  useEffect(() => {
    setRedirectUrl(`/time-capsule/upload?blobKey=${blobKey}`);
  }, []);

  return (
    <div className="flex flex-col h-[calc(100dvh)] justify-center items-center">
      <div className="h-[20dvh] shrink" />

      <div className="text-head1 text-grayscale-white w-full px-[16px]">
        10초만에 회원가입 후
        <br />
        타임캡슐을 받을 연락처를 남겨주세요
      </div>

      <div className="text-grayscale-300 text-body4 w-full px-[16px]">
        오늘 제작해주신 타임캡슐을 안전하게 보관 후 전달드리기 위해서 회원가입이
        필요해요
      </div>

      <div className="h-[45px]" />

      <div className="flex flex-col space-y-[12px] items-center max-w-[532px] w-full">
        <div className="flex flex-row w-[calc(100%-48px)] justify-center">
          <Link
            href="https://api.orv.im/api/v0/auth/login/kakao"
            className="flex flex-row grow space-x-[8px] items-center justify-center rounded-[10px] text-grayscale-black text-body2 h-[48px] max-w-[450px] bg-[#FCE34C] transition-all active:scale-95"
          >
            <Image
              src="/icons/kakao_logo.svg"
              alt="google logo"
              width={24}
              height={24}
            />
            <span>카카오로 빠르게 시작하기</span>
          </Link>
        </div>
        <div className="flex flex-row w-[calc(100%-48px)] justify-center">
          <Link
            href="https://api.orv.im/api/v0/auth/login/google"
            className="flex flex-row grow space-x-[8px] items-center justify-center border-[1px] border-lightgray rounded-[10px] text-grayscale-black text-body2 h-[48px] max-w-[450px] bg-grayscale-white transition-all active:scale-95"
          >
            <Image
              src="/icons/google_logo.svg"
              alt="google logo"
              width={24}
              height={24}
            />
            <span>Google 계정으로 계속하기</span>
          </Link>
        </div>
      </div>
      <div className="grow" />
    </div>
  );
}
