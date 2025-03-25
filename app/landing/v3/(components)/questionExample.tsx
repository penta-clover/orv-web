import { useEffect, useState } from "react";
import Image from "next/image";

export default function QuestionExample() {
  const questions = [
    [
      "과거로 돌아가서",
      "인생을 새롭게 살 수 있다면",
      "언제로 돌아가실 건가요?",
    ],
    [
      "만약 좋아하는 영화 속",
      "인물이 될 수 있다면",
      "어떤 인물이 되고 싶나요?",
    ],
    [
      "기억에 남는 흑역사가 있나요?",
      "그 흑역사를 함께 알고 있는",
      "사람은 누구인가요?",
    ],
    ["1년 전의 나에게", "조언을 한다면", "어떤 말을 하시겠어요?"],
    [
      "지금 내 핸드폰에 있는",
      "가장 오래된 사진을 보여주고",
      "그 사진을 설명해주세요",
    ],
    ["요즘 나의 이상형은?", "전과 달라진 부분이 있다면", "함께 설명해주세요"],
    ["나 스스로를", "단어로 표현한다면", "어떤 단어들이 떠오르나요?"],
    ["요즘 나에게 가장", "행복을 주는 것은 무엇인가요?"],
    [
      "과거의 나에게 지금의 생각을",
      "5글자로 전할 수 있다면",
      "언제 무슨 말을 전할 건가요?",
    ],
  ];
  const [selectedQuestionIdx, setSelectedQuestionIdx] = useState(0);
  const [opacity, setOpacity] = useState(100);

  useEffect(() => {
    const interval = setInterval(() => {
      // 현재 표시되고 있는 질문 fade-out 효과 주기
      setOpacity(0);

      // 질문 바꾸고 fade-in 효과 주기
      setTimeout(() => {
        setSelectedQuestionIdx((prev) => (prev + 1) % questions.length);
        setOpacity(100);
      }, 700);
    }, 2500); // 이 과정을 일정 주기로 반복

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center w-full h-auto">
      <div className="relative w-full flex justify-center">
        <Image unoptimized 
          src="https://d3bdjeyz3ry3pi.cloudfront.net/static/images/question-board.png"
          width={0}
          height={0}
          sizes="100vw"
          alt={"question example"}
          className="w-full max-w-[343px] h-auto"
          style={{ objectFit: "fill" }}
        />

        <div
          className={`absolute top-0 h-full w-full flex flex-col justify-center items-center transition-opacity duration-700 opacity-${opacity}`}
        >
          {questions[selectedQuestionIdx].map((text, index) => (
            <div
              key={index}
              className="text-grayscale-600 font-regular text-[20px] leading-[28px] text-center font-onglyph"
            >
              {text}
            </div>
          ))}
        </div>
      </div>

      <div className="h-[40px]" />

      <div className="flex flex-col items-center">
        <div className="text-white text-body2">
          오브에서 던져주는 질문을 통해
        </div>
        <div className="text-white text-body2">나 스스로와 대화하세요</div>

        <div className="h-[16px]" />
        <div className="text-white text-body2">
          이 과정에서 <span className="text-main-lilac50">진짜 나</span>를
          마주해보세요
        </div>
      </div>
    </div>
  );
}
