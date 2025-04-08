import { useState, useEffect, useRef } from "react";

interface TypewriterProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
}

/**
 * Typewriter 컴포넌트
 * 주어진 텍스트를 한 글자씩 표시합니다.
 */
const Typewriter: React.FC<TypewriterProps> = ({
  text,
  speed = 100,
  onComplete,
}) => {
  const [displayedText, setDisplayedText] = useState<string>("");

  useEffect(() => {
    let currentIndex = 0;
    const intervalId = setInterval(() => {
      currentIndex++;
      setDisplayedText(text.slice(0, currentIndex));

      // 텍스트 전체가 표시되면 인터벌 종료 후 딜레이 후 onComplete 호출
      if (currentIndex === text.length) {
        clearInterval(intervalId);
        setTimeout(() => onComplete?.(), 500);
      }
    }, speed);

    return () => clearInterval(intervalId);
  }, [text, speed, onComplete]);

  return <div className="h-[26px]">{displayedText}</div>;
};

/**
 * EndingComment 컴포넌트
 * 세 줄의 텍스트를 순차적으로 타이핑 효과로 표시합니다.
 * 요소가 화면에 보일 때부터 타이핑이 시작됩니다.
 */
const EndingComment: React.FC = () => {
  const today = new Date();
  const formattedDate =
    today.getFullYear() +
    "." +
    (today.getMonth() + 1).toString().padStart(2, "0") +
    "." +
    today.getDate().toString().padStart(2, "0");
  const texts: string[] = [formattedDate, "나를 기록하기", "끝."];
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer를 사용해 요소가 화면에 보이면 타이핑 시작
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
      { threshold: 0.3 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleComplete = () => {
    if (currentIndex < texts.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-start text-white ml-[17px]"
    >
      {hasStarted ? (
        texts.map((text, index) => (
          <div className="text-main-beige50 text-head1" key={index}>
            {index < currentIndex ? (
              // 이미 타이핑 완료된 텍스트
              <span>{text}</span>
            ) : index === currentIndex ? (
              // 현재 타이핑 중인 텍스트
              <Typewriter text={text} onComplete={handleComplete} speed={130} />
            ) : (
              <span className="h-[26px] text-dark">o</span>
            )}
          </div>
        ))
      ) : (
        // 요소가 화면에 나타나기 전의 자리 확보용 placeholder (선택 사항)
        <div style={{ height: "300px" }} />
      )}
    </div>
  );
};

export default EndingComment;
