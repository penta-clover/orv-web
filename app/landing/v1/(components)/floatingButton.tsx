import Image from "next/image";
import { useRouter } from "next/navigation";

export default function FloatingButton(props: {
  onClick: () => void;
}) {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center w-full px-[15px]">
      <Image unoptimized 
        src={"/icons/down-arrow.svg"}
        width={14}
        height={26.09}
        alt="down arrow"
        className="w-auto h-auto"
      />
      <div
        className="flex flex-row justify-center items-center w-full bg-gd rounded-[12px] h-[48px] text-head4 text-[#1B2729] mt-[14px] active:scale-95 transition-all"
        onClick={() => props.onClick()}
      >
        오브 얼리버드 신청하기
      </div>
    </div>
  );
}
