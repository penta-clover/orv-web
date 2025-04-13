"use client";

import "@/app/components/blackBody.css";
import { useAuthRepository } from "@/providers/AuthRepositoryContext";
import { useTermRepository } from "@/providers/TermRepositoryContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [cautionNotice, setCautionNotice] = useState<string>("");
  // const [hasAgreeed, setHasAgreed] = useState<boolean>(false);

  const authRepository = useAuthRepository();
  const termRepository = useTermRepository();

  const router = useRouter();

  useEffect(() => {
    // phone이 하이픈을 포함하면 안됨. phone은 숫자 11자리여야만 함
    setIsComplete(
      name.length > 0 && phone.length === 11 && !phone.includes("-")
    );

    if (phone.includes("-")) {
      setCautionNotice("하이픈(-) 기호 없이 입력해주세요. (예: 01012345678)");
    } else {
      setCautionNotice("");
    }
  }, [name, phone]);

  return (
    <div className="flex flex-col h-[calc(100dvh)] justify-center items-center px-[24px]">
      <div className="h-[8dvh]" />

      <Image
        src={"/icons/logo-main-lilac50.svg"}
        alt="logo"
        width={120}
        height={61}
      />

      <div className="h-[37px]" />

      <div className="text-head2 text-grayscale-white">
        회원 가입을 위한 정보를 입력해주세요.
      </div>

      <div className="h-[56px] shrink" />

      <div className="w-full max-w-[532px]">
        <InputForm
          onChangeName={(name: string) => setName(name)}
          onChangePhone={(phone: string) => setPhone(phone)}
          onClickSendAuthCode={() => {}}
          phoneCaution={cautionNotice}
        />
      </div>

      <div className="h-[112px] shrink" />

      <span className="text-head3 text-grayscale-300 text-center">
        로그인 시 <span className="font-bold">이용약관</span>과{" "}
        <span className="font-bold">개인정보처리방침</span>에 모두 동의한 것으로
        간주합니다.
      </span>

      <div className="h-[16px]" />

      <button
        className={`flex items-center justify-center text-head3 rounded-[12px] max-w-[532px] h-[56px] w-full transition-all active:scale-95 ${
          isComplete
            ? "text-grayscale-800 bg-main-lilac50"
            : "text-grayscale-500 bg-grayscale-800"
        }`}
        disabled={!isComplete}
        onClick={async () => {
          await authRepository.join({
            nickname: name,
            gender: null,
            birthDay: null,
            phoneNumber: phone,
          });

          await Promise.all([
            termRepository.updateTermAgreement("term250301", true),
            termRepository.updateTermAgreement("privacy250301", true),
            termRepository.updateTermAgreement("alarm250301", true),
            termRepository.updateTermAgreement("enhance250301", true),
          ]);

          router.push("/");
        }}
      >
        회원가입 후 오브 시작하기
      </button>

      <div className="h-[16px]" />
    </div>
  );
}

function InputForm(props: {
  onChangeName: (name: string) => void;
  onChangePhone: (phone: string) => void;
  onClickSendAuthCode: () => void;
  phoneCaution?: string;
}) {
  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col w-full gap-[4px]">
        <span className="text-body4 text-grayscale-500">이름</span>
        <input
          type="text"
          placeholder="이름을 입력해주세요"
          className="h-[55px] px-[15px] py-[13px] w-full text-body1 border border-transparent text-grayscale-white rounded-[8px] bg-grayscale-700 focus:border-grayscale-200 focus:outline-none focus:ring-0"
          onChange={(e) => props.onChangeName(e.target.value)}
        />
      </div>

      <div className="h-[24px]" />

      <div className="flex flex-col w-full gap-[4px]">
        <span className="text-body4 text-grayscale-500">전화번호</span>
        <input
          type="text"
          placeholder="전화번호를 입력해주세요"
          className="h-[55px] px-[15px] py-[13px] w-full text-body1 border border-transparent text-grayscale-white rounded-[8px] bg-grayscale-700 focus:border-grayscale-200 focus:outline-none focus:ring-0"
          onChange={(e) => props.onChangePhone(e.target.value)}
        />
      </div>

      <div className="h-[22px] mt-[2px] text-body4 text-grayscale-500">
        {props.phoneCaution ?? ""}
      </div>
    </div>
  );
}
