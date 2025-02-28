import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import AutoScroll from "embla-carousel-auto-scroll";
import Image from "next/image";

export default function VideoCarousel(props: { referralCode?: string }) {
  const images: { referral: string; src: string }[] = [
    {
      referral: "JH",
      src: "/images/landing-demo-jh.jpg",
    },
    {
      referral: "HJ",
      src: "/images/landing-demo-hj.jpg",
    },
    {
      referral: "JM",
      src: "/images/landing-demo-jm.jpg",
    },
    {
      referral: "JS",
      src: "/images/landing-demo-js.jpg",
    },
    {
      referral: "GA",
      src: "/images/landing-demo-ga.jpg",
    },
  ];

  // props로 주어진 referral code와 동일한 referral을 가진 이미지 제외
  const filteredImages = images.filter(
    (image) => image.referral !== props.referralCode
  );

  return (
    <div className="flex flex-col gap-[32px]">
      <Carousel
        opts={{
          align: "center",
          loop: true,
        }}
        plugins={[
          AutoScroll({
            speed: 0.8,
          }),
        ]}
      >
        <CarouselContent className="flex">
          {filteredImages.map((image, index) => (
            <CarouselItem
              key={index}
              className="w-[256px] h-[152px] p-0 mx-[4px] basis-auto"
            >
              <Image
                src={image.src}
                width={256}
                height={152}
                alt="card"
                className="rounded"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <div className="flex flex-col items-center">
        <div className="text-white text-body2">
          한번의 인터뷰가 마무리되면 그날의 영상을
        </div>
        <div className="text-white text-body2">바로 QR로 받아볼 수 있어요</div>
      </div>
    </div>
  );
}
