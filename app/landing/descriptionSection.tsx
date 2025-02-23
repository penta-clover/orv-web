import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function DescriptionSection() {
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [textVisible, setTextVisible] = useState<boolean[]>([
    false,
    false,
    false,
    false,
  ]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = textRefs.current.findIndex(
            (ref) => ref === entry.target
          );
          if (index !== -1 && entry.isIntersecting) {
            setTextVisible((prev) => {
              const newState = [...prev];
              newState[index] = true;
              return newState;
            });
          }
        });
      },
      {
        rootMargin: "0px 0px -30% 0px",
      }
    );

    textRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex flex-col items-center">
      <Image
        src="/icons/logo-mirror.svg"
        width={54}
        height={16.62}
        alt="logo"
        className="mb-[32px]"
      />

      <div
        ref={(el) => {
          textRefs.current[0] = el;
        }}
        className="flex flex-col items-center mb-[40px]"
      >
        <div
          className={`font-medium text-[16px]/[26px] transition-colors duration-700 ${
            textVisible[0] ? "text-main-lilac50" : "text-dark"
          }`}
        >
          내가 하지 않으면 그 누구도 대신해주지 않을
        </div>
        <div
          className={`font-medium text-[16px]/[26px] transition-colors duration-700 ${
            textVisible[0] ? "text-main-lilac50" : "text-dark"
          }`}
        >
          "나 스스로에 대해 알아가기"
        </div>
      </div>

      <div
        ref={(el) => {
          textRefs.current[1] = el;
        }}
        className="flex flex-col items-center mb-[40px]"
      >
        <div
          className={`font-medium text-[16px]/[26px] transition-colors duration-700 ${
            textVisible[1] ? "text-main-lilac50" : "text-grayscale-500"
          }`}
        >
          누구나 한번쯤은 '나는 누구인가' '언제 행복을 느끼는가'
        </div>
        <div
          className={`font-medium text-[16px]/[26px] transition-colors duration-700 ${
            textVisible[1] ? "text-main-lilac50" : "text-grayscale-500"
          }`}
        >
          '내가 원하는 것은 무엇일까'라는 생각을 해보지만
        </div>
        <div
          className={`font-medium text-[16px]/[26px] transition-colors duration-700 ${
            textVisible[1] ? "text-main-lilac50" : "text-grayscale-500"
          }`}
        >
          결국 잠깐일 뿐 잊혀지게 됩니다.
        </div>
      </div>

      <div
        ref={(el) => {
          textRefs.current[2] = el;
        }}
        className="flex flex-col items-center mb-[32px]"
      >
        <div
          className={`font-medium text-[16px]/[26px] transition-colors duration-700 ${
            textVisible[2] ? "text-main-lilac50" : "text-grayscale-500"
          }`}
        >
          오브에서는 당신을 위한 특별한 질문을 던지고
        </div>
        <div
          className={`font-medium text-[16px]/[26px] transition-colors duration-700 ${
            textVisible[2] ? "text-main-lilac50" : "text-grayscale-500"
          }`}
        >
          이에 대답하는 당신의 모습을 영상으로 남겨요
        </div>
      </div>

      <div
        ref={(el) => {
          textRefs.current[3] = el;
        }}
        className={`text-head2 mb-[32px] transition-colors duration-700 ${
          textVisible[3] ? "text-main-lilac50" : "text-grayscale-500"
        }`}
      >
        지금 시작하세요
      </div>

      <Image
        src="/icons/logo-mirror.svg"
        width={54}
        height={16.62}
        alt="logo"
        className="mb-[32px]"
      />
    </div>
  );
}
