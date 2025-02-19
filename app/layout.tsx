import type { Metadata } from "next";
import "./globals.css";

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
      <body className={`antialiased hide-scrollbar safe-area`}>
        {children}
      </body>
    </html>
  );
}
