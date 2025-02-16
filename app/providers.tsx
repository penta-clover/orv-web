"use client";

import { AuthTokenProvider } from "@/contexts/AuthTokenContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return <AuthTokenProvider>{children}</AuthTokenProvider>;
}
