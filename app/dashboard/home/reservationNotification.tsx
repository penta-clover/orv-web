import { Reservation } from "@/domain/model/Reservation";
import { useReservationRepository } from "@/providers/ReservationRepositoryContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ReservationNotification() {
  const reservationRepository = useReservationRepository();
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const router = useRouter();

  useEffect(() => {
    reservationRepository.getForwardReservations().then((reservations) => {
      if (reservations !== null && reservations.length > 0) {
        const reservation = reservations[0];
        setReservation(reservation);
      }
    });
  }, []);

  return (
    <div
      className={`flex items-center pl-[16px] bg-gd w-[580px] h-[56px] rounded-[16px] text-grayscale-800 flex items-center px-[18px] transition-all active:scale-95 ${
        reservation === null ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      onClick={() => {
        router.push(`/interview/guide?storyboardId=${reservation?.storyboardId}`);
      }}
    >
      <Image
        src="/icons/clock-grayscale-black.svg"
        alt="clock"
        width={24}
        height={24}
      />

      <span className="text-head3 text-grayscale-800 mx-[14px] grow">
        {/* // ex. 4월 9일 오후 11시 15분에 인터뷰가 예정되어 있어요 */}
        {reservation?.scheduledAt === null ? null : formatInterviewDate(new Date(reservation?.scheduledAt!))}
      </span>

      <div className="flex items-center justify-end">
        <span className="text-head4 text-grayscale-800">지금 시작하기</span>
        <Image
          src="/icons/right-arrow-grayscale-800.svg"
          alt="right arrow"
          width={24}
          height={24}
        />
      </div>
    </div>
  );
}

function formatInterviewDate(date: Date): string {
  const month = date.getMonth() + 1; // 0부터 시작하므로 +1
  const day = date.getDate();
  let hour = date.getHours();
  const minute = date.getMinutes();

  // 오전/오후 구분 및 12시간제 변환
  const period = hour < 12 ? "오전" : "오후";
  hour = hour % 12;
  if (hour === 0) hour = 12;

  // 분은 0이면 0분 그대로 출력 (예: 0분 -> "0분")
  return `${month}월 ${day}일 ${period} ${hour}시 ${minute}분에 인터뷰가 예정되어 있어요`;
}
