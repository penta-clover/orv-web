import Image from "next/image";

export default function ActionBar() {
  return (
    <div className="flex flex-row items-center justify-between h-[48px] px-[16px]">
      <div className="text-head2 text-grayscale-white h-[48px] flex flex-col justify-center">Title</div>
      <Image src="/icons/hamburger.svg" width={32} height={32} alt={""} />
    </div>
  );
}
