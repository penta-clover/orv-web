"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function ProjectorSection() {
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setHasStarted(true);
            observer.disconnect(); // 한 번 시작하면 더 이상 관찰하지 않음
          }
        });
      },
      {
        rootMargin: "0px 0px -35% 0px",
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex flex-col items-center w-full">
      <div className="text-head1 text-grayscale-white flex flex-col items-center">
        <span>오늘이 지나면 잊혀지는</span>
        <span>나의 목소리, 표정,</span>
        <span>그리고 나를 기록하세요</span>
      </div>
      <div className="h-[24px]" />
      <div className="relative flex flex-col items-center justify-start overflow-x-hidden overflow-y-visible h-[550px] w-full">
        <div className="relative flex flex-col items-center">
          <Image unoptimized 
            src="https://d3bdjeyz3ry3pi.cloudfront.net/static/images/film.svg"
            alt="film"
            width={376}
            height={237}
            className="w-auto h-auto"
          />
          <div className="absolute top-[38px] left-[31px] z-10 flex flex-row items-center gap-[7px]">
            <Image unoptimized 
              src="/icons/error-circle.svg"
              alt="error"
              width={12.48}
              height={12.48}
            />
            <div className="text-caption1 text-grayscale-700">REC</div>
          </div>
          <div className="absolute top-[38px] text-caption1 text-grayscale-700">
            24 : 00 : 00
          </div>
          <div className="absolute top-0 bottom-0 flex flex-col items-center justify-center z-10 w-full">
            <div className="text-white text-[18px] font-semibold">
              일주일 중 하루만 기록해도
            </div>
            <div className="text-white text-[18px] font-semibold">
              1년 뒤 <span className="text-main-lilac50">24시간</span>의 영상이
              기록됩니다.
            </div>
          </div>
        </div>

        <div className="absolute top-[138px] w-full">
          <div className="relative">
            <div
              className="absolute top-[35px] right-[-8px] overflow-x-hidden overflow-y-visible z-10"
              style={{
                animation: "spin 4s linear infinite",
              }}
            >
              <Image unoptimized  src="https://d3bdjeyz3ry3pi.cloudfront.net/static/images/reel.png" alt="reel" width={81} height={81} />
            </div>

            <div
              className="absolute top-[0px] right-[-8px] overflow-x-hidden overflow-y-visible z-5"
              style={{ width: "calc(100%)", height: "220px" }}
            >
              <Image unoptimized 
                src="https://d3bdjeyz3ry3pi.cloudfront.net/static/images/line.png"
                alt="line"
                fill
                style={{ width: "100%", height: "100%" }}
              />
            </div>

            <div className="absolute top-[178px] left-[34px] text-body2 text-gray-500 rotate-[-9.45deg]">
              차곡차곡 쌓이는 영상들은
            </div>
          </div>
        </div>

        <div ref={containerRef} className="absolute top-[330px] w-full">
          <div
            className={`relative opacity-0 ${
              hasStarted ? "blink-animation" : ""
            }`}
          >
            <Image unoptimized 
              src={"https://d3bdjeyz3ry3pi.cloudfront.net/static/images/projector-beam.svg"}
              alt="beam"
              width={0}
              height={0}
              style={{ width: "calc(100vw)" }}
            />

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="left-[34px] mr-[106px] text-head2 text-dark">
                몇번이고 다시 볼 수 있는
              </div>
              <div className="left-[34px] ml-[145px] text-head2 text-dark">
                소중한 추억이 될 거예요
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes blink {
            0% {
              opacity: 0;
            }
            100% {
              opacity: 1;
            }
          }
          .blink-animation {
            animation: blink 0.8s linear forwards;
          }
        `}</style>

        <style jsx>{`
          @keyframes spin {
            from {
              transform: rotate(360deg);
            }
            to {
              transform: rotate(0deg);
            }
          }
        `}</style>
      </div>
    </div>
  );
}
