'use client';

import { useRouter } from "next/navigation";
import Deadline from "../../deadline";

export default function Page() {
  const router = useRouter();

    return (
      <div className="flex flex-col">
        <div>registration</div>
        <Deadline deadline={new Date("2025-2-26")} onDeadline={() => router.push("/")} />
        <button onClick={() => navigator.clipboard.writeText("110-472-357-341")}>
          계좌번호 복사
        </button>
        <button onClick={() => router.push("/landing/registration/step2")}>
          입금 후 넘어가기
        </button>
      </div>
    );
}