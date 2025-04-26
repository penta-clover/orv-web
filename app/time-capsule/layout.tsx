import { Metadata, ResolvingMetadata } from "next";

export const metadata: Metadata = {
  openGraph: {
    title: "60초 타임캡슐 프로젝트에 초대됐어요",
    description: "1년 뒤 나에게 60초의 추억을 선물하세요",
    images: [
      "https://d3bdjeyz3ry3pi.cloudfront.net/static/images/time-capsule-thumbnail.jpg",
    ],
  },
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-row w-full">
      <div className="flex grow bg-[#050505] z-50" />
      <div className="relative w-[100dvw] max-w-[650px] h-[calc(100dvh)] overflow-x-hidden">
        {children}
      </div>
      <div className="flex grow bg-[#050505] z-50" />
    </div>
  );
}
