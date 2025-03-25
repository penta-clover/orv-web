
export default function CircleNumber(props: { num: number }) {
    return (
      <div className="flex flex-col justify-center items-center w-[20px] h-[20px] m-[2px] rounded-full bg-main-lilac50 text-caption1 text-grayscale-black">
        {props.num}
      </div>
    );
  }