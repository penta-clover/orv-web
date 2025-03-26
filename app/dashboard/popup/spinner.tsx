import { useDraggableScroll } from "@/app/components/useDraggableScroll";
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
  // useDraggableScroll 훅 사용. 스크롤 종료 시 중앙 아이템 계산 로직 추가.
  const { elementRef, isDragging } = useDraggableScroll<HTMLUListElement>({
    onScrollEnd: (scrollTop, element) => {
      const centerPosition = scrollTop + element.clientHeight / 2;
      let closestIndex = 0;
      let minDistance = Number.MAX_VALUE;
      for (let i = 0; i < element.children.length; i++) {
        const child = element.children[i] as HTMLElement;
        const childCenter = child.offsetTop + child.offsetHeight / 2;
        const distance = Math.abs(childCenter - centerPosition);
        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = i;
        }
      }
      const newSelected = items[closestIndex];
      if (newSelected !== undefined && newSelected !== selected) {
        onChange(newSelected);
      }
    },
  });

  // 스피너 초기화 시 selected 값에 따라 스크롤 위치 조정
  useEffect(() => {
    const index = items.indexOf(selected);
    if (index !== -1) {
      elementRef.current?.scrollTo({
        top: index * 52,
        behavior: "smooth",
      });
    }
  }, []);

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <ul
        ref={elementRef}
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
