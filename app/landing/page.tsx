'use client';

import { useRef } from 'react';
import ActionBar from './actionBar';
import { useRouter } from 'next/navigation';
import EndingComment from './endingComment';

export default function Page() {
  const videoRef = useRef(null);
  const router = useRouter();

  // 영상 재생 종료 시 화면 아래로 스크롤
  const handleVideoEnd = () => {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
  };

  return (
    <div className='relative bg-[#151818]'>
      <div className='absolute top-0 w-full'>
        <ActionBar />
      </div>
      <div className="w-screen h-[calc(100dvh)] flex justify-center items-center">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          onEnded={handleVideoEnd}
          className="w-full block"
        >
          <source src="videos/landing-video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      <EndingComment />

      <button onClick={() => router.push("/landing/registration/step1")}>지금 신청하기</button>
    </div>
  );
}
