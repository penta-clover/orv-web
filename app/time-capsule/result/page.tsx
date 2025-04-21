"use client";

import html2canvas from "html2canvas";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import "@/app/components/blackBody.css";
import { Suspense, use, useEffect, useState } from "react";
import { useMemberRepository } from "@/providers/MemberRepositoryContext";
import Image from "next/image";
import { useRef } from "react";

export default function Page() {
  return (
    <Suspense>
      <Body />
    </Suspense>
  );
}

function Body() {
  const searchParams = useSearchParams();
  const topic = searchParams.get("topic")!;
  const gifts = searchParams.get("gift")!.split(",");
  const router = useRouter();
  const entireLetterRef = useRef<HTMLDivElement>(null);

  const memberRepository = useMemberRepository();
  const [nickname, setNickname] = useState<string | null>(null);

  useEffect(() => {
    memberRepository.getMyInfo().then((member) => {
      if (member) {
        setNickname(member.nickname);
      }
    });
  }, []);

  return (
    <div className="flex flex-col relative bg-dark w-full h-[calc(100dvh)] overflow-y-scroll hide-scrollbar">
      <div className="h-[20dvh] shrink-0" />
      <div className="text-head2 text-grayscale-white mx-[16px]">
        1년 뒤{nickname ? `의 ${nickname}님에게` : ""}
        <br />
        타임캡슐과 선물이 전달됐어요
      </div>
      <div className="text-grayscale-300 text-body4 mx-[16px]">
        1년 뒤의 {nickname ? nickname : ""}님이 선물에 고마워하며 최근 자신의
        근황을 소개하는 답신을 보냈어요
      </div>
      <div className="h-[23dvh] shrink-0" />
      <span className="w-full text-center text-main-lilac50 text-caption1  mb-[10px] animate-updown">
        미래에서 온 답장 읽기
      </span>
      <div className="flex justify-center w-full animate-updown">
        <Image
          unoptimized
          src="/icons/down-arrow.svg"
          width={20}
          height={34}
          alt="down-arrow"
        />
      </div>
      <div className="h-[23dvh] shrink-0" />
      {nickname && (
        <div ref={entireLetterRef}>
          <Reply
            nickname={nickname}
            topic={topic}
            firstGift={gifts[0]}
            secondGift={gifts[1]}
            thirdGift={gifts[2]}
          />
        </div>
      )}
      <div className="w-full z-10">
        <CTA
          text="미래에서 온 편지 다운로드"
          onClick={() => {
            handleCapture(entireLetterRef.current!);
          }}
          className="w-full h-[48px] mx-[16px] text-head4 bg-grayscale-50"
        />

        <div className="h-[16px]" />

        <CTA
          text="다음으로"
          onClick={() => {
            router.push(`/time-capsule/invitation?topic=${topic}`);
          }}
          className="w-full h-[48px] mx-[16px] text-head4 bg-main-lilac50"
        />
      </div>
      <div className="h-[20px] shrink-0" />
    </div>
  );
}

function CTA(props: { text: string; onClick: () => void; className?: string }) {
  return (
    <div className="w-full flex justify-center">
      <button
        style={{ boxShadow: "0px 0px 12px rgba(197, 209, 255, 0.6)" }}
        className={cn(
          "bg-gd px-[13px] py-[9px] text-grayscale-800 text-head4 rounded-[10px] transition-all active:scale-95",
          props.className
        )}
        onClick={props.onClick}
      >
        {props.text}
      </button>
    </div>
  );
}

