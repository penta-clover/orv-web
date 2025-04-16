// components/Sidebar.js
"use client";
import ChannelTalkButton from "@/app/components/channelTalkButton";
import { useMobileSidebar } from "./mobileSidebarContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { track } from "@/app/amplitude";

export default function MobileSidebar() {
  const router = useRouter();
  const { isSidebarOpen, setIsSidebarOpen } = useMobileSidebar()!;

  return (
    <>
      <div
        className={`absolute top-0 left-0 bg-grayscale-black opacity-70 w-full h-full z-40 ${
          isSidebarOpen ? "" : "hidden"
        }`}
        onClick={() => setIsSidebarOpen(false)}
      />
      <div
        className={`fixed top-0 right-0 h-[100vh] w-[287px] z-40 bg-grayscale-900 transition-transform duration-300 
      ${isSidebarOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex flex-row justify-between items-center">
          <Image unoptimized 
            src="/icons/logo.svg"
            width={42}
            height={20}
            alt="logo"
            className="px-[16px] py-[18px] w-[74px] h-[56px]"
          />
          <Image unoptimized 
            src="/icons/x.svg"
            width={32}
            height={32}
            alt="close"
            onClick={() => setIsSidebarOpen(false)}
            className="absolute top-0 right-0 px-[16px] py-[12px] w-[64px] h-[56px] focus:outline-none"
          />
        </div>

        <div className="h-[9px]" />

        <nav>
          <ul>
            <li
              className="h-[48px] text-head4 text-grayscale-300 py-[11px] px-[16px]"
              onClick={() => {
                router.push("/dashboard/home");
                setIsSidebarOpen(false);
              }}
            >
              홈
            </li>
            <li
              className="h-[48px] text-head4 text-grayscale-300 py-[11px] px-[16px]"
              onClick={() => {
                router.push("/dashboard/archive");
                setIsSidebarOpen(false);
              }}
            >
              인터뷰 기록
            </li>
            <li
              className="h-[48px] text-head4 text-grayscale-300 py-[11px] px-[16px]"
              onClick={() => {
                router.push("/dashboard/topic");
                setIsSidebarOpen(false);
              }}
            >
              인터뷰 주제
            </li>
            <li
              className="h-[48px] text-head4 text-grayscale-300 py-[11px] px-[16px]"
              onClick={() => {
                router.push("/dashboard/guide");
                setIsSidebarOpen(false);
              }}
            >
              사용 가이드
            </li>
            <li
              className="h-[48px] text-head4 text-grayscale-300 py-[11px] px-[16px]"
              onClick={() => {
                router.push("/dashboard/faq");
                setIsSidebarOpen(false);
              }}
            >
              자주 묻는 질문
            </li>
            <li className="h-[48px] text-head4 text-grayscale-300 py-[11px] px-[16px]">
              <ChannelTalkButton
                text="1:1 문의"
                className="text-grayscale-300 no-underline"
              />
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}
