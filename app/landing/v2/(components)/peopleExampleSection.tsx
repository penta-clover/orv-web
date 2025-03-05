import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import AutoScroll from "embla-carousel-auto-scroll";
import Image from "next/image";
import { useEffect, useMemo, useRef } from "react";

export default function PeopleExampleSection(props: { referralCode?: string }) {
  const images: { referral: string; src: string }[] = [
    {
      referral: "JS",
      src: "/images/landing-demo-js.jpg",
    },
    {
      referral: "JM",
      src: "/images/landing-demo-jm.jpg",
    },
    {
      referral: "HJ",
      src: "/images/landing-demo-hj.jpg",
    },
    {
      referral: "GA",
      src: "/images/landing-demo-ga.jpg",
    },
    {
      referral: "HS",
      src: "/images/landing-demo-hs.jpg",
    },
    {
      referral: "ZZ",
      src: "/images/landing-demo-zz.jpg",
    },
    {
      referral: "JH",
      src: "/images/landing-demo-jh.jpg",
    },
    {
      referral: "last",
      src: "/images/landing-demo-last.jpg",
    },
  ];

  // props로 주어진 referral code와 동일한 referral을 가진 이미지 제외
  const filteredImages = images.filter(
    (image) => image.referral !== props.referralCode
  );

  // AutoScroll 인스턴스를 useMemo로 생성하여 동일한 인스턴스를 유지
  const autoScroll = useMemo(() => AutoScroll({ speed: 0.8 }), []);

  // 캐러셀 컨테이너에 대한 ref 생성
  const carouselContainerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer를 사용해 캐러셀의 뷰포트 진입 감지
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // 캐러셀이 화면에 보이면 자동 스크롤 시작
            if (!autoScroll.isPlaying()) {
              autoScroll.play();
            }
          } else {
            // 화면에서 벗어나면 자동 스크롤 중지
            if (autoScroll.isPlaying()) {
              autoScroll.stop();
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    if (carouselContainerRef.current) {
      observer.observe(carouselContainerRef.current);
    }

    return () => {
      if (carouselContainerRef.current) {
        observer.unobserve(carouselContainerRef.current);
      }
    };
  }, [autoScroll]);

  return (
    <div
      ref={carouselContainerRef}
      className="flex flex-col items-center w-full"
    >
      <div className="text-head1 text-grayscale-white flex flex-col items-center">
        <span>나 스스로를 마주하는 일</span>
        <span>많은 분들이 함께 하고 있어요</span>
      </div>

      <div className="h-[24px]" />

      <Carousel
        opts={{
          align: "center",
          loop: false,
        }}
        plugins={[autoScroll]}
        className="w-full"
      >
        <CarouselContent className="flex">
          {filteredImages.map((image, index) => (
            <CarouselItem
              key={index}
              className={`w-[270.2px] h-[152px] p-0 mr-[8px] basis-auto ${
                index === 0 ? "ml-[24px]" : ""
              }`}
            >
              <Image
                src={image.src}
                width={270.2}
                height={152}
                alt="card"
                className="rounded w-[270.2px] h-[152px]"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
