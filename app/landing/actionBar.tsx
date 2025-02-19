import Image from "next/image";

export default function ActionBar() {
  return (
    <div className="flex flex-row items-center justify-between h-[48px] px-[16px]">
        <Image src="/icons/logo.svg" width={42} height={20} alt={""} />
        <Image src="/icons/hamburger.svg" width={32} height={32} alt={""} />
    </div>
  );
}
