"use client";

import { useAuthRepository } from "@/providers/AuthRepositoryContext";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

export default function AuthGuard({ children }: { children: ReactNode }) {
  const authRepository = useAuthRepository();
  const router = useRouter();
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    let isMounted = true;

    authRepository.isAuthenticated().then((isAuthenticated) => {
      if (!isMounted) return;

      if (!isAuthenticated) {
        router.replace("/");
        return;
      }

      setIsChecked(true);
    });

    return () => {
      isMounted = false;
    };
  }, [authRepository, router]);

  if (!isChecked) return null;

  return <>{children}</>;
}