function Reply({
  nickname,
  topic,
  firstGift,
  secondGift,
  thirdGift,
}: {
  nickname: string;
  topic: string;
  firstGift: string;
  secondGift: string;
  thirdGift: string;
}) {
  return (
    <div className="flex flex-col mx-[20px]">
      <div className="text-head2 text-grayscale-white">
        From. 미래의 {nickname}이<br />
        To. 현재의 {nickname}에게
      </div>

      <span className="text-modypy-[5px] 4 text-grayscale-300">
        1년 뒤, 당신은 어떻게 지내고 있을까요?
      </span>

      <div className="h-[40px]" />

      <p className="text-body1 font-onglyph text-grayscale-white">
        안녕! 나는 2026년 {new Date().getMonth() + 1}월 {new Date().getDate()}
        일의 {nickname}이야.
        <div className="h-[40px] shrink-0" />
        <span className="text-caption1 text-grayscale-300 font-pretendard underline">
          타임캡슐에 담은 생각: {topicMapper(topic)!.displayName}
        </span>
        {topicMapper(topic).text}
      </p>

      <div className="h-[60px] shrink-0" />

      <div className="w-full flex justify-center">
        <Image
          src={giftMapper(firstGift)!.image!}
          unoptimized
          alt="mind-test-first"
          width={300}
          height={300}
          className="rounded-full"
        />
      </div>

      <div className="h-[60px] shrink-0" />

      <div className="text-head2 font-onglyph text-main-lilac50">
        1년 뒤 오늘, 가장 기억에 남은 사건
      </div>

      <div className="flex">
        <div className="w-[2px] my-[5px] shrink-0 inset-y-0 mr-[10px] bg-grayscale-white" />
        <div className="text-body1 font-onglyph text-grayscale-white">
          <span className="text-caption1  text-grayscale-300 font-pretendard underline">
            첫 번째 선물: {giftMapper(firstGift)!.displayName}
          </span>
          <br />
          <span className="font-onglyph">{giftMapper(firstGift)!.text}</span>
        </div>
      </div>

      <div className="h-[120px] shrink-0" />

      <div className="w-full flex justify-center">
        <Image
          src={giftMapper(secondGift)!.image!}
          unoptimized
          alt="mind-test-second"
          width={300}
          height={300}
          className="rounded-full"
        />
      </div>

      <div className="h-[60px] shrink-0" />

      <div className="text-head2 font-onglyph text-main-lilac50">
        1년 뒤 오늘, 내가 먹은 음식
      </div>

      <div className="flex">
        <div className="w-[2px] my-[5px] shrink-0 inset-y-0 mr-[10px] bg-grayscale-white" />
        <div className="text-body1 font-onglyph text-grayscale-white">
          <span className="text-caption1  text-grayscale-300 font-pretendard underline">
            두 번째 선물: {giftMapper(secondGift)!.displayName}
          </span>
          <br />
          <span className="font-onglyph">{giftMapper(secondGift)!.text}</span>
        </div>
      </div>

      <div className="h-[120px] shrink-0" />

      <div className="w-full flex justify-center">
        <Image
          src={giftMapper(thirdGift)!.image!}
          unoptimized
          alt="mind-test-third"
          width={300}
          height={300}
          className="rounded-full"
        />
      </div>

      <div className="h-[60px] shrink-0" />

      <div className="text-head2 font-onglyph text-main-lilac50">
        1년 뒤 오늘, 가장 어이 없는 일
      </div>

      <div className="flex">
        <div className="w-[2px] my-[5px] shrink-0 inset-y-0 mr-[10px] bg-grayscale-white" />
        <div className="text-body1 text-grayscale-white">
          <span className="font-pretendard text-caption1  text-grayscale-300 font-pretendard underline">
            마지막 선물: {giftMapper(thirdGift)!.displayName}
          </span>
          <br />
          <span className="font-onglyph">{giftMapper(thirdGift)!.text}</span>
        </div>
      </div>

      <div className="h-[100px] shrink-0" />

      <div className="flex flex-col items-center text-body1 font-onglyph text-grayscale-white">
        <p>1년 뒤 네 모습을 살펴보니 어때?</p>
        <br />
        <p>네가 기대하던 삶과는 좀 다르니?</p>
        <br />
        <p>하나 확실한 건, 네가 어떻게 생각하든 난 지금 행복해!</p>
        <br />
        <p>너도 그곳에서 행복하면 좋겠어. 안녕!</p>
      </div>

      <div className="h-[100px] shrink-0" />
    </div>
  );
}

function topicMapper(topic: string) {
  switch (topic) {
    case "후회":
      return {
        displayName: "후회",
        text: "요즘 나는 후회하던 일은 잊고 미래를 생각하며 살아가고 있어. 그리고 바뀐점이라면... 너보다 약간 더 늙었지만 조금은 더 행복한거 같기도 해. 아 참! 요즘 내가 어떻게 지내는지 들려줄게",
      };
    case "미래":
      return {
        displayName: "미래",
        text: "우선 놀라지마!! 네가 그 당시에 바랬던 것들, 이루고자 했던 것들을 모두 이루었고 지금 나는 네가 원했던 모습으로 살아가고 있어. 힘들더라도 한 걸음씩 걸어 온 네가 있기에 지금의 내가 존재하는 거겠지? 지금 내가 해줄 수 있는 말은 너는 잘하고 있고, 조금씩 네가 원하는 모습에 가까워지고 있어!! 아 참! 요즘 내가 어떻게 지내는지 들려줄게",
      };
    case "불안":
      return {
        displayName: "불안",
        text: "내가 그 영상을 남겼을 때, 난 진짜 힘들었지...포기하고 싶은 순간들이 많았고.. 근데 말야, 지금의 나는 그때의 네가 너무나도 자랑스러워, 버텨줘서 고맙고 포기하지 않아서 다행이야! 지금의 내가 존재한다는 것은 네가 포기하지 않았다는 거겠지? 아 참! 요즘 내가 어떻게 지내는지 들려줄게",
      };
    case "과거":
      return {
        displayName: "과거",
        text: `아마 1년 전에 난 “과거로 돌아갈 수 있다면 언제로 가고 싶나요?” 질문을 받았었지? 지금의 내가 이 질문에 답을 하자면 난 1년 전으로 돌아가고 싶어... 네가 망설이고 있는 일들이 있다면 최선을 다해 부딪혀 보라고 말해주고 싶어. 실패하더라도, 지금처럼 "그때 해볼걸…" 하고 후회하진 않을 테니까 말야..아 참! 요즘 내가 어떻게 지내는 지 궁금하지 않아??`,
      };
    case "슬픔":
      return {
        displayName: "슬픔",
        text: `답장을 보내면서 그 때 당시 나의 얼굴이 떠올랐어. 네가 최근에 겪은 그 슬픔, 누구에게도 말하지 못했던 그 감정...사실 나도 아직 완전히 이겨내진 못했어. 하지만 그 아픔 덕분에 내가 더 단단해질 수 있었던 것 같아. 그러니까, 지금의 너도 기억해줘. 이 시기를 버텨낸 너는 결국 빛나는 사람이 될 거라는 것을.. 아 참! 요즘 내가 어떻게 지내는 지 궁금하지 않아??`,
      };
    case "분노":
      return {
        displayName: "분노",
        text: `그 때 당시 나는 그 일만 생각하면 속이 부글부글 끓어 올랐었지... 사실 1년이 지난 지금 그 때를 다시 생각하면 화가 너무 나!!! 근데 살다보니까 세상에는 억울한 일도 진짜 많고, 화가 날만 한 일들도 되게 많더라고, 이런 것들을 이겨내지 못하면 결국 상처는 나만 입는 거니까 조금씩 내려 놓는 연습을 하면 좋을 것 같아!! 아 참! 요즘 내가 어떻게 지내는 지 궁금하지 않아??`,
      };
    default:
      return {
        displayName: "",
        text: "요즘 나에게 바뀐점이라면... 너보다 약간 더 늙었지만 조금은 더 행복한거 같기도 해. 아 참! 요즘 내가 어떻게 지내는지 들려줄게",
      };
  }
}

