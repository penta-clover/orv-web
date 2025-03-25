export default function NewbiewGuidePopup(props: {
  onClickReservation: () => void;
  onClickStart: () => void;
}) {
  return (
    <div className="w-[952px] h-[438px] flex flex-col items-center p-[24px] bg-grayscale-900">
      <span className="text-head2 text-grayscale-50">
        원하는 방식으로 시작하세요
      </span>

      <div className="h-[8px]" />

      <span className="text-body2 text-grayscale-300">
        지금 바로 진행하거나 예약을 통해 편리한 시간을 선택하세요.
      </span>

      <div className="h-[24px]" />

      <div className="w-full h-[302px] flex flex-row gap-[24px]">
        <div className="flex flex-col items-start w-full h-[302px] bg-grayscale-800 rounded-[14px] p-[24px]">
          <span className="text-head3 text-grayscale-50">인터뷰 예약하기</span>

          <div className="h-[8px]" />

          <span className="text-body2 text-grayscale-300">
            원하는 시간에 인터뷰를 예약해서 진행할 수 있어요.
            <br />
            인터뷰를 예약하며 기다리는 동안 보다 정돈된 인터뷰를
            <br />
            준비할 수 있으며 질문을 미리 보고 생각해볼 수 있어요.
            <br />
            <br />
            확신을 가지고 나의 모습을 남기고 싶은 분들에게 추천 드려요.
            <br />
          </span>

          <div className="grow" />

          <button
            className="w-[343px] h-[56px] bg-grayscale-50 rounded-[12px] text-grayscale-800 text-head3 justify-self-end self-center"
            onClick={props.onClickReservation}
          >
            인터뷰 예약하기
          </button>
        </div>

        <div className="w-full h-[302px] flex flex-row gap-[24px]">
          <div className="flex flex-col items-start w-full h-[302px] bg-grayscale-800 rounded-[14px] p-[24px]">
            <span className="text-head3 text-grayscale-50">지금 시작하기</span>

            <div className="h-[8px]" />

            <span className="text-body2 text-grayscale-300">
              지금 당장 인터뷰를 시작할 수 있어요. 바로 인터뷰를 하게 되면
              즉흥적이고 솔직한 스스로의 모습을 마주하고 기록할 수 있어요.
              <br />
              <br />
              보다 솔직한 나의 생각과 모습이 궁금하다면 추천 드려요.
              <br />
            </span>

            <div className="grow" />

            <button
              className="w-[343px] h-[56px] bg-main-lilac50 rounded-[12px] text-grayscale-800 text-head3 justify-self-end self-center"
              onClick={props.onClickReservation}
            >
              지금 시작하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
