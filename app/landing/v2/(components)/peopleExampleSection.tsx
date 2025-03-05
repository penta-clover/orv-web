import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import AutoScroll from "embla-carousel-auto-scroll";
import Image from "next/image";

export default function PeopleExampleSection(props: { referralCode?: string }) {
  const images: { referral: string; src: string }[] = [
    {
      referral: "JS",
      src: "/images/landing-demo-js.jpg",
    },
    {
      referral: "JM",
      src: "/images/landing-demo-jm.jpg",
    },
    {
      referral: "HJ",
      src: "/images/landing-demo-hj.jpg",
    },
    {
      referral: "GA",
      src: "/images/landing-demo-ga.jpg",
    },
    {
      referral: "HS",
      src: "/images/landing-demo-hs.jpg",
    },
    {
      referral: "ZZ",
      src: "/images/landing-demo-zz.jpg",
    },
    {
      referral: "JH",
      src: "/images/landing-demo-jh.jpg",
    },
  ];

  // props로 주어진 referral code와 동일한 referral을 가진 이미지 제외
  const filteredImages = images.filter(
    (image) => image.referral !== props.referralCode
  );

  return (
    <div className="flex flex-col items-center w-full">
      <div className="text-head1 text-grayscale-white flex flex-col items-center">
        <span>나 스스로를 마주하는 일</span>
        <span>많은 분들이 함께 하고 있어요</span>
      </div>

      <div className="h-[24px]" />

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
        className="w-full"
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
                className="rounded w-[256px] h-[152px]"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
