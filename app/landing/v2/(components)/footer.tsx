export default function Footer() {
  //개인정보 처리방침 url
  const privacyUrl =
    "https://cac.notion.site/1a2bfb0d0b4e80c0a034df3ac3b8ae09?pvs=4";
  // 이용약관 url
  const termsUrl =
    "https://cac.notion.site/1a3bfb0d0b4e80d4bdd4d08fc30ccc96?pvs=73";

  return (
    <div className="flex flex-row justify-center items-start w-full h-[185px] pt-[22.25px] bg-grayscale-900">
      <div className="flex flex-row items-center font-medium text-[11px] leading-[22px] text-grayscale-500">
        <div
          onClick={() => {
            window.open(privacyUrl, "_blank");
          }}
        >
          개인 정보 처리 방침&nbsp;
        </div>
        ㅣ
        <div
          onClick={() => {
            window.open(termsUrl, "_blank");
          }}
        >
          &nbsp;서비스 이용 약관&nbsp;
        </div>
        <div>ⓒ 2025 Orv. All rights reserved.</div>
      </div>
    </div>
  );
}
