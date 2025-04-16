"use client";

import Link from "next/link";
import Image from "next/image";
import "@/app/components/blackBody.css";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function Page() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 2000); // 1초마다 이미지 변경
    return () => clearInterval(interval);
  }, []);

  const images = [
    {
      referral: "GA",
      src: "https://d3bdjeyz3ry3pi.cloudfront.net/static/images/landing-demo-ga.jpg",
      alt: "데모 이미지",
      className: "object-cover rounded-[8px]",
    },
    {
      referral: "JS",
      src: "https://d3bdjeyz3ry3pi.cloudfront.net/static/images/landing-demo-js.jpg",
      alt: "데모 이미지",
      className: "object-cover rounded-[8px]",
    },
    {
      referral: "JM",
      src: "https://d3bdjeyz3ry3pi.cloudfront.net/static/images/landing-demo-jm.jpg",
      alt: "데모 이미지",
      className: "object-cover rounded-[8px]",
    },
    {
      referral: "HS",
      src: "https://d3bdjeyz3ry3pi.cloudfront.net/static/images/landing-demo-hs.jpg",
      alt: "데모 이미지",
      className: "object-cover rounded-[8px]",
    },
  ];

  return (
    <div className="flex flex-col h-[calc(100dvh)] justify-center items-center">
      <div className="h-[8dvh] shrink" />

      <Image
        src={"/icons/logo-main-lilac50.svg"}
        alt="logo"
        width={120}
        height={61}
      />

      <div className="h-[37px] shrink" />

      <div className="text-head2 text-grayscale-white">
        당신만의 인터뷰 지금 시작하세요
      </div>

      <div className="h-[19px]" />

      <div className="max-w-[532px] w-full aspect-[16/9] relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={images[currentIndex].src}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute top-0 left-0 w-full h-full"
          >
            <Image
              unoptimized
              src={images[currentIndex].src}
              alt="landing-demo-image"
              width={0}
              height={0}
              className="max-w-[532px] w-full aspect-[16/9]"
            />
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="h-[19px]" />

      <div className="text-head3 text-grayscale-white text-center">
        10초 만에 로그인하고
        <br />
        나만의 인터뷰 영상을 남겨보기
      </div>

      <div className="h-[94px] shrink" />

      <div className="flex flex-col space-y-[12px] items-center max-w-[532px] w-full">
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
        <div className="h-[16px]" />
      </div>
    </div>
  );
}
