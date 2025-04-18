"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import "@/app/components/blackBody.css";

export default function InvitationPage() {
  return (
    <Suspense>
      <Body />
    </Suspense>
  );
}

function Body() {
  // useSearchParams 훅을 통해 현재 URL의 쿼리 파라미터를 읽음.
  const searchParams = useSearchParams();
  const to = searchParams.get("t") || "";
  const from = searchParams.get("f") || "";
  const categoryCode = searchParams.get("c") || "";

  const [isMount, setIsMount] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMount(true);
  }, []);

  useEffect(() => {
    const storedCategoryCodes = localStorage.getItem("hidden-category-codes");
    const parsedCategoryCodes = storedCategoryCodes
      ? JSON.parse(storedCategoryCodes)
      : [];
    if (!parsedCategoryCodes.includes(categoryCode)) {
      parsedCategoryCodes.push(categoryCode);
      localStorage.setItem(
        "hidden-category-codes",
        JSON.stringify(parsedCategoryCodes)
      );
    }
  }, [categoryCode]);

  if (!isMount) {
    return null;
  }

  if (!to || !from || !categoryCode) {
    return (
      <div className="flex flex-col justify-center items-center w-[100vw] h-[100vh] bg-grayscale-white">
        <Image
          src="/icons/logo-grayscale-dark.svg"
          unoptimized
          width={150}
          height={72}
          alt="logo"
          className="mb-[25px]"
        />
        <span className="text-head4">유효하지 않은 링크입니다.</span>
      </div>
    );
  }

  const toData = toMapper(to);
  const fromData = fromMapper(from);
  const topicData = topicMapper(categoryCode);

  if (!toData || !fromData || !topicData) {
    return (
      <div className="flex flex-col justify-center items-center w-[100vw] h-[100vh] bg-grayscale-white">
        <Image
          src="/icons/logo-grayscale-dark.svg"
          unoptimized
          width={150}
          height={72}
          alt="logo"
          className="mb-[25px]"
        />
        <span className="text-head4">유효하지 않은 링크입니다.</span>
      </div>
    );
  }

  return (
    <div className="flex justify-center w-screen h-screen bg-grayscale-50">
      <div className="relative flex flex-col items-center max-w-[620px] w-full h-screen bg-[#F9F9F9] overflow-y-auto">
        <div className="h-[50px]" />
        <Image
          src="/icons/logo-grayscale-dark.svg"
          unoptimized
          width={140}
          height={72}
          alt="logo"
          className="my-[25px]"
        />

        <div className="h-[50px]" />

        <div className="text-head3 text-grayscale-black px-[19px] w-full">
          {fromData.name}님이 인터뷰 이용권을 선물했어요
        </div>

        <div className="h-[8px] flex-shrink-0" />

        <div className="text-body2 text-grayscale-black px-[19px] w-full">
          <p>
            오브는 주어지는 질문에 답변하고 이 모습을 기록하는 온라인 셀프
            인터뷰 서비스입니다. 오브의 사용자분들은 쉽게 ‘인생네컷의 온라인
            영상 버전’이라고 설명하고는 해요.
          </p>
          <br />
          <p>
            이 링크로 가입하시면 {fromData.name}님이 {toData.name}님에게
            추천하는 특별한 주제로 인터뷰에 참여하실 수 있어요. {fromData.name}
            님은 {topicData.text} 했어요. {toData.name}님은 어떤 답변이
            떠오르시나요?
          </p>
          <br />
          <p>
            오브에서 {toData.name}님만의 이야기를 들려주세요. 이용권은
            가입일로부터 2주간 유효합니다.
          </p>
        </div>

        <div className="h-[8px] flex-shrink-0" />

        <div
          className={`flex items-center justify-center w-[calc(100%-38px)] h-[56px] rounded-[12px] text-center bg-main-lilac50 text-head3 text-grayscale-800 mx-[19px] transition-all flex-shrink-0 active:scale-95 ${
            isLoading ? "opacity-50" : ""
          }`}
          onClick={() => {
            router.replace("/");
            setIsLoading(true);
          }}
        >
          초대 수락하기
        </div>

        <div className="h-[24px] flex-shrink-0" />

        <div className="flex items-center justify-center w-[calc(100%-38px)] h-[2px] rounded text-center bg-grayscale-300 mx-[19px] flex-shrink-0" />

        <div className="h-[24px] flex-shrink-0" />

        <div className="flex w-full px-[19px] flex-shrink-0">
          <Image
            src="/icons/default-profile-image.svg"
            width={45}
            height={45}
            alt="profile"
          />
          <div className="w-[11px]" />
          <div className="flex flex-col">
            <span className="text-body4 grayscale-800">{fromData.name}</span>
            <span className="text-body4 grayscale-800">
              오브와 {fromData.elapsedDate}일째 함께 하는 중
            </span>
          </div>
        </div>

        <div className="h-[12px] flex-shrink-0" />
        <div className="h-[12px] flex-shrink-1" />
      </div>
    </div>
  );
}

