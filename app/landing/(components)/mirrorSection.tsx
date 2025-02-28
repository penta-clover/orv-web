import Image from "next/image";

export default function MirrorSection() {
  return (
    <div className="flex flex-col items-center h-[543px]">
      <Image
        src="/icons/logo-mirror.svg"
        width={54}
        height={16.62}
        alt="logo"
        className="mb-[12px]"
      />
      <div className="text-head1 text-white mb-[16px]">
        나만을 위한 인터뷰 시간
      </div>
      <div className="text-body2 text-grayscale-500">
        내가 아니면 누구도 해주지 않을 질문을 던져주는 곳
      </div>
      <div className="text-body2 text-grayscale-500">
        당신만을 위한 인터뷰를 기록하는
      </div>
      <div className="text-body2 text-main-lilac50 mb-[56px]">
        프라이빗 공간 오브입니다
      </div>

      <div className="relative h-[223px] w-full flex justify-center overflow-x-hidden">
        <Image
          src="/icons/mirror-frame.svg"
          width={483.2}
          height={168.81}
          alt="mirror frame"
          className="absolute top-[38px]"
          style={{ maxWidth: "none" }}
        />
        <Image
          src="/images/interviewee-mirror.png"
          width={209}
          height={223}
          alt="profile mirror"
          className="z-10"
        />
      </div>

      <div className="text-body2 text-white mt-[48px]">
        나만의 편안한 공간에서 <span className="text-main-lilac50">노트북</span>
        을 펴고
      </div>
      <div className="text-body2 text-white">
        <span className="text-main-lilac50">화면</span>에 보여지는 인터뷰 질문에
        답해보세요.
      </div>
    </div>
  );
}
