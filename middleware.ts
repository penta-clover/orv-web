import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { linkConfigs } from "@/middleware/linkConfig";

export async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname.replace(/^\/link/, '');
    console.log("Middleware URL:", request.url);
  
    for (const config of linkConfigs) {
      if (config.pattern.test(pathname)) {
        return await config.handler(request);
      }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/link/:path*'],
}