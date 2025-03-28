"use client";
import { useEffect } from "react";

export default function BackgroundMusic() {
  useEffect(() => {
    let currentTrack = 1;
    const totalTracks = 6;
    const audio = new Audio(`https://d3bdjeyz3ry3pi.cloudfront.net/static/audios/interview-audio-${currentTrack}.mp3`);
    audio.volume = 0.7; // 필요에 따라 볼륨 조정

    const handleEnded = () => {
      currentTrack = currentTrack === totalTracks ? 1 : currentTrack + 1;
      audio.src = `https://d3bdjeyz3ry3pi.cloudfront.net/static/audios/interview-audio-${currentTrack}.mp3`;
      audio.play().catch((err) =>
        console.error("오디오 재생 에러:", err)
      );
    };

    audio.addEventListener("ended", handleEnded);

    // 페이지에 들어오면 첫 트랙 재생
    audio.play().catch((err) =>
      console.error("오디오 재생 에러:", err)
    );

    return () => {
      audio.pause();
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  return null;
}
