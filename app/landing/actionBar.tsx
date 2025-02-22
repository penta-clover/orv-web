import Image from "next/image";

export default function ActionBar(props: {
  onClickGuide: () => void;
  onClickExplore: () => void;
}) {
  return (
    <div className="flex flex-row items-center justify-between h-[48px] px-[16px]">
      <Image src="/icons/logo.svg" width={42} height={20} alt={""} />
      <div className="flex flex-row items-center h-full">
        <div className="text-body3 text-[#F1F1F4] px-[12px] h-full flex items-center" onClick={() => props.onClickGuide()}>사용 가이드</div>
        <div className="w-[1.5px] h-[12px]">
          <Image
            src="/icons/vertical-separator.svg"
            width={1.5}
            height={12}
            alt="separator"
          />
        </div>
        <div className="text-body3 text-[#F1F1F4] pl-[12px] h-full flex items-center" onClick={() => props.onClickExplore()}>둘러보기</div>
      </div>
    </div>
  );
}
