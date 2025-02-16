import Link from "next/link";

export default function Page() {
  // TODO: 이미 로그인 한 사람 처리
  return (
    <div className="flex flex-col items-center max-w-[450px] h-screen mx-auto py-10 px-5 space-y-4">
      <h1 className="text-2xl font-extrabold">로그인</h1>
      <Link
        href="https://api.orv.im/api/v0/auth/login/kakao"
        className="w-full py-2 text-center bg-gray-300 rounded-md text-m"
      >
        카카오로 빠르게 시작하기
      </Link>
      <Link
        href="https://api.orv.im/api/v0/auth/login/google"
        className="w-full py-2 text-center bg-gray-300 rounded-md text-m"
      >
        Google로 계속하기
      </Link>
    </div>
  );
}
