import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Image from "next/image";

export default function HowSection() {
  const images = [
    "https://d3bdjeyz3ry3pi.cloudfront.net/static/images/interview-how-1.jpg",
    "https://d3bdjeyz3ry3pi.cloudfront.net/static/images/interview-how-2.jpg",
    "https://d3bdjeyz3ry3pi.cloudfront.net/static/images/interview-how-3.jpg",
    "https://d3bdjeyz3ry3pi.cloudfront.net/static/images/interview-how-4.jpg",
  ];
  return (
    <div className="flex flex-col items-center w-full">
      <span className="text-head1 text-grayscale-white">
        오브에서 당신을 인터뷰하는 방법
      </span>
      <div className="h-[37px]" />
      <div className="h-[170px] w-full">
        <Carousel
          opts={{
            align: "center",
          }}
          className="w-full"
        >
          <CarouselContent className="flex px-[16px]">
            {images.map((image, index) => (
              <CarouselItem
                key={index}
                className={`w-[302.14px] h-[170px] p-0 ml-[16px] basis-auto ${index === 3 ? "mr-[16px]": ""}`}
              >
                <Image unoptimized 
                  src={image}
                  width={302.14}
                  height={170}
                  alt="card"
                  className="rounded-[5.71px]"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
}
