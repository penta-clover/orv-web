import { cn } from "@/lib/utils";
import Image from "next/image";
import { useEffect } from "react";

export default function PrevButton(props: {
  onClick: () => void;
  useKeyboardShortcut: boolean;
  className?: string;
  children?: React.ReactNode;
}) {
  const { onClick, useKeyboardShortcut, className = "" } = props;
  const keyDownListener = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      onClick();
    }
  };

  useEffect(() => {
    if (useKeyboardShortcut) {
      window.addEventListener("keydown", keyDownListener);
    } else {
      window.removeEventListener("keydown", keyDownListener);
    }
    return () => {
      window.removeEventListener("keydown", keyDownListener);
    };
  }, [useKeyboardShortcut, onClick]);

  return (
    <button
      className={cn(
        className,
        "px-[24px] py-[11px] bg-main-lilac50 text-head3 rounded-[10px] transition-all active:scale-95 flex flex-row items-center gap-[5px]"
      )}
      onClick={onClick}
    >
      {props.children || (
        <>
          <Image
            unoptimized
            src="/icons/left-arrow-black.svg"
            alt="left arrow"
            width={24}
            height={24}
          />
          이전으로
        </>
      )}
    </button>
  );
}
