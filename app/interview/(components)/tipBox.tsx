import Image from "next/image";
import { cn } from "@/lib/utils";
import { useState } from "react";
export default function TipBox(props: {
  tag: string;
  text: string;
  tagColor: string;
  dismissOnClick?: boolean;
}) {
  const { tag, text, tagColor, dismissOnClick = false } = props;
  const [isDismissed, setIsDismissed] = useState(false);

  return (
    <div
      className={cn(
        "flex flex-col items-end animate-updown",
        isDismissed && "hidden",
        dismissOnClick && "cursor-pointer"
      )}
      onClick={() => {
        if (dismissOnClick) {
          setIsDismissed(true);
        }
      }}
    >
      <div className="px-[15px] py-[11px] text-body3 bg-grayscale-700 rounded-[10px] flex justify-center items-start gap-[10px]">
        <div
          className={cn(
            "px-[8px] py-[1px] bg-grayscale-600 rounded-[4px]",
            tagColor
          )}
        >
          {tag}
        </div>
        <div className="text-grayscale-50 whitespace-pre-wrap">
          {text.replaceAll("\\n", "\n")}
        </div>
      </div>
      <Image
        unoptimized
        src="/icons/tooltip-triangle.svg"
        alt="tooltip-triangle"
        width={12}
        height={20}
        className="mr-[20px] -mt-[4px]"
      />
    </div>
  );
}
