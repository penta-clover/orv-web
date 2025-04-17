import { useEffect, useRef, useState } from "react";
import audioContext from "../audioContext";
import { getPermissionGuideText } from "../../(components)/getPermissionGuideText";
import usePermissionReload from "../../(components)/usePermissionReload";

export default function MicIndicator(props: {
  width: number;
  height: number;
  interval?: number;
}) {
  const { width, height, interval = 100 } = props;

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [indicateInterval, setIndicateInterval] =
    useState<NodeJS.Timeout | null>(null);
  const [value, setValue] = useState<number>(0);

  // 권한 허용되면 새로고침
  usePermissionReload("microphone");
  usePermissionReload("camera");

  useEffect(() => {
    if (typeof window !== "undefined" && navigator.mediaDevices) {

      // 마이크 권한 요청
      const enableMicrophone = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: false,
            audio: true,
          });

          setStream(stream);

          const { analyser, bufferLength, dataArray } = audioContext(stream);
          setIndicateInterval(
            setInterval(() => {
              analyser.getByteFrequencyData(dataArray);
              const value =
                dataArray.reduce((acc, curr) => acc + curr, 0) / bufferLength;
              setValue(value);
            }, interval)
          );
        } catch (error) {
          alert(getPermissionGuideText());
        }
      };

      enableMicrophone();

      return () => {
        stream?.getTracks().forEach((track) => track.stop());
        if (indicateInterval) {
          clearInterval(indicateInterval);
        }
      };
    }
  }, []);

  return (
    <Graph
      width={width}
      height={height}
      value={value}
      interval={interval}
      sensitivity={2}
    />
  );
}

function Graph(props: {
  width: number;
  height: number;
  value: number;
  interval: number;
  sensitivity?: number;
}) {
  const { width, height, value, interval, sensitivity = 1 } = props;
  const redLinePosition = height * 0.7;
  const blueLinePosition = height * 0.3;
  const volumeHeight = Math.min(height, (height * value * sensitivity) / 100);

  return (
    <div
      className="bg-grayscale-700 rounded-[12px] relative overflow-hidden"
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      <div
        className="h-[2px] w-full bg-system-error absolute z-10"
        style={{ top: `${redLinePosition}px` }}
      ></div>
      <div
        className="h-[2px] w-full bg-system-info absolute z-10"
        style={{ top: `${blueLinePosition}px` }}
      ></div>
      <div
        className="w-full bg-grayscale-100 absolute bottom-0 transition-height ease-linear"
        style={{
          height: `${volumeHeight}px`,
          transitionDuration: `${interval}ms`,
        }}
      ></div>
    </div>
  );
}

/**
 * @deprecated use Graph instead
 */
function CanvasGraph(props: {
  width: number;
  height: number;
  value: number;
  sensitivity?: number;
}) {
  const { width, height, value, sensitivity = 1 } = props;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 해상도에 따른 Scale 조정
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio;
    ctx.scale(dpr, dpr);
  }, []);

  // 그래프 그리기
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    const heightValue =
      canvas.height - (canvas.height * value * sensitivity) / 100;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#383842";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#E6E6EA";
    ctx.fillRect(0, Math.max(heightValue, 0), canvas.width, canvas.height);

    ctx.beginPath();
    ctx.moveTo(0, canvas.height * 0.3);
    ctx.lineTo(canvas.width, canvas.height * 0.3);
    ctx.strokeStyle = "#127CF4";
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, canvas.height * 0.7);
    ctx.lineTo(canvas.width, canvas.height * 0.7);
    ctx.strokeStyle = "#F01F1F";
    ctx.stroke();
  }, [value]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ width: `${width}px`, height: `${height}px` }}
    />
  );
}
