import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function middleware(request: NextRequest) {
  // Token 설정
  const cookieStore = await cookies();
  const authToken: string | undefined = cookieStore.get("authToken")?.value;
  const requestHeaders = new Headers(request.headers);

  if (authToken) {
    requestHeaders.set("Authorization", `Bearer ${authToken}`);
  }

  // 요청
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // 에러 처리
  if (response.status == 401) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return response;
}
