import { cn } from "@/lib/utils";
import Image from "next/image";

export default function OptionButton({
  children,
  imgSrc,
  onClick,
  className,
}: {
  children: React.ReactNode;
  imgSrc: string;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "w-[180px] h-[180px] border-[1px] border-grayscale-white rounded-[12px] active:scale-95 text-head4 flex flex-col items-center justify-center transition-all",
        className
      )}
      onClick={onClick}
    >
      <div className="flex justify-center items-center w-full grow">
        <Image
          src={imgSrc}
          alt="gift"
          height={110}
          width={110}
          style={{ objectFit: "contain" }}
        />
      </div>
      {children}
    </div>
  );
}
