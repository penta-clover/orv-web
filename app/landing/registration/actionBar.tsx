'use client';

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function ActionBar() {
  const router = useRouter();
  return (
    <div className="flex flex-row items-center justify-between h-[48px] px-[16px]">
        <Image src="/icons/logo.svg" width={42} height={20} alt={""} className="h-full" onClick={() => router.push("/")}/>
        <Image src="/icons/hamburger.svg" width={32} height={32} alt={""} className="h-full"/>
    </div>
  );
}
