"use client";

import { use, useEffect, useRef, useState } from "react";

export default function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [volume, setVolume] = useState(0); // 기본 볼륨 설정

  useEffect(() => {
    navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => {
        const audioOutputs = devices.filter(
          (device) => device.kind === "audiooutput"
        );
        // 감지할 키워드 목록 (소문자로 변환하여 비교)
        const keywords = [
          // Apple AirPods 계열
          "airpod",
          // Samsung Galaxy Buds 계열
          "galaxy buds",
          // Sony 이어폰 제품 라인
          "wf-1000xm",
          "wf-c500",
          "wf-c700n",
          // Bose 이어폰 제품 라인
          "quietcomfort",
          // Jabra 이어폰 제품 라인
          "elite",
          // Beats 이어폰 제품 라인
          "studio buds",
          "solo buds",
          "fit pro",
          "powerbeats pro",
          // Sennheiser 이어폰 제품 라인
          "momentum",
          // Nothing 이어폰 제품 라인
          "nothing ear",
          // Huawei 이어폰 제품 라인
          "freebuds",
          // 기타 무선 이어폰
          "wireless",
        ];

        // 오디오 출력 장치 라벨 중 하나라도 키워드를 포함하면 true
        const isMono = audioOutputs.some((device) =>
          keywords.some((keyword) =>
            device.label.toLowerCase().includes(keyword)
          )
        );

        console.log(isMono);
        if (isMono) {
          setVolume(0.1); // AirPods일 경우 볼륨을 낮춤
        } else {
          setVolume(0.5);
        }
      })
      .catch((error) => console.error("장치 검색 에러:", error));
  }, []);

  useEffect(() => {
    if (audioRef && audioRef.current) {
      audioRef.current.volume = volume; // 볼륨 설정
    }
  }, [audioRef, volume]);

  useEffect(() => {
    let currentTrack = 1;
    const totalTracks = 6;
    const audio = new Audio(
      `https://d3bdjeyz3ry3pi.cloudfront.net/static/audios/interview-audio-${currentTrack}.mp3`
    );

    audioRef.current = audio;

    audio.volume = volume; // 필요에 따라 볼륨 조정

    const handleEnded = () => {
      currentTrack = currentTrack === totalTracks ? 1 : currentTrack + 1;
      audio.src = `https://d3bdjeyz3ry3pi.cloudfront.net/static/audios/interview-audio-${currentTrack}.mp3`;
      audio.play().catch((err) => console.log("오디오 재생 에러:", err));
    };

    audio.addEventListener("ended", handleEnded);

    // 페이지에 들어오면 첫 트랙 재생
    audio.play().catch((err) => console.log("오디오 재생 에러:", err));

    return () => {
      audio.pause();
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  return null;
}
