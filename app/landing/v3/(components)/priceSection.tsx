import Image from "next/image";

export default function PriceSection() {
  return (
    <div className="flex flex-col items-center w-full">
      <div className="text-head1 text-grayscale-white flex flex-col items-center">
        <span>나를 마주할 기회를</span>
        <span>스스로에게 선물해보세요</span>
      </div>

      <div className="h-[24px]" />

      <Image unoptimized 
        src="https://d3bdjeyz3ry3pi.cloudfront.net/static/images/landing-one-time-ticket.png"
        width={315}
        height={238}
        alt="one-time-ticket"
      />
    </div>
  );
}
