import Image from "next/image";

export default function ActionBar(props: { onClickMenu: () => void }) {
  return (
    <div className="flex flex-row items-center justify-between h-[56px] w-full">
      <div className="h-[56px] w-[74px] flex items-center justify-center">
        <Image unoptimized  src="/icons/logo.svg" width={42} height={20} alt={""} />
      </div>

      <div className="flex items-center justify-center grow text-head4 text-grayscale-white" />

      <div
        className="h-[56px] w-[64px] flex items-center justify-center"
        onClick={props.onClickMenu}
      >
        <Image unoptimized 
          src="/icons/hamburger.svg"
          width={32}
          height={32}
          alt="left arrow"
        />
      </div>
    </div>
  );
}
