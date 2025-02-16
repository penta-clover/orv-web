export default function Page() {
  return (
    <div className="flex flex-col max-w-[450px] h-screen mx-auto py-10 px-5 space-y-4">
      <h1 className="text-2xl font-extrabold">
        _님에 대한 정보를 입력해주세요
      </h1>
      <div className="flex-1 w-full space-y-4">
        <select
          className="w-full p-2 text-sm bg-gray-100 rounded-md"
          defaultValue={0}
        >
          <option hidden>성별</option>
        </select>
        <div className="flex flex-row w-full space-x-2">
          <select
            className="flex-grow p-2 text-sm bg-gray-100 rounded-md"
            defaultValue={0}
          >
            <option hidden>출생 연도</option>
          </select>
          <select
            className="flex-grow p-2 text-sm bg-gray-100 rounded-md"
            defaultValue={0}
          >
            <option hidden>월</option>
          </select>
          <select
            className="flex-grow p-2 text-sm bg-gray-100 rounded-md"
            defaultValue={0}
          >
            <option hidden>일</option>
          </select>
        </div>
      </div>
      <button className="w-full py-2 bg-gray-300 rounded-md text-m">
        다음
      </button>
    </div>
  );
}
