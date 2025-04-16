import { Video } from "@/domain/model/Video";
import { cn } from "@/lib/utils";
import Image from "next/image";
import DragScroll from "react-indiana-drag-scroll";


export default function VideoList(props: {title: string, videos: Video[] |  null, titleClassName?: string, listClassName?: string}) {

  if (props.videos === null) {
    return;
  }

  return (
    <div className="flex flex-col">
      <span className={`text-grayscale-100 ${cn("text-head3 ml-[40px] mb-[12px]", props.titleClassName)}`}>
        {props.title}
      </span>
      <DragScroll className={cn("flex flex-row px-[40px] gap-[12px] overflow-scroll hide-scrollbar", props.listClassName)} style={{ overflowX: "scroll" }}>
        {props.videos.map((video) => (
          <div key={video.id} className="flex flex-col w-[320px] h-[236px]">
            <div className="relative w-[320px] h-[180px] mb-[8px]">
              <Image
                unoptimized
                src={video.thumbnailUrl}
                width={320}
                height={180}
                alt="video thumbnail"
                className="w-full h-[180px] rounded-[8.32px]"
                style={{ objectFit: "cover" }}
              />
              <span className="absolute bottom-[8px] right-[6px] h-[22px] w-[54px] bg-grayscale-900 text-grayscale-300 rounded-[24px] text-center text-caption1">
                {(video.runningTime / 60).toFixed(0).padStart(2, "0")}:
                {(video.runningTime % 60).toFixed(0).padStart(2, "0")}
              </span>
            </div>

            <div className="flex flex-col items-start w-[320px] h-[48px]">
              <span className="text-grayscale-100 text-head4">
                {video.title}
              </span>
              <span className="text-grayscale-500 text-caption1">
                {formatDate(video.createdAt)}
              </span>
            </div>
          </div>
        ))}
      </DragScroll>
    </div>
  );
}

function formatDate(input: string | Date) {
  const date = new Date(input);
  const year = date.getFullYear();
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const day = ("0" + date.getDate()).slice(-2);
  return `${year}.${month}.${day}`;
}