"use client";

import { useEarlybirdRepository } from "@/providers/earlybirdRepositoryContext";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page() {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const router = useRouter();
  const earlybirdRepository = useEarlybirdRepository();

  return (
    <div className="flex flex-col gap-[4]">
      <div>registration</div>
      <input
        className="flex-grow p-2 text-sm bg-gray-100 rounded-md"
        placeholder="입금자명과 동일하게 입력해주세요"
        onChange={(e) => setName(e.target.value)}
      />
      <input
        className="flex-grow p-2 text-sm bg-gray-100 rounded-md"
        placeholder="010-1234-5678"
        onChange={(e) => setPhoneNumber(e.target.value)}
      />
      <button
        onClick={() => {
          earlybirdRepository.register({
            name: name,
            phoneNumber: phoneNumber
          });
          router.push("/landing/registration/step3");
        }}
      >
        신청하기
      </button>
    </div>
  );
}
