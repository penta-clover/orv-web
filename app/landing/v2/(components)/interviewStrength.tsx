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
      rootMargin: "0px",
      threshold: 0.6, // Increased threshold for better visibility detection
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = itemRefs.current.findIndex(
            (ref) => ref === entry.target
          );
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
      profile: "25세 / 대학생 / 이OO님",
      content: (
        <div className="flex flex-col items-center">
          <span className="font-semibold text-[14px] leading-[22px] text-grayscale-black">
            내가 이렇게 밝게 웃고 있을 줄 몰랐어요.
          </span>
          <span className="text-body4 text-grayscale-600">
            영상을 다시 보면서 어떤 순간에
          </span>
          <span className="text-body4 text-grayscale-600">
            가장 즐거워하는지 스스로 알게 됐어요.
          </span>
        </div>
      ),
    },
    {
      profile: "26세 / 대학생 / 김OO님",
      content: (
        <div className="flex flex-col items-center">
          <span className="text-body4 text-grayscale-600">
            나를 인터뷰하는 기회가 너무 특별했어요.
          </span>
          <span className="text-body4 text-grayscale-600">
            저는 뭔가 저도 저지만
          </span>
          <span className="font-semibold text-[14px] leading-[22px] text-grayscale-black">
            제 가족들 그리고 친구들의 모습도
          </span>
          <span className="font-semibold text-[14px] leading-[22px] text-grayscale-black">
            너무 궁금해졌어요
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
    {
      profile: "31세 / 직장인 / 임OO님",
      content: (
        <div className="flex flex-col items-center">
          <span className="text-body4 text-grayscale-600">
            막막했던 고민을 이야기하면서
          </span>
          <span className="text-body4 text-grayscale-600">해답을 찾았어요</span>
          <span className="font-semibold text-[14px] leading-[22px] text-grayscale-black">
            알고보니 제 안에 이미
          </span>
          <span className="font-semibold text-[14px] leading-[22px] text-grayscale-black">
            답이 있었다는 걸 깨달았어요.
          </span>
        </div>
      ),
    },
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
      profile: "28세 / 취업준비생 / 신OO님",
      content: (
        <div className="flex flex-col items-center">
          <span className="font-semibold text-[14px] leading-[22px] text-grayscale-black">
            혼자였다면 계속
          </span>
          <span className="font-semibold text-[14px] leading-[22px] text-grayscale-black">
            제자리걸음이었을 것 같아요.
          </span>
          <span className="text-body4 text-grayscale-600">
            말하면서 진짜 내가 원했던 것이
          </span>
          <span className="text-body4 text-grayscale-600">
            무엇인지를 깨달을 수 있었어요.
          </span>
        </div>
      ),
    },
  ];
}
