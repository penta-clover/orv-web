"use client";
import { useEffect, useImperativeHandle, useRef, forwardRef } from "react";

const TypingAudio = forwardRef((props, ref) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio("https://d3bdjeyz3ry3pi.cloudfront.net/static/audios/keyboard-typing.mp3");
    audio.volume = 1.0;
    audioRef.current = audio;

    // 오디오가 끝나면 처음부터 재생하는 핸들러
    const handleEnded = () => {
      audio.currentTime = 0;
      audio.play().catch((err) => console.error("오디오 재생 에러:", err));
    };

    audio.addEventListener("ended", handleEnded);

    // 컴포넌트 마운트 시 자동 재생 (브라우저 정책에 따라 사용자 인터랙션 필요)
    audio.play().catch((err) => console.error("오디오 재생 에러:", err));

    return () => {
      audio.pause();
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  // 외부에서 stopAudio, playAudio 함수를 호출할 수 있게 노출
  useImperativeHandle(ref, () => ({
    stopAudio: () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    },
    playAudio: () => {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch((err) => console.error("오디오 재생 에러:", err));
      }
    },
  }));

  return null;
});

export default TypingAudio;