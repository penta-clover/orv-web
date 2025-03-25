import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

export type SpinnerProps = {
  items: number[];
  selected: number;
  onChange: (val: number) => void;
  className?: string;
};

export default function Spinner({
  items,
  selected,
  onChange,
  className,
}: SpinnerProps) {
  const listRef = useRef<HTMLUListElement>(null);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
  const startY = useRef(0);
  const startScrollTop = useRef(0);
  const [isDragging, setIsDragging] = useState(false);

  // 스크롤 위치를 기반으로 중앙에 가장 가까운 아이템 계산
  const calculateClosestItem = () => {
    if (!listRef.current) return;
    const ul = listRef.current;
    const centerPosition = ul.scrollTop + ul.clientHeight / 2;
    let closestIndex = 0;
    let minDistance = Number.MAX_VALUE;
    for (let i = 0; i < ul.children.length; i++) {
      const child = ul.children[i] as HTMLElement;
      const childCenter = child.offsetTop + child.offsetHeight / 2;
      const distance = Math.abs(childCenter - centerPosition);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = i;
      }
    }
    return items[closestIndex];
  };

  const handleScrollEnd = () => {
    const newSelected = calculateClosestItem();
    if (newSelected !== undefined && newSelected !== selected) {
      onChange(newSelected);
    }
  };

  // 스크롤 이벤트 debounce
  const handleScroll = () => {
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    scrollTimeout.current = setTimeout(() => {
      handleScrollEnd();
    }, 50);
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLUListElement>) => {
    setIsDragging(true);
    startY.current = event.clientY;
    startScrollTop.current = listRef.current?.scrollTop ?? 0;
    listRef.current?.setPointerCapture(event.pointerId);
  };

  // 드래그 중: 스크롤 위치 업데이트 및 실시간 선택 값 변경
  const handlePointerMove = (event: React.PointerEvent<HTMLUListElement>) => {
    if (!isDragging || !listRef.current) return;
    const delta = event.clientY - startY.current;
    listRef.current.scrollTop = startScrollTop.current - delta;

    const newSelected = calculateClosestItem();
    if (newSelected !== undefined && newSelected !== selected) {
      onChange(newSelected);
    }
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLUListElement>) => {
    setIsDragging(false);
    listRef.current?.releasePointerCapture(event.pointerId);
    handleScrollEnd();
  };

  useEffect(() => {
    const ul = listRef.current;
    if (!ul) return;
    ul.addEventListener("scroll", handleScroll);
    return () => {
      ul.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <ul
        ref={listRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className={cn(
          "h-[172px] w-[48px] overflow-y-scroll hide-scrollbar relative gap-y-[8px] py-[60px]",
          // 드래그 중에는 스냅 기능 비활성화
          !isDragging && "snap-y snap-mandatory"
        )}
      >
        {items.map((item) => {
          const isSelected = item === selected;
          return (
            <li
              key={item}
              className={`
                h-[52px] flex items-center justify-center 
                snap-center 
                cursor-pointer
                text-head3
                ${isSelected ? "text-grayscale-300" : "text-grayscale-600"}
              `}
            >
              {String(item).padStart(2, "0")}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
