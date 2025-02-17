"use client";

import { cookies } from "next/headers";
import { useRouter, useSearchParams } from "next/navigation";

// 페이지로 만들었긴 한데, 보여줄 내용 없이 바로 리다이렉트 수행
export default async function Page() {
  const router = useRouter();
  const params = useSearchParams();
  const cookieStore = await cookies();

  // 정상적인 요청인 경우
  if (params.has("jwtToken")) {
    const jwtToken = params.get("jwtToken");
    cookieStore.set("authToken", jwtToken!);

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
}
