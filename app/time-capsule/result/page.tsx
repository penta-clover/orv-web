"use client";

import html2canvas from "html2canvas";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import "@/app/components/blackBody.css";
import { Suspense, use, useEffect, useState } from "react";
import { useMemberRepository } from "@/providers/MemberRepositoryContext";
import Image from "next/image";
import { useRef } from "react";
import "./milky-way-mask.css";

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

  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollBlur, setScrollBlur] = useState(0);
  const [hideFirst, setHideFirst] = useState(false);
  const [revealRatio, setRevealRatio] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  const memberRepository = useMemberRepository();
  const [nickname, setNickname] = useState<string | null>(null);

  useEffect(() => {
    if (isSaving) {
      const timer = setTimeout(() => {
        setIsSaving(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isSaving]);

  useEffect(() => {
    const sc = scrollRef.current;
    if (!sc) return;

    const onScroll = () => {
      const scrollY = sc.scrollTop;
      // blur and hide logic for first section
      const blurThreshold = window.innerHeight * 0.2;
      const hideThreshold = window.innerHeight;
      setScrollBlur(Math.min(scrollY / blurThreshold, 1) * 8);
      setHideFirst(scrollY >= hideThreshold);

      // compute when to start revealing the invitation
      if (entireLetterRef.current) {
        const letterHeight = entireLetterRef.current.offsetHeight;
        // start 지점을 최소 0 이상으로 클램프
        const start = Math.max(letterHeight + window.innerHeight * 0.85, 0);
        const range = window.innerHeight * 0.15;
        let ratio = 0;
        if (scrollY >= start) {
          const t = Math.min((scrollY - start) / range, 1)
          ratio = Math.max(Math.pow(t,10), 0.3);
          setRevealRatio(ratio);
        } else if (scrollY >= entireLetterRef.current.offsetHeight + 220) {
          setRevealRatio(0.3);
        } else {
          setRevealRatio(0);
        }

        console.log(`scrollY: ${scrollY}, start: ${start}, ratio: ${ratio}`);
      }
    };

    sc.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // 초기값 설정
    return () => sc.removeEventListener("scroll", onScroll);
  }, [entireLetterRef]);

  useEffect(() => {
    memberRepository.getMyInfo().then((member) => {
      if (member) {
        setNickname(member.nickname);
      }
    });
  }, []);

  return (
    <div
      ref={scrollRef}
      className="flex flex-col relative bg-dark w-full h-[calc(100dvh)] overflow-y-scroll hide-scrollbar"
    >
      <div
        className="h-[90dvh] fixed left-0 right-0 top-0 mx-auto w-full max-w-[650px] z-0"
        style={{ filter: `blur(${scrollBlur}px)`, opacity: hideFirst ? 0 : 1 }}
      >
        <div className="h-[20dvh] shrink-0" />
        <div className="text-head1 text-grayscale-white mx-[16px]">
          {nickname ? `1년 뒤의 ${nickname}님에게` : ""} 영상편지와 선물이 담긴
          타임캡슐을 잘 전달했어요
        </div>
        <div className="h-[8px] shrink-0" />
        <div className="text-grayscale-300 text-body4 mx-[16px]">
          1년 뒤의 {nickname ? nickname : ""}님이 선물에 고마워하며 요즘 자신의
          근황을 소개하는 답신을 편지로 보냈어요
        </div>
        <div className="h-[23dvh] shrink-0" />
        <span className="w-full flex justify-center text-main-lilac50 text-caption1 mb-[10px] animate-updown">
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
      </div>
      <div className="h-[90dvh] shrink-0 z-20" />
      {nickname ? (
        <div ref={entireLetterRef} className="z-20">
          <Reply
            nickname={nickname}
            topic={topic}
            firstGift={gifts[0]}
            secondGift={gifts[1]}
            thirdGift={gifts[2]}
          />
        </div>
      ) : (
        <div
          ref={entireLetterRef}
          className="h-[100dvh] shrink-0 mx-[16px] bg-grayscale-white z-20"
        />
      )}
      <div className="w-full flex justify-center items-center h-[100px] shrink-0 z-20">
        <div
          className={`rounded-full h-[50px] px-[20px] flex justify-center items-center shrink-0 text-head4 font-bold ${
            isSaving
              ? "text-grayscale-700 bg-grayscale-200"
              : "text-grayscale-50 bg-grayscale-700"
          } transition-all active:scale-95`}
          onClick={() => {
            setIsSaving(true);
            handleCapture(entireLetterRef.current!);
          }}
        >
          {isSaving ? "다운로드 중..." : "이미지 저장하기"}
        </div>
      </div>
      <div className="h-[50px] shrink-0 z-20" />
      <div className="flex flex-col items-center justify-center w-full animate-updown z-30 gap-[5px]">
        <Image
          unoptimized
          src="/icons/down-arrow.svg"
          width={20}
          height={34}
          alt="down-arrow"
        />

        <span className="w-full flex justify-center text-main-lilac50 text-caption1 mb-[10px] animate-updown">
          아래로 쭉 스크롤해서 다음 화면으로 넘어가기
        </span>
      </div>
      <div className="h-[calc(100dvh-280px)] shrink-0 z-20" />
      <div className="h-[160px] shrink-0 z-20 pointer-events-none" />
      <div
        className={`fixed bottom-0 left-0 right-0 mx-auto w-full max-w-[650px] z-10`}
        style={{
          filter: `blur(${(1 - revealRatio) * 8}px)`,
          opacity: revealRatio, // 추가
          transition: "filter 0.3s ease-out, opacity 0.3s ease-out", // 수정
        }}
      >
        <Invitation />
      </div>
    </div>
  );
}

function CTA(props: {
  text: string;
  onClick: () => void;
  className?: string;
  children?: React.ReactNode;
}) {
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
        {props.children}
      </button>
    </div>
  );
}

function Invitation() {
  const [isCopied, setIsCopied] = useState(false);
  const router = useRouter();

  const memberRepository = useMemberRepository();
  const [nickname, setNickname] = useState<string | null>(null);

  useEffect(() => {
    memberRepository.getMyInfo().then((member) => {
      if (member) {
        setNickname(member.nickname);
      }
    });
  }, []);

  useEffect(() => {
    // 클립보드에 복사 성공 시 5초 후에 isCopied 상태를 false로 변경
    if (isCopied) {
      const timer = setTimeout(() => {
        setIsCopied(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isCopied]);

  return (
    <div className="flex flex-col relative bg-dark w-full h-[calc(100dvh)]">
      <div className="h-[20dvh] shrink" />

      <div className="text-head1 text-grayscale-white mx-[16px] z-10">
        {nickname ? `${nickname}님이 ` : ""}다음 타임캡슐 참여자를
        <br />
        초대할 수 있는 링크를 생성했어요!
      </div>

      <div className="text-grayscale-300 text-body4 mx-[16px] z-10">
        타임캡슐 프로젝트에 함께 하고 싶은 친구를 직접 초대할 수 있어요.
        생각나는 친구에게 초대링크를 선물해주세요
      </div>
      <div className="h-[81px] shrink-0" />

      <div className="flex justify-center w-full h-[300px]">
        <Image
          src={
            "https://d3bdjeyz3ry3pi.cloudfront.net/static/images/letter-heart.png"
          }
          unoptimized
          alt="letter"
          width={0}
          height={0}
          style={{
            objectFit: "contain",
            width: "200px",
            height: "200px",
            zIndex: 10,
          }}
        />
      </div>

      <div className="absolute w-full bottom-[26px] z-10">
        <CTA
          text=""
          onClick={() => {
            // 클립보드에 복사
            navigator.clipboard.writeText(
              `https://orv.im/time-capsule?ref=${nickname}`
            );
            setIsCopied(true);
          }}
          className={`w-full h-[48px] mx-[16px] text-head4 ${
            isCopied ? "bg-grayscale-white" : "bg-main-lilac50"
          }`}
        >
          <div className="flex items-center justify-center">
            {isCopied ? (
              <>
                <Image
                  src="/icons/check-grayscale-black.svg"
                  alt="check"
                  width={27}
                  height={27}
                />
                <div className="w-[2px]" />
                <div className="text-grayscale-800 text-head4">
                  {nickname ? `${nickname}님의 ` : ""}초대링크 복사 완료
                </div>
              </>
            ) : (
              <div className="text-grayscale-800 text-head4">
                초대링크 공유하기
              </div>
            )}
          </div>
        </CTA>

        <div className="h-[16px]" />

        <CTA
          text="다음으로"
          onClick={() => {
            router.push(`/time-capsule/suggestion`);
          }}
          className="w-full h-[48px] mx-[16px] text-head4 bg-gd"
        />
      </div>

      <div className="milky-way-mask-container">
        <Image
          src="https://d3bdjeyz3ry3pi.cloudfront.net/static/images/milky-way.png"
          alt="milky-way"
          unoptimized
          fill
          className="milky-way-mask"
        />
      </div>
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
    <div className="flex flex-col bg-grayscale-white mx-[16px] px-[16px] py-[20px]">
      <div className="text-head2 text-grayscale-black underline">
        To. 2025년의 {nickname}
      </div>

      <div className="h-[35px]" />

      <p className="text-body1 font-onglyph text-grayscale-black">
        안녕, {nickname}!<br />
        나는 2026년 {new Date().getMonth() + 1}월 {new Date().getDate()}일의 너,{" "}
        {nickname}이야.
        <span className="block h-[24px] shrink-0" />
        <span className="block text-caption1 text-grayscale-500 font-pretendard underline">
          타임캡슐에 담은 생각: {topicMapper(topic)!.displayName}
        </span>
        {topicMapper(topic).text}
        <span className="block h-[24px] shrink-0" />
        <span className="block text-body1 text-grayscale-black">
          아 참! 요즘 내가 어떻게 지내는지 들려줄게
        </span>
      </p>

      <div className="h-[60px] shrink-0" />

      <div className="w-full flex justify-center">
        <Image
          src={giftMapper(firstGift)!.image!}
          unoptimized
          alt="mind-test-first"
          width={300}
          height={300}
          className="rounded-full border-[1px] border-grayscale-black"
        />
      </div>

      <div className="h-[60px] shrink-0" />

      <div className="text-caption1 text-grayscale-500 font-pretendard underline">
        첫 번째 선물: {giftMapper(firstGift)!.displayName}
      </div>
      <div className="h-[2px] shrink-0" />
      <div className="text-head2 font-normal font-onglyph text-grayscale-900">
        오늘, 가장 기억에 남은 사건
      </div>

      <div className="flex">
        <div className="w-[2px] my-[5px] shrink-0 inset-y-0 mr-[10px] bg-grayscale-black" />
        <div className="text-body1 font-onglyph text-grayscale-black">
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
          className="rounded-full border-[1px] border-grayscale-black"
        />
      </div>

      <div className="h-[60px] shrink-0" />

      <div className="text-caption1 text-grayscale-500 font-pretendard underline">
        두 번째 선물: {giftMapper(secondGift)!.displayName}
      </div>
      <div className="h-[2px] shrink-0" />
      <div className="text-head2 font-normal font-onglyph text-grayscale-900">
        오늘, 내가 먹은 음식
      </div>

      <div className="flex">
        <div className="w-[2px] my-[5px] shrink-0 inset-y-0 mr-[10px] bg-grayscale-black" />
        <div className="text-body1 font-onglyph text-grayscale-black">
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
          className="rounded-full border-[1px] border-grayscale-black"
        />
      </div>

      <div className="h-[60px] shrink-0" />

      <div className="font-pretendard text-caption1 text-grayscale-500 font-pretendard underline">
        마지막 선물: {giftMapper(thirdGift)!.displayName}
      </div>
      <div className="h-[2px] shrink-0" />
      <div className="text-head2 font-normal font-onglyph text-grayscale-900">
        오늘, 가장 어이 없는 일
      </div>

      <div className="flex">
        <div className="w-[2px] my-[5px] shrink-0 inset-y-0 mr-[10px] bg-grayscale-black" />
        <div className="text-body1 text-grayscale-black">
          <span className="font-onglyph">{giftMapper(thirdGift)!.text}</span>
        </div>
      </div>

      <div className="h-[60px] shrink-0" />

      <div className="flex flex-col items-center text-body1 font-onglyph text-grayscale-black">
        <p>이상으로 2026년 나의 근황이었어</p>
        <div className="h-[3px] shrink-0" />
        <p>1년 뒤 네 모습을 살펴보니 어때?</p>
        <div className="h-[3px] shrink-0" />
        <p>네가 기대하던 삶과는 좀 다르니?</p>
        <div className="h-[3px] shrink-0" />
        <p>하나 확실한 건, 난 지금 너무너무 행복해!</p>
        <div className="h-[3px] shrink-0" />
        <p>너도 그곳에서 행복하면 좋겠어. 안녕!</p>
      </div>

      <div className="h-[30px] shrink-0" />
      <div className="w-full flex justify-center">
        <Image
          src={
            "https://d3bdjeyz3ry3pi.cloudfront.net/static/images/bye-hand.jpg"
          }
          unoptimized
          alt="bye-hand"
          width={84}
          height={84}
          className="rounded-full border-[1px] border-grayscale-black"
        />
      </div>

      <div className="h-[30px] shrink-0" />
      <div className="flex justify-end text-head2 w-full text-grayscale-black underline">
        From. 2026년 미래의 {nickname}
      </div>
    </div>
  );
}

function topicMapper(topic: string) {
  switch (topic) {
    case "나":
      return {
        displayName: "나",
        text: "네가 나에게 보내준 말이 정말 힘이 많이 되었어!! 일년 뒤의 나는 아직 완벽하지 않아, 여전히 걱정도 많고, 고민도 많아...하지만 확실한 건, 나는 잘 살아가고 있어! 너의 말 덕분에 나 자신을 더 믿고, 스스로를 더 챙겨 보기로 했어. 네가 꿈꾸던 “나”로 조금씩 나아가 볼게!",
      };
    case "미래":
      return {
        displayName: "미래",
        text: "우선 놀라지마!!  네가 그 당시에 바랬던 것들, 이루고자 했던 것들을 모두 이루었고 지금 나는 네가 원했던 모습으로 살아가고 있어. 힘들더라도 한 걸음씩 걸어 온 네가 있기에 지금의 내가 존재하는 거겠지? 지금 내가 해줄 수 있는 말은 너는 잘하고 있고, 조금씩 네가 원하는 모습에 가까워지고 있어!!",
      };
    case "불안":
      return {
        displayName: "불안",
        text: "내가 그 영상을 남겼을 때, 난 진짜 힘들었지...포기하고 싶은 순간들이 많았고.. 근데 말야, 지금의 나는 그때의 네가 너무나도 자랑스러워, 버텨줘서 고맙고 포기하지 않아서 다행이야! 지금의 내가 존재한다는 것은 네가 포기하지 않았다는 거겠지?",
      };
    case "과거":
      return {
        displayName: "과거",
        text: `아마 1년 전에 난 “과거로 돌아갈 수 있다면 언제로 가고 싶나요?” 질문을 받았었지? 지금의 내가 이 질문에 답을 하자면 난 1년 전으로 돌아가고 싶어...네가 망설이고 있는 일들이 있다면 최선을 다해 부딪혀 보라고 말해주고 싶어. 실패하더라도, 지금처럼 "그때 해볼걸…" 하고 후회하진 않을 테니까 말야.`,
      };
    case "사랑":
      return {
        displayName: "사랑",
        text: `일단 그 사람이 지금 옆에 있는진...비밀이야, 과거에 있는 너의 선택에 맡기고 싶어. 하지만 중요한 건, 너는 누군가를 사랑할 수 있는 사람이 되었어. 그리고 지금의 나는 누군가에게도 사랑받고 있고, 무엇보다도 나 자신을 사랑할 수 있게 됐어. 사랑이란게 늘 쉽지는 않지만 결국 그런 경험들이 나를 더 따뜻하게 만들어 준 것 같아.`,
      };
    case "행복":
      return {
        displayName: "행복",
        text: `네가 말했던 그 순간들...지금 다시 생각해봐도 정말 행복했던 것 같아!! 지금의 나는 그런 순간들을 더 기억하려고 해. 그땐 지나쳤던 것들이 시간이 지나고 얼마나 소중한지 알게 되었거든. 돌이켜 생각해보면 행복은 정말 우리 가까이에 있더라고. 그러니까 너무 멀리서 찾지 마. 카페에서 조용히 앉아 바라 보는 하늘이 너무 예쁠 때, 우연히 내가 좋아하는 노래가 나올 때처럼 행복은 우리 일상 속에 있다는 것을 알아줘!!`,
      };
    default:
      return {
        displayName: "",
        text: "요즘 나에게 바뀐점이라면... 너보다 약간 더 늙었지만 조금은 더 행복한거 같기도 해.",
      };
  }
}

function giftMapper(gift: string) {
  switch (gift) {
    case "mos":
      return {
        displayName: "<솔로 무조건 탈출> 가이드북",
        text: `편지랑 같이 뭔 책이 같이 왔더라고? 그 책을 보고 "눈 깜빡거리는게 두려워. 그 동안 당신을 볼 수 없잖아"라고 그 사람에게 말했지. 근데 어째서인지 표정이 굳더니 도망치시더라고.... 많이 수줍어 하시는 스타일인가봐?`,
        image:
          "https://d3bdjeyz3ry3pi.cloudfront.net/static/images/mind-test-mos.jpg",
      };
    case "cat":
      return {
        displayName: "<고양이 일상 회화> 마스터북",
        text: `보내 준 고양이 일상 회화 책은 정말 유용했어! 이제 길거리 고양이들이 무슨 말하는 지 이해할 수 있게 됐어. 어제는 츄르를 사다줬는데 고양이에게 고맙다는 얘기를 들었어! 냐~~~옹, 냐~옹 (보내줘서 고마워)`,
        image:
          "https://d3bdjeyz3ry3pi.cloudfront.net/static/images/mind-test-cat.jpg",
      };
    case "dog":
      return {
        displayName: "강아지 사료",
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
    case "mil":
      return {
        displayName: "저지방 우유",
        text: `네가 보내 준 치즈가 진짜 맛있게 숙성됐어! 방금 그 치즈로 만든 피자를 맛있게 먹었어. 잠시만...근데 배가 왜 이렇게 아프지?`,
        image:
          "https://d3bdjeyz3ry3pi.cloudfront.net/static/images/mind-test-mil.jpg",
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
      scale: window.devicePixelRatio,
    });

    canvas.toBlob(async (blob) => {
      if (!blob) throw new Error("blob 생성 실패");

      // 1. Web Share 가능하면 공유 시트 열기
      const file = new File([blob], `미래에서-온-편지.png`, {
        type: "image/png",
      });
      if (navigator.canShare?.({ files: [file] })) {
        try {
          await navigator.share({ files: [file], title: "미래에서 온 편지" });
          return; // 사진 저장 후 함수 종료 → 아래 다운로드 코드 건너뜀
        } catch (e) {
          // 사용자가 취소하면 그대로 ↓ fallback 진행
        }
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `미래에서-온-편지-${Date.now()}.png`;
      document.body.appendChild(link); // iOS에서 필수
      link.click();

      setTimeout(() => {
        URL.revokeObjectURL(url);
        link.remove();
      }, 1000);
    }, "image/png");
  } catch (e) {
    console.error("캡처 실패:", e);
    alert("결과 저장에 실패했습니다. 다시 시도해주세요.");
  }
};