function giftMapper(gift: string) {
  switch (gift) {
    case "mos":
      return {
        displayName: "<모솔 무조건 탈출> 가이드북",
        text: `네가 준 책은 잘 받았어. 얼마 전에 소개팅을 했는데
책에서 배운대로 “하루 세 끼 뭐 드세요?” 물어봤더니,
그 사람이 공복 인터벌 단식 36시간째라네?
기절 직전이라며 급히 집에 가셨어. 나, 책 잘못 읽은 거야?`,
        image:
          "https://d3bdjeyz3ry3pi.cloudfront.net/static/images/mind-test-mos.jpg",
      };
    case "cat":
      return {
        displayName: "<고양이 일상 회화> 마스터북",
        text: `길고양이의 왕이 됐어. 덕분에 매일 길거리에 누워있다가 길고양이 친구들의 밥을 뺐어먹을 수 있어. 고양이들 사이에서 몸을 웅크리고 이 편지를 쓰고 있어. 고마워!`,
        image:
          "https://d3bdjeyz3ry3pi.cloudfront.net/static/images/mind-test-cat.jpg",
      };
    case "dog":
      return {
        display: "강아지 사료",
        text: `네가 준 시리얼 잘 먹고 있어! 지금은 단종됐는지 팔질 않아서 아껴먹고 있어. 왠진 모르겠는데 시리얼 먹을 때마다 강아지가 자꾸 쳐다보더라;;`,
        image:
          "https://d3bdjeyz3ry3pi.cloudfront.net/static/images/mind-test-dog.jpg",
      };
    case "chi":
      return {
        displayName: "귀여운 병아리",
        text: `오늘 저녁 메뉴는 바로 삼계탕!! 뜨끈한 국물에 밥 말아서 몸보신 좀 해야겠다. 음? 근데 왠 “삐약이"라는 이름표가 있네?`,
        image:
          "https://d3bdjeyz3ry3pi.cloudfront.net/static/images/mind-test-chi.jpg",
      };
    case "dol":
      return {
        displayName: "돌",
        text: `나 진짜 어이 없는 일 당했잖아 평소처럼 길을 걷고 있었는데 하늘에서 돌이 떨어졌다니까?? 너무 어이없지 않아? 그것도 그냥 돌이 아니고 짱돌!! 대체 어떤 놈이 하늘에서 돌을 던진거야!!!`,
        image:
          "https://d3bdjeyz3ry3pi.cloudfront.net/static/images/mind-test-dol.jpg",
      };
    case "ban":
      return {
        displayName: "약간 상한 바나나",
        text: `아니, 오늘 진짜 어이없는 일이 있었어. 어떤 녀석이 바나나를 먹고는, 그 껍질을 아무렇지도 않게 땅에 버리고 갔나 봐. 근데 내가 하필 그걸 밟고 넘어 졌는데 지나가던 사람들이 웃참하더라... 대체 누가 바나나 껍질을 버린거야;;`,
        image:
          "https://d3bdjeyz3ry3pi.cloudfront.net/static/images/mind-test-ban.jpg",
      };
    default:
      return {
        displayName: "",
        text: "",
        image:
          "https://d3bdjeyz3ry3pi.cloudfront.net/static/images/mind-test-ban.jpg",
      };
  }
}

const handleCapture = async (elem: HTMLElement) => {
  try {
    const canvas = await html2canvas(elem, {
      useCORS: true,
      backgroundColor: "rgb(16, 16, 18)",
    });
    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `미래에서-온-편지-${Date.now()}.png`;
    link.click();
  } catch (e) {
    console.error("캡처 실패:", e);
    alert("결과 저장에 실패했습니다. 다시 시도해주세요.");
  }
};
