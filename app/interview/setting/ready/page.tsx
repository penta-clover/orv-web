"use client";
import "@/app/components/blackBody.css";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import ExitInterviewModal from "../../(components)/exitInterviewModal";
import { cn } from "@/lib/utils";
import { useStoryboardRepository } from "@/providers/StoryboardRepositoryContext";
import Typewriter from "./typeWriter";

export default function Page() {
  return (
    <Suspense>
      <Body />
    </Suspense>
  );
}

function Body() {
  const searchParams = useSearchParams();
  const storyboardId = searchParams.get("storyboardId")!;
  const aspect = searchParams.get("aspect")!;
  const filter = searchParams.get("filter");

  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string | null>(null);

  const storyboardRepository = useStoryboardRepository();

  useEffect(() => {
    storyboardRepository.getStoryboardInfo(storyboardId).then((storyboard) => {
      setTitle(storyboard.title);
      setTimeout(() => {
        router.replace(
          `/interview/recording?storyboardId=${storyboardId}&aspect=${aspect}&filter=${filter}`
        );
      }, 21000);
    });
  }, [storyboardId]);

  const typewriterText = `
  안녕하세요 나를 마주하는 시간, 오브입니다.\n \n
  오늘 인터뷰의 주제는 “${title}”입니다.
  오늘 함께 하는 시간동안 꼭 스스로를 알아가는 것이 아니더라도
  마음 편하고 즐거운 시간을 보내시면 좋겠습니다.\n \n
  영상에 비치는 나의 모습이 어색하더라도 이번을 시작으로 기록을 남겨보세요.
  나중에 점점 더 멋지게 변화하는 스스로를 발견할 수 있답니다.\n \n
  그럼 이제 인터뷰를 시작해볼게요. 인터뷰 시작!`;

  return (
    <ExitInterviewModal
      isOpen={isModalOpen}
      setIsOpen={setIsModalOpen}
      onExitInterview={() => router.replace("/")}
    >
      <div className="relative w-full h-[100%] flex flex-col items-center justify-start gap-[42px] mt-[70px]">
        <Image
          unoptimized
          src="/icons/x.svg"
          width={32}
          height={32}
          alt="close"
          onClick={() => setIsModalOpen(true)}
          className="fixed top-[10px] right-[10px] px-[16px] py-[12px] w-[64px] h-[56px] focus:outline-none cursor-pointer"
        />
        <div className="fixed top-0 h-full flex flex-col justify-center items-center">
          <div className="w-[95vw] lg:w-[952px] text-body0 text-main-lilac50 text-center ">
            {title === null ? null : (
              <Typewriter text={typewriterText} speed={80} />
            )}
          </div>
        </div>
      </div>
    </ExitInterviewModal>
  );
}

function FilterButton(props: {
  children: React.ReactNode;
  selected: boolean;
  onClick: () => void;
}) {
  const { children, selected, onClick } = props;

  return (
    <button
      className={cn(
        selected ? "bg-grayscale-50" : "bg-grayscale-800",
        "w-[146px] h-[44px] text-head4 rounded-[12px] flex justify-center items-center"
      )}
      style={{ color: selected ? "#28282F" : "#80808A" }}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
