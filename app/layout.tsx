import "./globals.css";
import Providers from "./providers";
import { Metadata } from "next";
import ClientSideComponents from "./clientSideComponent"; // 클라이언트 전용 작업을 모아둔 컴포넌트


export const metadata: Metadata = {
  title: "나를 마주하는 시간 오브",
  description: "나를 마주할 기회를 선물하는 곳",
  openGraph: {
    title: "오브 Orv",
    description: "나를 마주할 기회를 선물하는 곳",
    images: "https://d3bdjeyz3ry3pi.cloudfront.net/static/images/orv-og-thumbnail.jpeg",
    url: "https://www.orv.im",
  },
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
      </head>
      <body className="antialiased hide-scrollbar safe-area font-pretendard">
        {/* 클라이언트 전용 컴포넌트를 사용하여 채널 스크립트 로드, Analytics 등 부수 효과를 실행 */}
        <ClientSideComponents>
          <Providers>{children}</Providers>
        </ClientSideComponents>
      </body>
    </html>
  );
}
