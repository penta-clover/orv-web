import { cn } from "@/lib/utils";
import Image from "next/image";
import { useEffect } from "react";

export default function NextButton(props: {
  onClick: () => void;
  useKeyboardShortcut: boolean;
  className?: string;
}) {
  const { onClick, useKeyboardShortcut, className = "" } = props;
  const keyDownListener = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") {
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
        "px-[20px] py-[11px] bg-main-lilac50 text-head4 rounded-[10px] transition-all active:scale-95 flex flex-row items-center gap-[10px]"
      )}
      onClick={onClick}
    >
      다음으로
      <Image
        unoptimized
        src="/icons/right-arrow-black.svg"
        alt="right-arrow"
        width={8}
        height={13}
      />
    </button>
  );
}
