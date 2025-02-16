import { AuthTokenContext } from "@/contexts/AuthTokenContext";
import { useRouter } from "next/router";
import { useContext } from "react";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { setAuthToken } = useContext(AuthTokenContext);
  const router = useRouter();
  const params = await searchParams;

  // 정상적인 요청인 경우
  if (params["jwtToken"]) {
    const jwtToken = params["jwtToken"];
    setAuthToken(jwtToken);

    const isNewUser = params["isNewUser"] === "true";
    if (isNewUser) {
      router.replace("/auth/join/step1");
    } else {
      router.replace("/");
    }
  } else {
    alert("잘못된 요청입니다.");
    router.replace("/login");
  }
}
