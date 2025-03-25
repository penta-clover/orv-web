import Image from "next/image";

export default function CompletePopup(props: {
  onClickClose: () => void;
  topicName: string;
  scheduledAt: Date;
}) {
  return (
    <div className="flex flex-col w-[546px] h-[349px] bg-grayscale-800 rounded-[16px] p-[24px]">
      <span className="text-head1 text-grayscale-white">
        예약이 확정되었어요
      </span>
      <span className="text-body2 text-grayscale-300">
        아래의 예약 정보를 확인해주세요
      </span>

      <div className="h-[25px]" />

      <Item label="주제" value={props.topicName} />

      <div className="h-[7px]" />

      <Item
        label="촬영 일시"
        value={formatDate(props.scheduledAt)}
      />

      <div className="h-[7px]" />

      <Item label="질문 공개" value="인터뷰 진행 3일 전" />

      <div className="h-[29px]" />

      <div className="text-grayscale-300 text-caption1">
        *추가로 궁금한 점이 있으시면 언제든 고객센터로 문의해주세요.
      </div>

      <Image
        src="/icons/x-grayscale-300.svg"
        alt="cancel"
        width={24}
        height={24}
        className="absolute top-[16px] right-[16px] rounded"
        onClick={props.onClickClose}
      />
    </div>
  );
}

function Item(props: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-start justify-center w-full h-[48px]">
      <span className="text-body4 text-grayscale-400">{props.label}</span>
      <span className="text-head3 text-grayscale-white">{props.value}</span>
    </div>
  );
}

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // 0부터 시작하므로 +1
  const day = date.getDate();
  const weekdays = [
    "일요일",
    "월요일",
    "화요일",
    "수요일",
    "목요일",
    "금요일",
    "토요일",
  ];
  const weekday = weekdays[date.getDay()];

  // 시간 처리 (24시간 -> 12시간 변환)
  let hour = date.getHours();
  const minute = date.getMinutes();
  const period = hour < 12 ? "오전" : "오후";
  hour = hour % 12;
  if (hour === 0) hour = 12;

  // 분은 항상 두 자리
  const minuteStr = minute.toString().padStart(2, "0");

  return `${year}년 ${month}월 ${day}일 ${weekday} ${period} ${hour}시 ${minuteStr}분`;
}
