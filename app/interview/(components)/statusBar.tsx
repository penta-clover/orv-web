import Image from "next/image";

export default function StatusBar(props: { currentStep: number }) {
  const { currentStep } = props;

  return (
    <div className="pb-[20px]">
      <div className="w-[424px] h-[2px] bg-grayscale-500 relative top-[23px] -z-10"></div>
      <div className="flex flex-row gap-[80px] relative">
        <div className="flex flex-col items-center">
          {currentStep > 1 ? <PreviousStep /> : <CurrentStep>1</CurrentStep>}
          {currentStep === 1 && (
            <div className="mt-[8px] text-head2 text-main-lilac50 absolute top-[46px] whitespace-nowrap">
              인터뷰 환경 조성
            </div>
          )}
        </div>
        <div className="flex flex-col items-center">
          {currentStep > 2 ? (
            <PreviousStep />
          ) : currentStep === 2 ? (
            <CurrentStep>2</CurrentStep>
          ) : (
            <NextStep>2</NextStep>
          )}
          {currentStep === 2 && (
            <div className="mt-[8px] text-head2 text-main-lilac50 absolute top-[46px] whitespace-nowrap">
              오디오 설정
            </div>
          )}
        </div>
        <div className="flex flex-col items-center">
          {currentStep > 3 ? (
            <PreviousStep />
          ) : currentStep === 3 ? (
            <CurrentStep>3</CurrentStep>
          ) : (
            <NextStep>3</NextStep>
          )}
          {currentStep === 3 && (
            <div className="mt-[8px] text-head2 text-main-lilac50 absolute top-[46px] whitespace-nowrap">
              화면 각도 조정
            </div>
          )}
        </div>
        <div className="flex flex-col items-center">
          {currentStep === 4 ? (
            <CurrentStep>4</CurrentStep>
          ) : (
            <NextStep>4</NextStep>
          )}
          {currentStep === 4 && (
            <div className="mt-[8px] text-head2 text-main-lilac50 absolute top-[46px] whitespace-nowrap">
              필터 조정
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CurrentStep(props: { children: React.ReactNode }) {
  const { children } = props;
  return (
    <div className="w-[46px] h-[46px] rounded-[100%] bg-grayscale-800 border-main-lilac50 border-[2px] text-main-lilac50 text-head0 flex justify-center items-center">
      {children}
    </div>
  );
}
function PreviousStep() {
  return (
    <div className="w-[46px] h-[46px] rounded-[100%] bg-main-lilac50 border-main-lilac50 border-[2px] text-head0 flex justify-center items-center">
      <Image
        src="/icons/circle-check.svg"
        alt="circle-check"
        width={24}
        height={24}
      />
    </div>
  );
}
function NextStep(props: { children: React.ReactNode }) {
  const { children } = props;
  return (
    <div className="w-[46px] h-[46px] rounded-[100%] bg-grayscale-800 border-grayscale-500 border-[2px] text-grayscale-500 text-head0 flex justify-center items-center">
      {children}
    </div>
  );
}
