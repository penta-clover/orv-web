"use client";

import { MyInfo } from "@/domain/model/MyInfo";
import { MemberRepository } from "@/domain/repository/MemberRepository";
import { useMemberRepository } from "@/providers/MemberRepositoryContext";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import ChannelTalkButton from "../components/channelTalkButtonV2";
import { useStorage } from "@/providers/StorageContext";

export default function Sidebar() {
  const memberRepository: MemberRepository = useMemberRepository();
  const storage = useStorage();
  const [myInfo, setMyInfo] = useState<MyInfo | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (href: string) => pathname.endsWith(`/${href}`);

  useEffect(() => {
    memberRepository.getMyInfo().then((myInfo: MyInfo) => {
      setMyInfo(myInfo);
    });
  }, []);

  return (
    <div className="flex flex-col h-[100dvh] w-[240px] bg-grayscale-900 text-grayscale-white">
      <div className="h-[24px]" />

      <div className="h-[64px] pl-[24px] flex items-center">
        <Image src="/icons/logo.svg" width={42} height={20} alt="logo" />
      </div>

      <div className="h-[11px]" />

      <div className="h-[40px] pl-[16px] flex flex-row items-center justify-start gap-[11px]">
        <Image
          src="/icons/default-profile-image.svg"
          width={40}
          height={40}
          alt="profile"
        />

        <span className="text-body1 break-keep">{`${
          myInfo?.nickname ?? ""
        }님의 스튜디오`}</span>
      </div>

      <div className="h-[40px]" />

      <div className="flex flex-col gap-[8px] justify-center">
        <Link
          className={`h-[46px] mx-[16px] px-[18px] py-[10px] rounded-[16px] flex flex-row items-center gap-[14px] transition-all hover:bg-grayscale-800 active:scale-95 ${
            isActive("home") ? "bg-grayscale-700" : ""
          }`}
          href={"home"}
        >
          <Image
            src={
              isActive("home")
                ? "/icons/home.svg"
                : "/icons/home-grayscale-300.svg"
            }
            alt="home"
            width={24}
            height={24}
          />
          <span
            className={`text-head4 ${
              isActive("home") ? "text-grayscale-white" : "text-grayscale-300"
            }`}
          >
            홈
          </span>
        </Link>
        <Link
          className={`h-[46px] mx-[16px] px-[18px] py-[10px] rounded-[16px] flex flex-row items-center gap-[14px] transition-all hover:bg-grayscale-800 active:scale-95 ${
            isActive("archive") ? "bg-grayscale-700" : ""
          }`}
          href={"archive"}
        >
          <Image
            src={
              isActive("archive")
                ? "/icons/folder.svg"
                : "/icons/folder-grayscale-300.svg"
            }
            alt="folder"
            width={24}
            height={24}
          />
          <span
            className={`text-head4 ${
              isActive("archive")
                ? "text-grayscale-white"
                : "text-grayscale-300"
            }`}
          >
            인터뷰 기록
          </span>
        </Link>
        <Link
          className={`h-[46px] mx-[16px] px-[18px] py-[10px] rounded-[16px] flex flex-row items-center gap-[14px] transition-all hover:bg-grayscale-800 active:scale-95 ${
            isActive("topic") ? "bg-grayscale-700" : ""
          }`}
          href={"topic"}
        >
          <Image
            src={
              isActive("topic")
                ? "/icons/hashtag.svg"
                : "/icons/hashtag-grayscale-300.svg"
            }
            alt="topic"
            width={24}
            height={24}
          />
          <span
            className={`text-head4 ${
              isActive("topic") ? "text-grayscale-white" : "text-grayscale-300"
            }`}
          >
            인터뷰 주제
          </span>
        </Link>
        <Link
          className={`h-[46px] mx-[16px] px-[18px] py-[10px] rounded-[16px] flex flex-row items-center gap-[14px] transition-all hover:bg-grayscale-800 active:scale-95 ${
            isActive("guide") ? "bg-grayscale-700" : ""
          }`}
          href={"guide"}
        >
          <Image
            src={
              isActive("guide")
                ? "/icons/guidebook.svg"
                : "/icons/guidebook-grayscale-300.svg"
            }
            alt="guide book"
            width={24}
            height={24}
          />
          <span
            className={`text-head4 ${
              isActive("guide") ? "text-grayscale-white" : "text-grayscale-300"
            }`}
          >
            사용 가이드
          </span>
        </Link>
        <Link
          className={`h-[46px] mx-[16px] px-[18px] py-[10px] rounded-[16px] flex flex-row items-center gap-[14px] transition-all hover:bg-grayscale-800 active:scale-95 ${
            isActive("faq") ? "bg-grayscale-700" : ""
          }`}
          href={"faq"}
        >
          <Image
            src={
              isActive("faq")
                ? "/icons/bookmark.svg"
                : "/icons/bookmark-grayscale-300.svg"
            }
            alt="bookmark"
            width={24}
            height={24}
          />
          <span
            className={`text-head4 ${
              isActive("faq") ? "text-grayscale-white" : "text-grayscale-300"
            }`}
          >
            자주 묻는 질문
          </span>
        </Link>
      </div>

      <div className="absolute bottom-[28px] flex flex-col gap-[8px] justify-center">
        <ChannelTalkButton className="h-[46px] w-[208px] mx-[16px] px-[18px] py-[10px] rounded-[16px] flex flex-row items-center gap-[14px] no-underline transition-all hover:bg-grayscale-800 active:scale-95">
          <Image
            src="/icons/questionmark-grayscale-300.svg"
            alt="guide book"
            width={24}
            height={24}
          />
          <span className={"text-head4 text-grayscale-300"}>1:1 문의</span>
        </ChannelTalkButton>
        <div
          className="h-[46px] w-[208px] mx-[16px] px-[18px] py-[10px] rounded-[16px] flex flex-row items-center gap-[14px] transition-all hover:bg-grayscale-800 active:scale-95"
          onClick={() => {
            storage.clearAuthToken();
            router.push("/");
          }}
        >
          <Image
            src="/icons/logout-grayscale-300.svg"
            alt="bookmark"
            width={24}
            height={24}
          />
          <span className="text-head4 text-grayscale-300">로그아웃</span>
        </div>
      </div>
    </div>
  );
}
