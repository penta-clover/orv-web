import { Reservation } from "@/domain/model/Reservation";
import { useReservationRepository } from "@/providers/ReservationRepositoryContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { before } from "node:test";
import { useEffect, useState } from "react";

export default function ReservationNotification() {
  const reservationRepository = useReservationRepository();
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [remainingTime, setRemainingTime] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const now = new Date(Date.now());
    const before2Hours = new Date(now.getTime() - 12 * 60 * 60 * 1000);

    reservationRepository.getForwardReservationsAfter(before2Hours).then((reservations) => {
      if (reservations !== null && reservations.length > 0) {
        const reservation = reservations[0];
        setReservation(reservation);
        
        // 예약 시간과 현재 시간의 차이를 계산 (시간 단위)
        const reservationTime = new Date(reservation.scheduledAt);
        const diffInHours = (now.getTime() - reservationTime.getTime()) / (1000 * 60 * 60);
        
        // 12시간 이내에 있는 예약인 경우에만 남은 시간 계산
        if (diffInHours >= 0 && diffInHours < 12) {
          setRemainingTime(12 - diffInHours);
        } else {
          setRemainingTime(null);
        }
      }
    });
  }, []);

  // 남은 시간에 따른 메시지 생성
  const getRemainingTimeMessage = () => {
    if (remainingTime === null) {
      return null;
    }
    
    const hoursLeft = Math.ceil(remainingTime);
    return `예정된 인터뷰가 있어요. 지금 진행하지 않으면 ${hoursLeft}시간 뒤 예약이 취소돼요`;
  };

  return (
    <div
      className={`flex items-center pl-[16px] bg-gd h-[56px] rounded-[16px] text-grayscale-800 flex items-center px-[18px] transition-all active:scale-95 ${
        reservation === null ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      onClick={() => {
        reservationRepository.changeInterviewReservationStatusAsDone(reservation?.id!);
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
        {remainingTime !== null
          ? getRemainingTimeMessage()
          : reservation?.scheduledAt === null 
            ? null 
            : formatInterviewDate(new Date(reservation?.scheduledAt!))}
      </span>

      <div className="flex items-center justify-end pl-[10px]">
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
