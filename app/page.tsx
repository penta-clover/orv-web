"use client";

import { useAuthRepository } from "@/providers/AuthRepositoryContext";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const authRepository = useAuthRepository();

  useEffect(() => {
    const authToken = authRepository.getAuthToken();

    if (authToken) {
      redirect("/dashboard/home");
    } else {
      redirect("/auth/login");
    }
  }, []);

  return null;
}
