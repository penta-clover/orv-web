"use client";

import ActionBar from "./(components)/actionBar";
import { useRouter } from "next/navigation";
import EndingComment from "./(components)/endingComment";
import Image from "next/image";
import ProjectorSection from "./(components)/projectorSection";

import "@/app/components/blackBody.css";
import { useEffect, useRef, useState } from "react";
import Footer from "./(components)/footer";
import { track } from "../../amplitude";
import HeaderSection from "./(components)/headerSection";
import SelfAwarenessSection from "./(components)/selfAwarenessSection";
import WorrySection from "./(components)/worrySection";
import UiPreviewSection from "./(components)/uiPreviewSection";
import WhyOrv from "./(components)/whyOrv";
import InterviewStrength from "./(components)/interviewStrength";
import HowSection from "./(components)/howSection";
import PriceSection from "./(components)/priceSection";
import PeopleExampleSection from "./(components)/peopleExampleSection";
import BirthstorySection from "./(components)/birthstorySection";
import { cn } from "@/lib/utils";
import { useSidebar } from "./sidebarContext";
import QRSection from "./(components)/qrSection";
import GiftSection from "./(components)/giftSection";

export default function Page() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const router = useRouter();
  const [referralCode, setReferralCode] = useState("");
  const { isSidebarOpen, setIsSidebarOpen } = useSidebar()!;

  // 영상 재생 종료 시 화면 아래로 스크롤
  const handleVideoEnd = () => {
    if (window.scrollY < 30) {
      window.scrollTo({ top: window.innerHeight - 96, behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (isSidebarOpen) {
      videoRef.current?.pause();
    } else {
      videoRef.current?.play().catch((error) => {
        console.warn("Video play interrupted:", error);
      });
    }
  }, [isSidebarOpen]);

  const onClickStartButton = () => {
    track("click_start_orv", {
      y_top: window.scrollY,
      y_bottom: window.scrollY + window.innerHeight,
    });
    router.push("/landing/registration");
  };

  // 레퍼럴 코드 쿠키에서 가져오기
  useEffect(() => {
    const parseCookies = () => {
      return document.cookie.split("; ").reduce((cookies: any, cookieStr) => {
        const [name, ...rest] = cookieStr.split("=");
        cookies[name] = rest.join("=");
        return cookies;
      }, {});
    };

    const cookies = parseCookies();
    setReferralCode(cookies["orv-landing-referral"] || "");
  }, []);

  // Intersection Observer를 사용하여 영상이 화면에 보일 때 재생, 그렇지 않으면 일시정지
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (videoRef.current) {
            if (entry.isIntersecting && videoRef.current.paused) {
              videoRef.current.play().catch((error) => {
                console.warn("Video play interrupted:", error);
              });
            } else if (!entry.isIntersecting && !videoRef.current.paused) {
              videoRef.current.pause();
            }
          }
        });
      },
      { threshold: 0.5 } // 영상의 50% 이상이 보일 때 isIntersecting가 true가 됩니다.
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, []);

  useEffect(() => {
    let lastTrackedPercentage = 0;
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      // video.duration이 없는 경우 대비
      if (!video.duration) return;

      const currentTime = video.currentTime;
      const currentPercentage = (currentTime / video.duration) * 100;

      // 재생률이 2% 이상 증가했을 때 이벤트 전송
      if (currentPercentage - lastTrackedPercentage >= 2) {
        lastTrackedPercentage = Math.floor(currentPercentage);
        track("playing_landing_video", { playing_time: currentTime });
      }
    };

    video.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, []);

  // 레퍼럴 코드 쿠키에서 가져오기
  useEffect(() => {
    const parseCookies = () => {
      return document.cookie.split("; ").reduce((cookies: any, cookieStr) => {
        const [name, ...rest] = cookieStr.split("=");
        cookies[name] = rest.join("=");
        return cookies;
      }, {});
    };

    const cookies = parseCookies();
    setReferralCode(cookies["orv-landing-referral"] || "");
  }, []);

  return (
    <div className="relative bg-dark">
      <div className="fixed top-0 left-0 right-0 max-w-[450px] mx-auto z-30 bg-dark">
        <ActionBar
          onClickMenu={() => {
            setIsSidebarOpen(true);
          }}
        />
      </div>

      <div className="relative flex flex-col items-center justify-center h-[100svh]">
        <HeaderSection videoRef={videoRef} handleVideoEnd={handleVideoEnd} />

        <div className="absolute bottom-[60px] flex justify-center">
          <Image unoptimized 
            src="/icons/down-arrow.svg"
            width={20}
            height={34}
            alt="down-arrow"
          />
        </div>
      </div>

      <h3 id="introduction-start" />

      <SelfAwarenessSection />

      <div className="h-[100px]" />

      <WorrySection />

      <div className="h-[100px]" />

      <UiPreviewSection />

      <div className="h-[36px]" />

      <CTA
        text="나만의 인터뷰 시작하기"
        onClick={() => {
          track("click_start_earlybird");
          router.push("/landing/v3/reservation");
        }}
      />

      <div className="h-[100px]" />

      <QRSection referralCode={referralCode} />

      <div className="h-[100px]" />

      <WhyOrv />

      <div className="h-[36px]" />

      <CTA
        text="주제 미리보기"
        onClick={() => {
          track("click_preview_topic");
          router.push("/landing/v3/topic");
        }}
      />

      <div className="h-[100px]" />

      <InterviewStrength />

      <div className="h-[100px]" />

      <PeopleExampleSection referralCode={referralCode} />

      <div className="h-[100px]" />

      <BirthstorySection />

      <div className="h-[36px]" />

      <CTA
        text="오브 브랜드 스토리 보러가기"
        onClick={() => {
          track("click_brand_story");
          router.push("/landing/v3/story");
        }}
      />

      <div className="h-[100px]" />

      <ProjectorSection />

      <EndingComment />

      <div className="h-[56px]" />

      <CTA
        text="질문에 대답하러 가기"
        onClick={() => {
          track("click_start_orv");
          router.push("/landing/v3/reservation");
        }}
        className="w-full h-[56px] mx-[16px] text-head3"
      />

      <div className="h-[56px]" />

      <Footer />
    </div>
  );
}

function CTA(props: { text: string; onClick: () => void; className?: string }) {
  return (
    <div className="w-full flex justify-center">
      <button
        style={{ boxShadow: "0px 0px 12px rgba(197, 209, 255, 0.6)" }}
        className={cn(
          "bg-main-lilac50 px-[13px] py-[9px] text-grayscale-800 text-head4 rounded-[10px] transition-all active:scale-95",
          props.className
        )}
        onClick={props.onClick}
      >
        {props.text}
      </button>
    </div>
  );
}
