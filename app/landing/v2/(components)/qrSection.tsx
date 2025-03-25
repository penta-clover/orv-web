import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function QRSection(props: { referralCode?: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % filteredImages.length);
    }, 2000); // 1초마다 이미지 변경
    return () => clearInterval(interval);
  }, [props.referralCode]);

  const images = [
    {
      referral: "GA",
      src: "https://d3bdjeyz3ry3pi.cloudfront.net/static/images/landing-demo-ga.jpg",
      alt: "데모 이미지",
      className: "object-cover rounded-[8px]",
    },
    {
      referral: "GA",
      src: "https://d3bdjeyz3ry3pi.cloudfront.net/static/images/guide-qr-example.png", // QR 이미지 파일 경로로 변경하세요.
      alt: "QR 이미지",
      className: "object-contain p-[35px]",
    },
    {
      referral: "JS",
      src: "https://d3bdjeyz3ry3pi.cloudfront.net/static/images/landing-demo-js.jpg",
      alt: "데모 이미지",
      className: "object-cover rounded-[8px]",
    },
    {
      referral: "JS",
      src: "https://d3bdjeyz3ry3pi.cloudfront.net/static/images/guide-qr-example.png", // QR 이미지 파일 경로로 변경하세요.
      alt: "QR 이미지",
      className: "object-contain p-[35px]",
    },
    {
      referral: "JM",
      src: "https://d3bdjeyz3ry3pi.cloudfront.net/static/images/landing-demo-jm.jpg",
      alt: "데모 이미지",
      className: "object-cover rounded-[8px]",
    },
    {
      referral: "JM",
      src: "https://d3bdjeyz3ry3pi.cloudfront.net/static/images/guide-qr-example.png", // QR 이미지 파일 경로로 변경하세요.
      alt: "QR 이미지",
      className: "object-contain p-[35px]",
    },
    {
      referral: "HS",
      src: "https://d3bdjeyz3ry3pi.cloudfront.net/static/images/landing-demo-hs.jpg",
      alt: "데모 이미지",
      className: "object-cover rounded-[8px]",
    },
    {
      referral: "HS",
      src: "https://d3bdjeyz3ry3pi.cloudfront.net/static/images/guide-qr-example.png", // QR 이미지 파일 경로로 변경하세요.
      alt: "QR 이미지",
      className: "object-contain p-[35px]",
    },
  ];

  // props로 주어진 referral code와 동일한 referral을 가진 이미지 제외
  const filteredImages = images.filter(
    (image) => image.referral !== props.referralCode
  );

  return (
    <div className="flex flex-col items-center w-full">
      <div className="text-head1 text-grayscale-white flex flex-col items-center">
        <span>그리고 인터뷰가 끝나면 바로</span>
        <span>영상을 QR로 받아볼 수 있어요</span>
      </div>

      <div className="h-[24px]" />

      <div className="relative w-[270.2px] h-[152px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={filteredImages[currentIndex].src}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute top-0 left-0 w-full h-full"
          >
            <Image unoptimized 
              src={filteredImages[currentIndex].src}
              alt={filteredImages[currentIndex].alt}
              fill
              className={filteredImages[currentIndex].className}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="h-[18px]" />

      <div className="text-body4 text-grayscale-500">
        인터뷰 정리본도 함께 드려요
      </div>
    </div>
  );
}
