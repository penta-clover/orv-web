export default function SelectGuidePopup() {
  return (
    <div className="flex flex-col justify-center items-center gap-[8px] bg-grayscale-800 text-grayscale-200 w-[952px] max-w-[calc(90dvw)] h-[118px] p-[24px] rounded-[16px]">
      <span className="text-grayscale-50 text-head1">
        인터뷰 주제를 1개 골라주세요
      </span>
      <span className="text-grayscale-300 text-body2">
        주제를 선택하고 안내에 따라 인터뷰를 진행해주세요.
      </span>
    </div>
  );
}
