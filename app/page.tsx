'use client';

import { redirect } from "next/navigation";

// https://api.orv.im/docs/index.html
export default function Home() {
  redirect("/landing/v3");
}
