import type { Metadata } from "next";
import "./globals.css";
import { FirebaseProvider, useFirebase } from "@/providers/FirebaseContext";
import { EarlybirdRepositoryProvider } from "@/providers/EarlybirdRepositoryContext";

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
        <FirebaseProvider>
          <EarlybirdRepositoryProvider firebaseApp={useFirebase()}>
            {children}
          </EarlybirdRepositoryProvider>
        </FirebaseProvider>
      </body>
    </html>
  );
}