function toMapper(to: string): { name: string } {
  const data: any = {
    a1kwAc: { name: "시월필름" },
    a2kwAc: { name: "도르미" },
    a3kwAc: { name: "윤렌지" },
    a4kwAc: { name: "조서연" },
    a5kwAc: { name: "녹두" },
    a6kwAc: { name: "하나부터두열까지" },
    a7kwAc: { name: "쇼갱" },
    a8kwAc: { name: "손수아" },
    a9kwAc: { name: "장클로에피" },
    a10wAc: { name: "에비" },
    a11wAc: { name: "캐딜로그" },
    a12wAc: { name: "은지니" },
    a13wAc: { name: "학회원" },
    a14wAc: { name: "최예진" },
    a15wAc: { name: "이시헌" },
  };
  return data[to];
}

function fromMapper(from: string): { name: string; elapsedDate: number } {
  const data: any = {
    HJ: { name: "최현준", elapsedDate: 57 },
    GA: { name: "김건아", elapsedDate: 57 },
    SH: { name: "이승헌", elapsedDate: 57 },
    JH: { name: "이종하", elapsedDate: 47 },
  };
  return data[from];
}

function topicMapper(topic: string): {
  text: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
} {
  const data: any = {
    HIDDEN_3fEMQ1: {
      text: "같은 주제의 질문 중 “유튜브를 운영하며 가장 힘들었던 점은 무엇인가요?”라는 질문에 “열심히 만든 영상이었는데 사람들이 반응이 나타나지 않을 때”라고 답변",
      ogTitle: "오브를 즐겨쓰는 친구가 초대했어요.",
      ogDescription: "노트북으로 입장해주세요.",
      ogImage:
        "http://d3bdjeyz3ry3pi.cloudfront.net/static/images/invitation-og.png",
    },
    HIDDEN_3fEMQ2: {
      text: "같은 주제의 질문 중 “왜 HySpark에 들어 오려고 했나요?”라는 질문에 “언젠가 죽는 날이 다가왔을 때 그때 해볼 걸이라고 후회할 것 같아서 모든 것을 해보겠다는 마음으로 지원했습니다.”라고 답변",
      ogTitle: "오브를 즐겨쓰는 친구가 초대했어요.",
      ogDescription: "노트북으로 입장해주세요.",
      ogImage:
        "http://d3bdjeyz3ry3pi.cloudfront.net/static/images/invitation-og.png",
    },
    HIDDEN_3fEMQ3: {
      text: "같은 주제의 질문 중 “이번 생일에 가장 고마움을 느끼는 상대가 있나요?”라는 질문에 “축하해준 사람들 모두한테 정말 고맙다고 느끼지만, 그 중에서도 예상치 못하게 오랜만에 연락을 준 친구들이 특히 더 고마웠던 것 같아요. 생일이라고 하더라도 연락을 안하다가 갑자기 연락하는 일은 쉬운 일이 아니라고 생각해서요”라고 답변",
      ogTitle: "오브를 즐겨쓰는 친구가 초대했어요.",
      ogDescription: "노트북으로 입장해주세요.",
      ogImage:
        "http://d3bdjeyz3ry3pi.cloudfront.net/static/images/invitation-og.png",
    },
    HIDDEN_3fEMQ4: {
      text: "같은 주제의 질문 중 “만약 주변 사람들의 시선이나 경제적인 제약이 없다면 당장 무엇을 할 건가요?”라는 질문에 “명품차까지는 아니더라도 차 사고 집도 좋은 곳으로 사고 싶어요. 노숙인들도 돕고 싶고.. 가치있는 일을 하고 싶어요.”라고 답변",
      ogTitle: "오브를 즐겨쓰는 친구가 초대했어요.",
      ogDescription: "노트북으로 입장해주세요.",
      ogImage:
        "http://d3bdjeyz3ry3pi.cloudfront.net/static/images/invitation-og.png",
    },
  };
  return data[topic];
}
