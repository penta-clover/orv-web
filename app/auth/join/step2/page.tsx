"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import JoinStep2Presentation, { Gender } from "./JoinStep2Presentation"; 

function Body() {
	const router = useRouter();
  const params = useSearchParams();
  
  const nickname = params.get("nickname");
  const [birthYear, setBirthYear] = useState<number|null>(null);
  const [birthMonth, setBirthMonth] = useState<number|null>(null);
  const [birthDay, setBirthDay] = useState<number|null>(null);
  const [gender, setGender] = useState<Gender|null>(null);
  
  const onNextClicked = () => {
    if (gender == null) {
      alert("성별을 입력해주세요.");
      return;
    }
    if (birthYear == null) {
      alert("출생 연도를 입력해주세요.");
      return;
    }
    if (birthMonth == null) {
      alert("출생 월을 입력해주세요.");
      return;
    }
    if (birthDay == null) {
      alert("출생 일을 입력해주세요.");
      return;
    }
    
    const birthDate = `${birthYear}-${birthMonth}-${birthDay}`;
    router.push(`/auth/join/step3?nickname=${nickname}&birthDate=${birthDate}&gender=${gender}`);
  };
  
  const onBirthYearChanged = (e: React.ChangeEvent<HTMLSelectElement>) => setBirthYear(Number(e.target.value));
  const onBirthMonthChanged = (e: React.ChangeEvent<HTMLSelectElement>) => setBirthMonth(Number(e.target.value));
  const onBirthDayChanged = (e: React.ChangeEvent<HTMLSelectElement>) => setBirthDay(Number(e.target.value));
  const onGenderChanged = (e: React.ChangeEvent<HTMLSelectElement>) => setGender(e.target.value);
  
  return <JoinStep2Presentation
           birthYear={birthYear}
           birthMonth={birthMonth}
           birthDay={birthDay}
           gender={gender}
           nickname={nickname!}
           onNextClicked={onNextClicked}
           onBirthYearChanged={onBirthYearChanged}
           onBirthMonthChanged={onBirthMonthChanged}
           onBirthDayChanged={onBirthDayChanged}
           onGenderChanged={onGenderChanged}/>;
}

export default function Page() {
	return (
    <Suspense>
    	<Body/>
  	</Suspense>
  );
}
