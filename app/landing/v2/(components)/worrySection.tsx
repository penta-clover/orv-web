export default function WorrySection() {
  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex flex-col items-center text-head1 text-grayscale-white">
        <span className="text-head1">한번쯤은 떠올리지만</span>
        <span className="text-head2">곧바로 잊혀지는 많은 질문과 고민들</span>
      </div>

      <div className="h-[36px]" />

      <div className="flex flex-col items-center text-body4 text-grayscale-200 w-full max-w-[384px] gap-[22px] px-[16px]">
        <div className="flex flex-row w-full">
          <span className="bg-grayscale-700 rounded-[8px] p-[12px]">
            요즘 나를 가장 힘들게 하는 것은?
          </span>
          <span className="grow" />
        </div>
        <div className="flex flex-row w-full">
        <span className="grow" />
          <span className="bg-grayscale-800 rounded-[8px] p-[12px]">
            최근 행복하다고 느꼈던 상황은 언제였나요?
          </span>
        </div>
        <div className="flex flex-row w-full">
          <span className="bg-grayscale-700 rounded-[8px] p-[12px]">
            과거로 돌아갈 수 있다면 언제로 돌아가고 싶나요?
          </span>
          <span className="grow" />
        </div>
        <div className="flex flex-row w-full">
        <span className="grow" />
          <span className="bg-grayscale-800 rounded-[8px] p-[12px]">
            내일 죽는다면 오늘은 무엇을 하고 싶은가요?
          </span>
        </div>
      </div>
    </div>
  );
}
