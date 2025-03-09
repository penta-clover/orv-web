export default function HeaderSection(props: {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  handleVideoEnd: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center h-[94px] gap-[6px]">
        <h2 className="text-head0 font-bold bg-gradient-to-r from-main-lilac50 to-main-beige50 text-transparent bg-clip-text">
          나를 마주하는 시간,
        </h2>
        <h1 className="font-bold text-grayscale-white text-[44px] leading-[44px]">
          오브
        </h1>
      </div>

      <div className="h-[37px]" />

      <video
        ref={props.videoRef}
        autoPlay
        muted
        playsInline
        preload="auto"
        onEnded={props.handleVideoEnd}
        className="w-full block z-10"
      >
        <source
          src="https://d3bdjeyz3ry3pi.cloudfront.net/static/videos/landing-v2-main.mp4"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>

      <div className="h-[27px]" />

      <div className="flex flex-col items-center justify-center gap-[2px]">
        <h2 className="text-head4 text-grayscale-white">
          내가 아니면 누구도 해주지 않을 질문을 던져주는 곳
        </h2>

        <h3 className="text-body2 text-grayscale-white">당신만을 위한 인터뷰 기록 장치, 오브입니다.</h3>
      </div>
    </div>
  );
}
