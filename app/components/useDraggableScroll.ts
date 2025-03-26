import { useEffect, useRef, useState } from "react";

export type UseDraggableScrollOptions<T extends HTMLElement = HTMLElement> = {
  onScrollEnd?: (scrollPos: number, element: T) => void;
  debounceTime?: number;
  // 스크롤 방향 옵션 (default: vertical)
  direction?: "vertical" | "horizontal";
};

export function useDraggableScroll<T extends HTMLElement = HTMLElement>(
  options?: UseDraggableScrollOptions<T>
) {
  const { onScrollEnd, debounceTime = 50, direction = "vertical" } = options || {};
  const elementRef = useRef<T>(null);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
  const startPos = useRef(0);
  const startScroll = useRef(0);
  const [isDragging, setIsDragging] = useState(false);

  const internalHandleScrollEnd = () => {
    if (!elementRef.current) return;
    const scrollPos =
      direction === "vertical"
        ? elementRef.current.scrollTop
        : elementRef.current.scrollLeft;
    if (onScrollEnd) {
      onScrollEnd(scrollPos, elementRef.current);
    }
  };

  const handleScroll = () => {
    console.log("hi");
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    scrollTimeout.current = setTimeout(() => {
      internalHandleScrollEnd();
    }, debounceTime);
  };

  const handlePointerDown = (event: PointerEvent) => {
    setIsDragging(true);
    if (direction === "vertical") {
      startPos.current = event.clientY;
      startScroll.current = elementRef.current?.scrollTop ?? 0;
    } else {
      startPos.current = event.clientX;
      startScroll.current = elementRef.current?.scrollLeft ?? 0;
    }
    elementRef.current?.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: PointerEvent) => {
    if (!isDragging || !elementRef.current) return;
    let delta = 0;
    if (direction === "vertical") {
      delta = event.clientY - startPos.current;
      elementRef.current.scrollTop = startScroll.current - delta;
    } else {
      delta = event.clientX - startPos.current;
      elementRef.current.scrollLeft = startScroll.current - delta;
    }
  };

  const handlePointerUp = (event: PointerEvent) => {
    setIsDragging(false);
    elementRef.current?.releasePointerCapture(event.pointerId);
    internalHandleScrollEnd();
  };

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    element.addEventListener("scroll", handleScroll);
    element.addEventListener("pointerdown", handlePointerDown);
    element.addEventListener("pointermove", handlePointerMove);
    element.addEventListener("pointerup", handlePointerUp);
    element.addEventListener("pointerleave", handlePointerUp);
    return () => {
      element.removeEventListener("scroll", handleScroll);
      element.removeEventListener("pointerdown", handlePointerDown);
      element.removeEventListener("pointermove", handlePointerMove);
      element.removeEventListener("pointerup", handlePointerUp);
      element.removeEventListener("pointerleave", handlePointerUp);
    };
  }, [isDragging, direction]);

  return { elementRef, isDragging };
}
