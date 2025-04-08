import { NextRequest, NextResponse } from "next/server";
import { LinkHandler } from "@/middleware/linkHandler";

export const trackingFreeHandler: LinkHandler = (request: NextRequest) => {
  const response = NextResponse.redirect(new URL("/", request.url));

  response.headers.append(
    "Set-Cookie",
    `orv-ga-tracking-free=true; Max-Age=${60 * 60 * 24 * 3650}; Path=/`
  );
  response.headers.append(
    "Set-Cookie",
    `orv-amplitude-tracking-free=true; Max-Age=${60 * 60 * 24 * 3650}; Path=/`
  );
  response.headers.append(
    "Set-Cookie",
    `orv-smartlook-tracking-free=true; Max-Age=${60 * 60 * 24 * 3650}; Path=/`
  )
  return response;
};
