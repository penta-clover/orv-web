"use client";

import { EarlybirdRepository } from "@/repositories/earlybirdRepository";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const router = useRouter();
  const earlybirdRepository = new EarlybirdRepository();


  // API에서 받아올 최종 숫자
  const [targetNumber, setTargetNumber] = useState(0);
  // 애니메이션으로 보여줄 숫자
  const [displayNumber, setDisplayNumber] = useState(0);

  // API 호출로 targetNumber 값을 가져오기
  useEffect(() => {
    earlybirdRepository.getWaitingNumber().then((number) => {
      setTargetNumber(1416+number);
    });
  }, []);

  useEffect(() => {
    if (targetNumber > 0) {
      const interval = setInterval(() => {
        setDisplayNumber((prev) => {
          if (prev < targetNumber) {
            return prev + Math.max(Math.round((targetNumber-prev)*0.05), 1);
          } else {
            clearInterval(interval);
            return prev;
          }
        });
      }, 10); // 10ms마다 업데이트 (0.01초)
      return () => clearInterval(interval);
    }
  }, [targetNumber]);

  return (
    <div>
      <div>registration</div>
      <div>{displayNumber}</div>
      <button>
        예상 순번 확인하기
      </button>
    </div>
  );
}
