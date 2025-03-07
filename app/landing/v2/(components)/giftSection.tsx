import Image from "next/image";

export default function GiftSection() {
  return (
    <div className="flex flex-col items-center w-full">
      <div className="text-head1 text-grayscale-white mb-[24px] text-center">
        색다르고 의미있는 선물
        <br />
        인터뷰 티켓 선물하기
      </div>

      <Image
        src="/images/gift-open.jpg"
        alt="gift-open"
        width={278}
        height={95}
        className="rounded-[8px]"
      />
    </div>
  );
}
