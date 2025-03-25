"use client";

import { Video } from "@/domain/model/Video";
import { useArchiveRepository } from "@/providers/ArchiveRepositoryContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { usePopup } from "./popup";
import SelectGuidePopup from "./popup/selectGuidePopup";

export default function StartButton() {
  const router = useRouter();
  const archiveRepository = useArchiveRepository();
  const [isNewbie, setIsNewbie] = useState<boolean>(false);
  const { showPopup, hidePopup } = usePopup();

  useEffect(() => {
    archiveRepository.getMyVideos().then((myVideos: Video[]) => {
      setIsNewbie(myVideos.length === 0);
    });
  }, [archiveRepository]);

  return (
    <div
      className="flex flex-row items-center justify-center w-[139px] h-[56px] bg-main-lilac50 rounded-[12px] transition-all ease-out hover:scale-105 active:scale-95"
      onClick={() => {
        if (isNewbie) {
          router.push("/dashboard/topic?guide-popup=first");
        } else {
          router.push("/dashboard/topic?guide-popup=default");
        }
      }}
    >
      <Image
        unoptimized
        src="/icons/camcoder-grayscale-800.svg"
        alt="camcoder icon"
        width={24}
        height={24}
      />

      <div className="w-[4px]" />

      <span className="text-head3 text-grayscale-800">시작하기</span>
    </div>
  );
}
