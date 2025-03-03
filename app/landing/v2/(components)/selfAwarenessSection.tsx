import Image from "next/image";

export default function SelfAwarenessSection() {
  return (
    <div className="flex flex-col items-center w-full">
      <div className="text-head1 text-grayscale-white flex flex-col items-center">
        <span>당신은 스스로를</span>
        <span>얼마나 잘 알고 있나요?</span>
      </div>
      <div className="h-[16px]" />
      <div className="text-body2 text-grayscale-400 flex flex-col items-center">
        <span>무심코 지나치는 내 안의 물음들,</span>
        <span>지금처럼 가는게 맞을까에 대한 고민들</span>
        <span>잘 모르겠다는 이유로 그냥 넘기진 않으셨나요?</span>
      </div>
      <div className="h-[24px]" />
      <Image
        src={"/images/question-burble.png"}
        width={287}
        height={214}
        alt="question burble"
      />
    </div>
  );
}
