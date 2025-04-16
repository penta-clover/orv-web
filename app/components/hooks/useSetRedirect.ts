"use client";
import Cookies from "js-cookie";

export function useSetRedirectUrl() {
  // 지정한 URL을 쿠키에 저장하는 함수
  const setRedirectUrl = (url: string): void => {
    if (!url) {
      console.error("redirect url이 비어있습니다.");
      return;
    }

    // 10분 후 만료 (만료 시간을 Date 객체로 지정)
    const expireDate = new Date(Date.now() + 10 * 60 * 1000);
    Cookies.set("redirectUrl", url, { expires: expireDate });
  };

  return { setRedirectUrl };
}