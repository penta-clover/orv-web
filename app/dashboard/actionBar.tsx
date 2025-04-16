'use client';

import Link from "next/link";
import { useMobileSidebar } from "./mobileSidebarContext";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function ActionBar({ className }: { className?: string }) {
    const { setIsSidebarOpen } = useMobileSidebar()!;
  
    return (
      <div
        className={cn(
          "flex flex-row items-center justify-between h-[56px] w-full",
          className
        )}
      >
        <Link
          className="h-[56px] w-[74px] flex items-center justify-center"
          href="/dashboard/home"
        >
          <Image
            unoptimized
            src="/icons/logo.svg"
            width={42}
            height={20}
            alt={""}
          />
        </Link>
  
        <div className="flex items-center justify-center grow text-head4 text-grayscale-white" />
  
        <div
          className="flex items-center justify-center h-[56px] w-[65px]"
          onClick={() => {
            setIsSidebarOpen(true);
          }}
        >
          <Image
            unoptimized
            src="/icons/hamburger.svg"
            width={32}
            height={32}
            alt={""}
          />
        </div>
      </div>
    );
  }