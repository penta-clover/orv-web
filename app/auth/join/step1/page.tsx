"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import JoinStep1Presentation from "./JoinStep1Presentation"; 

export default function Page() {
  const router = useRouter();
  const [nickname, setNickname] = useState<string>("");
  const [validated, setValidated] = useState<boolean>(false);
  
  const onNextClicked = () => {
    if (!validated) {
      alert("먼저 중복확인을 해주세요.");
      return;
    }

    router.push(`/auth/join/step2?nickname=${nickname}`);
  };
  
  const onValidateClicked = () => {
  	// TODO: 서버에 유효성 요청 보내기
    // 중복 여부랑 유효성 여부 모두 서버에서 체크 가능.
    if(true) {
      setValidated(true);
    }
  }
  
  const onNicknameInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
    setValidated(false);
  };
  
  return <JoinStep1Presentation
           nickname={nickname}
           validated={validated}
           onNextClicked={onNextClicked}
           onValidateClicked={onValidateClicked}
           onNicknameInput={onNicknameInput}/>;
}
