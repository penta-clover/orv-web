"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { AuthRepository } from "@/domain/repository/AuthRepository";

interface UseAuthRedirectProps {
  authRepository: AuthRepository;
}

export default function useAuthRedirect({
  authRepository,
}: UseAuthRedirectProps): () => void {
  const router = useRouter();

  const redirect = (): void => {
    const redirectUrl = Cookies.get("redirectUrl") || "/";
    Cookies.remove("redirectUrl");

    router.replace(redirectUrl);
  };

  return redirect;
}
