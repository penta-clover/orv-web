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
        <div className="h-[16px]" />
      </div>
    </div>
  );
}
