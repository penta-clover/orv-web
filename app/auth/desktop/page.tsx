import Link from "next/link";
import Image from "next/image";
import "@/app/components/blackBody.css";

export default function Page() {
  // TODO: 이미 로그인 한 사람 처리
  return (
    <div className="flex flex-col justify-center items-center pt-[calc(12dvh)]">
      <Image
        src={"/icons/logo-main-lilac50.svg"}
        alt="logo"
        width={120}
        height={61}
      />

      <div className="h-[37px]" />

      <div className="text-head1 text-grayscale-white">
        당신만의 인터뷰 지금 시작하세요
      </div>

      <div className="h-[19px]" />

      <Image
        unoptimized
        src="https://d3bdjeyz3ry3pi.cloudfront.net/static/images/landing-demo-hs.jpg"
        alt="landing-demo-hs"
        width={393}
        height={221}
      />

      <div className="h-[19px]" />

      <div className="text-head3 text-grayscale-white text-center">
        10초 만에 로그인하고
        <br />
        나만의 인터뷰 영상을 남겨보기
      </div>

      <div className="h-[94px]" />

      <div className="flex flex-col space-y-[12px] items-center w-[432px]">
        <div className="flex flex-row w-full justify-center px-[24px]">
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
        <div className="flex flex-row w-full justify-center px-[24px]">
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
    </div>
  );
}
