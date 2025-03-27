import { cn } from "@/lib/utils";
import Image from "next/image";
import { useEffect } from "react";

export default function NextButton(props: {
  onClick: () => void;
  useKeyboardShortcut: boolean;
  className?: string;
  children?: React.ReactNode;
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
        "pl-[24px] pr-[19px] py-[11px] bg-main-lilac50 text-head3 rounded-[10px] transition-all active:scale-95 flex flex-row items-center gap-[5px]",
        className
      )}
      onClick={onClick}
    >
      {props.children || (
        <>
          다음으로
          <Image
            unoptimized
            src="/icons/right-arrow-black.svg"
            alt="right-arrow"
            width={24}
            height={24}
          />
        </>
      )}
    </button>
  );
}
