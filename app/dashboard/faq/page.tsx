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
        question: "노트북에서만 사용할 수 있나요?",
        answer: "네, 현재는 노트북이나 태블릿 기기 사용만 지원합니다.",
      },
      {
        question: "인터뷰 주제는 몇 개로 구성되어 있나요?",
        answer: "인터뷰 주제는 현재 8개로 구성되어 있고 주기적으로 추가될 예정입니다. (2025.04.06 기준)",
      },
      {
        question: "인터뷰는 몇개의 질문으로 구성되어 있나요?",
        answer: "하나의 주제는 6~9개 사이의 질문으로 구성되어 있습니다.",
      },
      {
        question: "인터뷰 전에 미리 질문을 받을 수 있나요?",
        answer: "인터뷰 시작 3일 전에 미리 전체 질문을 전달드립니다. 인터뷰 예약이 아닌 바로 시작하는 경우에도 카카오톡 채널을 통해 바로 확인하실 수 있습니다.",
      },
      {
        question: "원하는 질문만 골라서 답변할 수도 있나요?",
        answer: "네. 제시된 질문 중에서 원하는 질문만 선택하여 답변하실 수 있습니다.",
      },
      {
        question: "인터뷰 길이는 어느 정도인가요?",
        answer: "일반적으로 5~15분 내외로 진행되지만 인터뷰에서 따로 시간을 제한하지 않습니다. 더 많은 이야기를 하고 싶다면 원하는 만큼 충분히 진행하시면 됩니다.",
      },
      {
        question: "영상이나 개인정보는 안전하게 보호되나요?",
        answer: "네. 업로드된 모든 영상은 이용자분이 설정한 비밀번호를 통해 암호화되며, 외부에 공개되지 않습니다. 개인정보 보호법 등 관련 법규를 준수하고 있으며, 엄격한 접근 권한 관리와 보안 체계를 갖추고 있습니다.",
      },
      {
        question: "녹화 영상은 어디에 저장되나요?",
        answer: "인터뷰가 끝나면 QR 코드로 다운로드하실 수 있도록, 녹화 직후 3시간 동안 오브 클라우드에 암호화되어 보관됩니다. 이후 자동으로 삭제되며, 추후에는 희망하시는 분들께 영상을 장기간 보관할 수 있는 서비스를 제공할 계획입니다.",
      },
      {
        question: "오류 신고는 어디서 하나요?",
        answer: "좌측 하단의 '1:1 문의'를 통해 오류 내용을 남겨주시면 확인 후 신속하게 안내해 드리겠습니다.",
      },
      {
        question: "이외에 문의 사항은 어디로 연락하면 되나요?",
        answer: "좌측 하단의 1:1 문의를 통해 문의 사항을 남겨주시면 빠른 시일 내에 답변 드리겠습니다.",
      },
    ];
  
    return faqData;
  }
  