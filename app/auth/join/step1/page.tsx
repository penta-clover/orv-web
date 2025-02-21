"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useJoinContext } from "@/context/JoinContext";
import JoinStep1Presentation from "./JoinStep1Presentation"; 

export default function Page() {
  const router = useRouter();
  const { joinService } = useJoinContext();
  const [nickname, setNickname] = useState<string>("");
  const [validated, setValidated] = useState<boolean>(false);
  
  const onNextClicked = () => {
    if (!validated) {
      alert("먼저 중복확인을 해주세요.");
      return;
    }

    router.push(`/auth/join/step2?nickname=${nickname}`);
  };
  
  const onValidateClicked = async () => {
  	const validationResult = await joinService.validateNickname(nickname);
    
    if(validationResult.isExists) {
      alert("이미 다른 사람이 사용 중인 호칭입니다.");
      return;
    }
    if(!validationResult.isValid) {
      alert("호칭이 규칙에 맞지 않습니다.");
      return;
    }
    setValidated(true);
  }
  
  const onNicknameInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
    setValidated(false); // 닉네임 수정시 중복확인을 다시 해야함.
  };
  
  return <JoinStep1Presentation
           nickname={nickname}
           validated={validated}
           onNextClicked={onNextClicked}
           onValidateClicked={onValidateClicked}
           onNicknameInput={onNicknameInput}/>;
}
