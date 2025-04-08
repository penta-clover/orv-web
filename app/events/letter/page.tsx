'use client';

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
export default function Page() {
    return (
        <Suspense>
            <Body />
        </Suspense>
    )
}

function Body() {
    const searchParams = useSearchParams();
    const referral = searchParams.get("ref");

    return (
        <div>
            <h1>Letter</h1>
            <p>Referral: {referral}</p>
        </div>
    )
}