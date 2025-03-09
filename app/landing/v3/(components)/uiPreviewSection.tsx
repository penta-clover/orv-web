export default function UiPreviewSection() {
  return (
    <div className="flex flex-col items-center w-full">
      <div className="text-head1 text-grayscale-white flex flex-col items-center">
        <span>당신만을 위한 인터뷰에서</span>
        <span>주어지는 질문에 답변해보세요</span>
      </div>

      <div className="h-[24px]" />

      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="w-full block z-10"
      >
        <source src="https://d3bdjeyz3ry3pi.cloudfront.net/static/videos/landing-v2-sub.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="h-[18px]" />

      <div className="text-body4 text-grayscale-500">
        나만의 공간에서 노트북을 펴고 화면의 질문에 대답해요
      </div>
    </div>
  );
}
