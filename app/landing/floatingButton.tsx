import Image from "next/image";
import { useRouter } from "next/navigation";

export default function FloatingButton() {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center w-full px-[15px]">
      <Image
        src={"/icons/down-arrow.svg"}
        width={14}
        height={26.09}
        alt="down arrow"
      />
      <div
        className="flex flex-row justify-center items-center w-full bg-gd rounded-[12px] h-[48px] text-head4 text-[#1B2729] mt-[14px] active:scale-95 transition-all"
        onClick={() => router.push("/landing/registration/step1")}
      >
        오브 시작하기
      </div>
    </div>
  );
}
