import { useEffect, useState } from "react";

export default function WorrySection() {
  const [scrolling, setScrolling] = useState(false);

  useEffect(() => {
    let timer: any;
    const handleScroll = () => {
      setScrolling(true);
      // 스크롤이 멈춘 후 150ms 이후에 애니메이션 제거 (원하는 시간으로 조정 가능)
      clearTimeout(timer);
      timer = setTimeout(() => setScrolling(false), 150);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex flex-col items-center text-head1 text-grayscale-white">
        <span className="text-head1">한번쯤은 떠올리지만</span>
        <span className="text-head2">곧바로 잊혀지는 많은 질문과 고민들</span>
      </div>

      <div className="h-[36px]" />

      <div className="flex flex-col items-center text-body4 text-grayscale-200 w-full max-w-[384px] gap-[22px] px-[16px]">
        <div className="flex flex-row w-full">
          <span className={`bg-grayscale-700 rounded-[8px] p-[12px] transition-all ${scrolling ? "animate-shake-1 text-grayscale-800 bg-grayscale-400" : ""}`}>
            요즘 나를 가장 힘들게 하는 것은?
          </span>
          <span className="grow" />
        </div>
        <div className="flex flex-row w-full">
          <span className="grow" />
          <span className={`bg-grayscale-800 rounded-[8px] p-[12px] transition-all ${scrolling ? "animate-shake-0.7 text-grayscale-800 bg-grayscale-200" : ""}`}>
            최근 행복하다고 느꼈던 상황은 언제였나요?
          </span>
        </div>
        <div className="flex flex-row w-full">
          <span className={`bg-grayscale-700 rounded-[8px] p-[12px] transition-all ${scrolling ? "animate-shake-1.2 text-grayscale-800 bg-grayscale-400" : ""}`}>
            과거로 돌아갈 수 있다면 언제로 돌아가고 싶나요?
          </span>
          <span className="grow" />
        </div>
        <div className="flex flex-row w-full">
          <span className="grow" />
          <span className={`bg-grayscale-800 rounded-[8px] p-[12px] transition-all ${scrolling ? "animate-shake-0.9 text-grayscale-800 bg-grayscale-200" : ""}`}>
            내일 죽는다면 오늘은 무엇을 하고 싶은가요?
          </span>
        </div>
      </div>
    </div>
  );
}
