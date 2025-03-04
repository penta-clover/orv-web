import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function InterviewStrength() {
  const reviews = getReviews();
  const [activeIndex, setActiveIndex] = useState(0);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.6, // Increased threshold for better visibility detection
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = itemRefs.current.findIndex(ref => ref === entry.target);
          if (index !== -1) {
            setActiveIndex(index);
          }
        }
      });
    }, observerOptions);

    // Clear previous refs and observe current ones
    itemRefs.current.forEach((ref, index) => {
      if (ref) {
        observer.observe(ref);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [itemRefs]);

  return (
    <div className="flex flex-col items-center w-full">
      <div className="text-head1 text-grayscale-white flex flex-col items-center">
        <span>나를 인터뷰하면서</span>
        <span>스스로를 깊이 이해할 수 있어요</span>
      </div>

      <Carousel
        opts={{
          loop: true,
          skipSnaps: true,
        }}
        className="w-full"
      >
        // gap between items: 16px
        <CarouselContent className="flex">
          {reviews.map(({ profile, content }, index) => (
            <CarouselItem
              key={index}
              ref={(el) => {
                itemRefs.current[index] = el;
                console.log(itemRefs.current);
              }}
              className={`flex flex-col w-[307px] mx-[8px] h-[210px] py-[16px] px-[11px] rounded-[4px] bg-grayscale-white basis-auto transition-opacity ${
                activeIndex === index ? "opacity-100" : "opacity-60"
              }`}
            >
              <FiveStars />
              <div className="w-full h-[1px] bg-grayscale-100 mt-[16px]" />
              <div className="flex items-center justify-center grow">
                {content}
              </div>
              <div className="flex flex-row items-center justify-center">
                <Image
                  src={"/icons/profile-image-blue.svg"}
                  width={18}
                  height={18}
                  alt="profile"
                />
                <span className="ml-[6px] text-caption2 text-grayscale-500">
                  {profile}
                </span>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}

function FiveStars() {
  return (
    <div className="flex flex-row w-full gap-[2px] justify-center">
      <Image src={"/icons/star.svg"} width={20} height={20} alt="star" />
      <Image src={"/icons/star.svg"} width={20} height={20} alt="star" />
      <Image src={"/icons/star.svg"} width={20} height={20} alt="star" />
      <Image src={"/icons/star.svg"} width={20} height={20} alt="star" />
      <Image src={"/icons/star.svg"} width={20} height={20} alt="star" />
    </div>
  );
}

function getReviews() {
  return [
    {
      profile: "25세 / 취업준비생 / 최OO님",
      content: (
        <div className="flex flex-col items-center">
          <span className="text-body4 text-grayscale-600">
            반년 넘게 저를 괴롭혀온 고민을
          </span>
          <span className="text-body4 text-grayscale-600">
            오브에서 솔직하게 털어놓으며 생각이 정리됐어요
          </span>
          <span className="font-semibold text-[14px] leading-[22px] text-grayscale-black">
            고민만 되풀이하던 내용들을 말로 하고 나니
          </span>
          <span className="font-semibold text-[14px] leading-[22px] text-grayscale-black">
            자연스레 해결책이 보였어요
          </span>
        </div>
      ),
    },
    {
      profile: "28세 / 직장인 / 이OO님",
      content: (
        <div className="flex flex-col items-center">
          <span className="text-body4 text-grayscale-600">
            오브에서 처음 질문을 받았을 때
          </span>
          <span className="text-body4 text-grayscale-600">
            머리를 한 대 얻어맞은 느낌이었어요
          </span>
          <span className="font-semibold text-[14px] leading-[22px] text-grayscale-black">
            저는 제 자신을 전혀 모르고 있었다는 걸
          </span>
          <span className="font-semibold text-[14px] leading-[22px] text-grayscale-black">
            인터뷰하면서 알게 됐거든요.
          </span>
        </div>
      ),
    },
    {
      profile: "26세 / 프리랜서 / 김OO님",
      content: (
        <div className="flex flex-col items-center">
          <span className="text-body4 text-grayscale-600">
            생각해보지 않았던 중요한 지점들을
          </span>
          <span className="text-body4 text-grayscale-600">
            오브에서 되짚어 볼 수 있었어요.
          </span>
          <span className="font-semibold text-[14px] leading-[22px] text-grayscale-black">
            인터뷰가 끝난 뒤에도 영상을 돌려 보며
          </span>
          <span className="font-semibold text-[14px] leading-[22px] text-grayscale-black">
            다시 생각해볼 수 있어 좋았어요.
          </span>
        </div>
      ),
    },
  ];
}
