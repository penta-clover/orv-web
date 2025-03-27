import { useEffect, useState } from "react";

// 타이핑 효과 컴포넌트
export default function Typewriter({
  text,
  speed = 50,
  onWritingEnd,
}: {
  text: string;
  speed?: number;
  onWritingEnd?: () => void;
}) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.substring(0, index + 1));
      index++;
      if (index === text.length) {
        clearInterval(interval);
        onWritingEnd?.();
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  // 개행 문자(\n)를 기준으로 줄바꿈 처리
  return (
    <div className="whitespace-pre-wrap">
      {displayedText.split("\n").map((line, idx) => (
        <p key={idx}>{line}</p>
      ))}
    </div>
  );
}
