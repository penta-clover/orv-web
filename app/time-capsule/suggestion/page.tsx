"use client";

import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import "@/app/components/blackBody.css";
import TopicList from "@/app/components/topicList";
import Popup from "@/app/dashboard/popup";

export default function Page() {
  const router = useRouter();

  return (
    <Popup>
      <div className="flex flex-col relative bg-dark w-full h-[calc(100dvh)]">
        <div className="h-[20dvh] shrink" />

        <div className="text-head1 text-grayscale-white mx-[16px]">
          나를 기록하기 위한
          <br />
          다른 주제들도 준비되어 있어요
        </div>

        <div className="text-grayscale-300 text-body4 mx-[16px]">
          오늘 진행한 타임캡슐과 같은 기록을 더 다양한 주제로 참여할 수 있어요
        </div>

        <TopicList
          title=""
          categoryCode={["DEFAULT"]}
          titleClassName="ml-[20px] xs:ml-[40px]"
          listClassName="px-[20px] xs:px-[40px]"
        />

        <div className="grow" />

        <div className="absolute w-full bottom-[26px] z-10">
          <CTA
            text="오브에서 더 알아보기"
            onClick={() => {
              router.push("/dashboard/home");
            }}
            className="w-full h-[56px] mx-[16px] text-head3"
          />
        </div>
      </div>
    </Popup>
  );
}

function CTA(props: { text: string; onClick: () => void; className?: string }) {
  return (
    <div className="w-full flex justify-center">
      <button
        style={{ boxShadow: "0px 0px 12px rgba(197, 209, 255, 0.6)" }}
        className={cn(
          "bg-gd px-[13px] py-[9px] text-grayscale-800 text-head4 rounded-[10px] transition-all active:scale-95",
          props.className
        )}
        onClick={props.onClick}
      >
        {props.text}
      </button>
    </div>
  );
}
