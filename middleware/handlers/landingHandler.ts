import { NextRequest, NextResponse } from "next/server";
import { LinkHandler } from "@/middleware/linkHandler";

export const landingHandler: LinkHandler = (request: NextRequest) => {
  const referral = request.nextUrl.searchParams.get("ref");

  // set referral as a cookie expired after 1 year
  if (!referral) {
    return NextResponse.redirect(new URL("/landing/v2", request.url));
  }

  return NextResponse.redirect(new URL("/landing/v2", request.url), {
    headers: {
      "Set-Cookie": `orv-landing-referral=${referral}; Max-Age=${60 * 60 * 24 * 365}; Path=/`,
    },
  });
};
