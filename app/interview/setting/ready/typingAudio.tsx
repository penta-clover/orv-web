"use client";
import {
  useEffect,
  useImperativeHandle,
  useRef,
  forwardRef,
  useState,
} from "react";

const TypingAudio = forwardRef((props, ref) => {
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
          setVolume(0.4); // AirPods일 경우 볼륨을 낮춤
        } else {
          setVolume(0.75);
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
    const audio = new Audio(
      "https://d3bdjeyz3ry3pi.cloudfront.net/static/audios/keyboard-typing.mp3"
    );
    audio.volume = 0.75;
    audioRef.current = audio;

    // 오디오가 끝나면 처음부터 재생하는 핸들러
    const handleEnded = () => {
      audio.currentTime = 0;
      audio.play().catch((err) => console.log("오디오 재생 에러:", err));
    };

    audio.addEventListener("ended", handleEnded);

    // 컴포넌트 마운트 시 자동 재생 (브라우저 정책에 따라 사용자 인터랙션 필요)
    audio.play().catch((err) => console.log("오디오 재생 에러:", err));

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
        audioRef.current
          .play()
          .catch((err) => console.log("오디오 재생 에러:", err));
      }
    },
  }));

  return null;
});

export default TypingAudio;
