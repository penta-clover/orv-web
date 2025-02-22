"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import JoinStep3Presentation, { POLICIES } from "./JoinStep3Presentation"; 
import { useAuthRepository } from "@/providers/AuthRepositoryContext";

function Body() {
	const router = useRouter();
  const params = useSearchParams();
  const authRepository = useAuthRepository();
  const [checked, setChecked] = useState<string[]>([]);
  
  const essentialPolicies = ["age", "term", "privacy"];
  
  const isChecked = (name: string) => checked.includes(name);
  const onCheckAllChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(e.target.checked) setChecked(Object.keys(POLICIES));
    else setChecked([]);
  };
  const onCheckChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(e.target.checked) setChecked([...checked, e.target.name]);
    else setChecked(checked.filter((item) => item != e.target.name));
  };
  
  const onNextClicked = async () => {
    for (let policy of essentialPolicies) {
      if (!checked.includes(policy)) {
        alert("모든 필수 약관에 동의해주세요.");
        return;
      }
    }
    
    const nickname = params.get("nickname");
    const gender = params.get("gender");
    const birthDay = params.get("birthDate");
    if (nickname === null || gender === null || birthDay === null) {
      alert("가입 중 문제가 발생하였습니다. 다시 시도해주세요.");
      router.replace("/auth/login");
      return;
    }
    
    await authRepository.join({nickname, gender, birthDay});
    alert("회원 가입이 완료되었습니다.");
    router.push("/");
  };
  
  return <JoinStep3Presentation
           isAllChecked={checked.length === Object.keys(POLICIES).length}
           isChecked={isChecked}
           onCheckAllChanged={onCheckAllChanged}
           onCheckChanged={onCheckChanged}
           onNextClicked={onNextClicked} />;
}

export default function Page() {
	return (
    <Suspense>
    	<Body/>
  	</Suspense>
  );
}
