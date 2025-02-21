export const POLICIES = {
  age: "[필수] 만 14세 이상입니다.",
  term: "[필수] 이용약관에 동의합니다.",
  privacy: "[필수] 개인정보 수집 및 이용에 동의합니다.",
  alarm: "[선택] 이벤트 및 혜택 알림 수신에 동의합니다.",
  enhance: "[선택] 서비스 품질 향상에 동의합니다."
};

export type JoinStep3Props = {
  isAllChecked: boolean,
  isChecked: (name: string) => boolean,
  onCheckAllChanged: (e: React.ChangeEvent<HTMLInputElement>) => void,
  onCheckChanged: (e: React.ChangeEvent<HTMLInputElement>) => void,
  onNextClicked: () => void,
};

export default function JoinStep3Presentation({isAllChecked, isChecked, onCheckAllChanged, onCheckChanged, onNextClicked}: JoinStep3Props) {
  return (
    <div className="flex flex-col max-w-[450px] h-screen mx-auto py-10 px-5 space-y-10">
      <h1 className="text-2xl font-extrabold">이용약관 및 정책</h1>
      <label>
        <input type="checkbox" className="mr-2 text-sm" onChange={onCheckAllChanged} checked={isAllChecked}/>
        모두 동의합니다.
      </label>
      <div className="flex flex-col items-start flex-grow w-full space-y-4">
        {Object.entries(POLICIES).map(([key, value]) => (
        <label key={key}>
          <input type="checkbox" className="mr-2 text-sm" name={key} onChange={onCheckChanged} checked={isChecked(key)}/>
          {value}
        </label>
        ))}
      </div>
      <button className="w-full py-2 bg-gray-300 rounded-md text-m" onClick={onNextClicked}>
        다음
      </button>
    </div>
  );
}
