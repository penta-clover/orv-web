export default function Page() {
  return (
    <div className="flex flex-col max-w-[450px] h-screen mx-auto py-10 px-5 space-y-4">
      <h1 className="text-2xl font-extrabold">당신을 부를 호칭을 정해주세요</h1>
      <div className="flex-1 w-full space-y-2">
        <div className="flex flex-row w-full space-x-3">
          <input
            className="flex-grow p-2 text-sm bg-gray-100 rounded-md"
            placeholder="예시)"
          />
          <button className="p-2 bg-gray-300 rounded-md text-m">
            중복확인
          </button>
        </div>
        <div className="text-xs">8자리 이내, 문자/숫자로 입력 가능해요</div>
      </div>
      <button className="w-full py-2 bg-gray-300 rounded-md text-m">
        다음
      </button>
    </div>
  );
}
