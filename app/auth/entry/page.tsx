"use client"; // for Search Params

import { setCookie } from "cookies-next";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { useAuthContext } from "@/context/AuthContext";

function Body() {
  const router = useRouter();
  const params = useSearchParams();
  const { authService } = useAuthContext();

  useEffect(() => {
    if (params.has("jwtToken")) {
      const jwtToken = params.get("jwtToken");
      authService.setToken(jwtToken!);

      const isNewUser = params.get("isNewUser") === "true";
      if (isNewUser) {
        router.replace("/auth/join/step1");
      } else {
        router.replace("/");
      }
    } else {
      alert("잘못된 요청입니다.");
      router.replace("/auth/login");
    }
  });
  
  return <div></div>;
}

// 페이지로 만들었긴 한데, 보여줄 내용 없이 바로 리다이렉트 수행
export default function Page() {
  return (
    <Suspense>
    	<Body/>
  	</Suspense>
  );
}
