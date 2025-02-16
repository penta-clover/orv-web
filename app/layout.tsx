import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Orv",
  description: "나를 바라보는 시간",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`antialiased overflow-hidden safe-area`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
