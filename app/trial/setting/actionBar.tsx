import Image from "next/image";

export default function ActionBar(props: {
  onClickGuide: () => void;
  onClickExplore: () => void;
}) {
  return (
    <div className="flex flex-row items-center justify-between h-[56px] px-[16px]">
      <Image
        src="/icons/logo.svg"
        width={42}
        height={20}
        alt={""}
      />
      <div className="flex flex-row items-center h-full">
      </div>
    </div>
  );
}
