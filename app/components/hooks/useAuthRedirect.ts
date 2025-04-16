"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { AuthRepository } from "@/domain/repository/AuthRepository";

interface UseAuthRedirectProps {
  authRepository: AuthRepository;
}

// 리다이렉트 URL의 유효성을 검증하는 함수 (화이트리스트 추가 가능)
const validateRedirectUrl = (url: string): boolean => {
  const allowedDomains = ["orv.im", "localhost"];
  try {
    const parsedUrl = new URL(url, window.location.origin);
    return allowedDomains.includes(parsedUrl.hostname);
  } catch (e) {
    return false;
  }
};

export default function useAuthRedirect({
  authRepository,
}: UseAuthRedirectProps): () => void {
  const router = useRouter();

  const redirect = (): void => {
    const redirectUrl = Cookies.get("redirectUrl") || "/";
    Cookies.remove("redirectUrl");

    if (!validateRedirectUrl(redirectUrl)) {
      alert("잘못된 리다이렉트 URL입니다.");
      router.replace("/");
      return;
    }

    router.replace(redirectUrl);
  };

  return redirect;
}
