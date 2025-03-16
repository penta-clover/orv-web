import Image from "next/image";
import { useEffect } from "react";

export default function PrevButton(props: {
  onClick: () => void;
  useKeyboardShortcut: boolean;
}) {
  const { onClick, useKeyboardShortcut } = props;
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
  }, [useKeyboardShortcut]);

  return (
    <button
      className="px-[20px] py-[11px] bg-main-lilac50 text-head4 rounded-[10px] transition-all active:scale-95 flex flex-row items-center gap-[10px]"
      onClick={onClick}
    >
      <Image
        unoptimized
        src="/icons/left-arrow-black.svg"
        alt="left-arrow"
        width={8}
        height={13}
      />
      이전으로
    </button>
  );
}
