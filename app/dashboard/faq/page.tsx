import FAQ from "./faq";
import "@/app/components/blackBody.css"

// 애니메이션 Variants 설정
const stepVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: custom, duration: 0.5 },
  }),
};

export default function Page() {
  return (
    <div className="relative text-grayscale-white w-full h-full pt-[78px] overflow-scroll hide-scrollbar">
      <h1 className="text-2xl font-bold text-head0 mx-[40px] mb-[24px]">
        자주 묻는 질문
      </h1>

      <div className="mx-[40px] w-full max-w-[500px]">
        <FAQ faqData={getFAQData()} />
      </div>

      <div className="h-[24px]" />

      <div className="h-[48.2px] ml-[40px] text-body2 flex items-center">1:1 문의가 필요하시면 좌측의 "1:1문의"를 클릭해주세요.</div>
    </div>
  );
}


function getFAQData() {
    const faqData = [
      {
        question: "인터뷰는 몇개의 질문으로 구성되어 있나요?",
        answer: "하나의 주제는 7~9개 사이의 질문으로 구성되어 있습니다.",
      },
      {
        question: "원하는 질문만 골라서 답변할 수도 있나요?",
        answer:
          "네. 제시된 질문 중에서 원하는 질문만 선택하여 답변하실 수 있습니다.",
      },
      {
        question: "노트북, 스마트폰, 태블릿 모두 사용할 수 있나요?",
        answer:
          "네, 웹캠이나 카메라가 탑재된 기기라면 문제없이 이용하실 수 있습니다. 하지만 노트북이나 태블릿 기기 사용을 권해드리고 있습니다.",
      },
      {
        question: "녹화 영상은 어디에 저장되나요?",
        answer:
          "인터뷰가 끝나면 QR 코드로 다운로드하실 수 있도록, 녹화 직후 1시간 동안 오브 클라우드에 암호화되어 보관됩니다. 이후 자동으로 삭제되며, 추후에는 희망하시는 분들께 영상을 장기간 보관할 수 있는 서비스를 제공할 계획입니다.",
      },
      {
        question: "이외에 문의 사항은 어디로 연락하면 되나요?",
        answer:
          "본 페이지 하단의 1:1 문의를 통해 문의 사항을 남겨주시면 빠른 시일 내에 답변 드리겠습니다.",
      },
    ];
  
    return faqData;
  }
  