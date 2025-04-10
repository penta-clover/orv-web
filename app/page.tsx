"use client";

import { useAuthRepository } from "@/providers/AuthRepositoryContext";
import { redirect, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

export default function Page() {
  return (
    <Suspense>
      <Body />
    </Suspense>
  );
}

function Body() {
  const authRepository = useAuthRepository();
  useEffect(() => {
    const isTokenValid = authRepository.isTokenValid();

    if (isTokenValid) {
      redirect(`/dashboard/home`);
    } else {
      redirect(`/auth/desktop`);
    }
  }, []);

  return null;
}
