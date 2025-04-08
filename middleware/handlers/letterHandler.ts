import { NextRequest, NextResponse } from "next/server";
import { LinkHandler } from "@/middleware/linkHandler";

export const letterHandler: LinkHandler = (request: NextRequest) => {
  const referral = request.nextUrl.searchParams.get("ref");

  if (!referral) {
    return NextResponse.redirect(new URL("/events/letter", request.url));
  }

  return NextResponse.redirect(new URL("/events/letter", request.url), {
    headers: {
      "Set-Cookie": `orv-landing-referral=${referral}; Max-Age=${60 * 60 * 24 * 365}; Path=/`,
    },
  });
};
