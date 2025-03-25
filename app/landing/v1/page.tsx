"use client";

import ActionBar from "./(components)/actionBar";
import { useRouter } from "next/navigation";
import EndingComment from "./(components)/endingComment";
import Image from "next/image";
import FloatingButton from "./(components)/floatingButton";
import ProjectorSection from "./(components)/projectorSection";

import "@/app/components/blackBody.css";
import DescriptionSection from "./(components)/descriptionSection";
import { useEffect, useRef, useState } from "react";
import Footer from "./(components)/footer";
import { track } from "@/app/amplitude";
import QuestionExample from "./(components)/questionExample";
import VideoCarousel from "./(components)/videoCarousel";
import MirrorSection from "./(components)/mirrorSection";

export default function Page() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const router = useRouter();
  const [referral, setReferral] = useState("");

  // 영상 재생 종료 시 화면 아래로 스크롤
  const handleVideoEnd = () => {
    if (window.scrollY < 50) {
      window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
    }
  };

  const onClickStartButton = () => {
    track("click_start_orv", {
      y_top: window.scrollY,
      y_bottom: window.scrollY + window.innerHeight,
    });
    router.push("/landing/v1/registration");
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
    setReferral(cookies["orv-landing-referral"] || "");
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

  return (
    <div className="relative bg-dark">
      <div className="absolute top-0 w-full z-50">
        <ActionBar
          onClickGuide={() => {
            track("click_guide_landing");
            router.push("/landing/v1/guide");
          }}
          onClickExplore={() => {
            track("click_lookaround_landing");
            window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
          }}
        />
      </div>
      <div className="relative w-full h-[calc(100vh)] flex justify-center items-center">
        <div className="absolute top-[52px] w-full">
          <Image unoptimized 
            src="https://d3bdjeyz3ry3pi.cloudfront.net/static/images/dark-wave.png"
            width={375}
            height={222}
            alt="dark wave"
            priority
            className="w-full h-auto"
          />
        </div>

        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          preload="auto"
          onEnded={handleVideoEnd}
          className="w-full block z-10"
        >
          <source src="/videos/landing-video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <div className="absolute bottom-[135px] w-full transform scale-[-1]">
          <Image unoptimized 
            src="https://d3bdjeyz3ry3pi.cloudfront.net/static/images/dark-wave.png"
            width={375}
            height={222}
            alt="dark wave"
            priority
            className="w-full h-auto"
          />
        </div>
      </div>

      <h1 id="introduction-start" className="h-[45px]" />

      <MirrorSection />

      <div className="h-[150px]" />

      <VideoCarousel referralCode={referral} />

      <div className="h-[150px]" />

      <QuestionExample />

      <div className="h-[150px]" />

      <ProjectorSection />

      <div className="h-[121px]" />

      <DescriptionSection />

      <div className="h-[93px]" />

      <EndingComment />

      <div className="h-[72px]" />

      <Footer />

      <div className="fixed bottom-[32px] w-full max-w-[450px] z-50">
        <FloatingButton onClick={onClickStartButton} />
      </div>
    </div>
  );
}
