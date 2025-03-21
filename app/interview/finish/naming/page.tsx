"use client";

import "@/app/components/blackBody.css";
import { MyInfo } from "@/domain/model/MyInfo";
import { useArchiveRepository } from "@/providers/ArchiveRepositoryContext";
import { useMemberRepository } from "@/providers/MemberRepositoryContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const searchParams = useSearchParams();
  const videoId = searchParams.get("videoId");
  const [name, setName] = useState<string>("");
  const [nickname, setNickname] = useState<string>("");
  const [isButtonActive, setIsButtonActive] = useState<boolean>(false);
  const router = useRouter();

  const archiveRepository = useArchiveRepository();
  const memberRepository = useMemberRepository();

  useEffect(() => {
    setIsButtonActive(name.trim() !== "" && name.length < 255);
  }, [name]);

  useEffect(() => {
    memberRepository
      .getMyInfo()
      .then((myInfo: MyInfo) => setNickname(myInfo.nickname));
  });

  const updateName = async (name: string) => {
    if (!videoId) {
      console.error("video id not found in search params");
      return;
    }

    await archiveRepository.renameVideo(videoId, name);
    return;
  };

  return (
    <div className="flex flex-col h-[100dvh]">
      <div className="flex flex-col grow items-center justify-center pb-[182px]">
        <div className="text-white font-semibold text-[40px] leading-[44px]">
          오늘 {nickname}님의 인터뷰 제목을 정해주세요
        </div>

        <div className="h-[44px]" />

        <div className="text-grayscale-500 text-center font-medium text-[24px] leading-[36px]">
          오늘 진행한 인터뷰를 잘 표현할 수 있는 제목이나 가장 기억에 남는
          키워드,
          <br />
          인터뷰에서 느꼈던 감정 등을 담아보세요. 나중에 수정할 수 있으니 부담
          갖지 말고 편하게 지어주세요!
        </div>

        <div className="h-[64px]" />

        <div className="h-[56px] flex gap-[12px] items-center">
          <input
            placeholder="인터뷰 제목을 입력해주세요"
            onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
              setName(e.target.value);
            }}
            className="w-[444px] h-[56px] bg-grayscale-700 rounded-[8px] text-body1 text-white placeholder-grayscale-500 px-[16px] py-[13px] border border-transparent focus:border-grayscale-200 focus:outline-none focus:ring-0"
          />
          <button
            className={`w-[80px] h-[56px] rounded-[12px] text-head3 active:scale-95 ${
              isButtonActive
                ? "bg-main-lilac50 text-grayscale-800"
                : "bg-grayscale-800 text-grayscale-500"
            }`}
            disabled={!isButtonActive}
            onClick={() => {
              updateName(name).then(() => {
                router.push(`/interview/finish/thumbnail?videoId=${videoId}`);
              });
            }}
          >
            완료
          </button>
        </div>
      </div>
    </div>
  );
}
