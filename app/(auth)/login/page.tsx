export default function Page() {
  return (
    <div className="flex flex-col items-center max-w-[450px] h-screen mx-auto py-10 px-5 space-y-4">
      <h1 className="text-2xl font-extrabold">로그인</h1>
      <button className="w-full py-2 bg-gray-300 rounded-md text-m">
        카카오로 빠르게 시작하기
      </button>
      <button className="w-full py-2 bg-gray-300 rounded-md text-m">
        Google로 계속하기
      </button>
    </div>
  );
}
