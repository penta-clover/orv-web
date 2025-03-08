// components/Sidebar.js
"use client";
import ChannelTalkButton from "@/app/components/channelTalkButton";
import { useSidebar } from "./sidebarContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { track } from "@/app/amplitude";

export default function Sidebar() {
  const router = useRouter();
  const { isSidebarOpen, setIsSidebarOpen } = useSidebar()!;

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
      ${isSidebarOpen ? "translate-x-0 w-450:right-[calc((100vw-450px)/2)]" : "translate-x-full"}`}
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
                track("click_ticket_pricing");
                router.push("/landing/v2/pricing");
                setIsSidebarOpen(false);
              }}
            >
              오브 티켓 구매하기
            </li>
            <li
              className="h-[48px] text-head4 text-grayscale-300 py-[11px] px-[16px]"
              onClick={() => {
                track("click_guide_landing");
                router.push("/landing/v2/guide");
                setIsSidebarOpen(false);
              }}
            >
              사용 가이드
            </li>
            <li
              className="h-[48px] text-head4 text-grayscale-300 py-[11px] px-[16px]"
              onClick={() => {
                track("click_preview_topic");
                router.push("/landing/v2/topic");
                setIsSidebarOpen(false);
              }}
            >
              주제 미리보기
            </li>
            <li
              className="h-[48px] text-head4 text-grayscale-300 py-[11px] px-[16px]"
              onClick={() => {
                track("click_brand_story");
                router.push("/landing/v2/story");
                setIsSidebarOpen(false);
              }}
            >
              브랜드 스토리
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
