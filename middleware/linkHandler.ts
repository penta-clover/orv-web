import { NextRequest, NextResponse } from "next/server";

export type LinkHandler = (
  request: NextRequest
) => Promise<NextResponse> | NextResponse;