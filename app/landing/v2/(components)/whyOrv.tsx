import Image from "next/image";

export default function WhyOrv() {
  return (
    <div className="flex flex-col items-center w-full">
      <span className="text-head1 text-grayscale-white">
        왜 오브여야만 할까요?
      </span>

      <div className="h-[16px]" />

      <Image
        src={"/images/counseling.png"}
        width={330.53}
        height={159}
        alt="counseling"
      />

      <div className="w-[1px] h-[18px] bg-grayscale-800" />

      <div className="flex flex-col justify-center items-center h-[68px] w-[331px] text-body4 text-grayscale-200 bg-grayscale-800 rounded-[8px]">
        <span>오랜 검증을 거쳐 추려낸 20가지 주제의 질문은,</span>
        <span>당신의 내면에 꼭 필요한 이야기만 담았습니다.</span>
      </div>

      <div className="w-[1px] h-[18px] bg-grayscale-800" />

      <div className="flex flex-col justify-center items-center h-[68px] w-[331px] text-body4 text-grayscale-200 bg-grayscale-800 rounded-[8px]">
        <span>이를 통해 행동과 생각을 기록함으로써</span>
        <span>매 순간 새롭게 성장할 기회를 제공합니다.</span>
      </div>

      <div className="h-[48px]" />

      <Image
        src={"/images/design-thinking.png"}
        width={330.53}
        height={159}
        alt="design-thinking"
      />

      <div className="w-[1px] h-[18px] bg-grayscale-800" />

      <div className="flex flex-col justify-center items-center h-[90px] w-[331px] text-body4 text-grayscale-200 bg-grayscale-800 rounded-[8px]">
        <span>사람들이 어떤 질문에 공감하는지 관찰했고,</span>
        <span>매월 수천 명이 즐겨 찾는</span>
        <span>질문카드 서비스를 탄생시켰습니다.</span>
      </div>

      <div className="w-[1px] h-[18px] bg-grayscale-800" />

      <div className="flex flex-col justify-center items-center h-[68px] w-[331px] text-body4 text-grayscale-200 bg-grayscale-800 rounded-[8px]">
        <span>그리고 이제는 그 경험과 노하우를</span>
        <span>오브에 고스란히 녹여냈습니다.</span>
      </div>
    </div>
  );
}
