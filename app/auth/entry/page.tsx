"use client"; // for Search Params

import { useAuthRepository } from "@/providers/AuthRepositoryContext";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

function Body() {
  const router = useRouter();
  const params = useSearchParams();
  const authReposiroty = useAuthRepository();

  useEffect(() => {
    if (params.has("jwtToken")) {
      const jwtToken = params.get("jwtToken");
      authReposiroty.setAuthToken(jwtToken!);

      const isNewUser = params.get("isNewUser") === "true";
      if (isNewUser) {
        router.replace("/auth/desktop/join");
      } else {
        router.replace("/");
      }
    } else {
      alert("잘못된 요청입니다.");
      router.replace("/auth/desktop");
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
