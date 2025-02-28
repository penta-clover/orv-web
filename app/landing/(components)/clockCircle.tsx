'use client';

import { useEffect, useRef } from "react";

export default function Page() {
  const ref = useRef(null);
  
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <style jsx>{`
        .old-scene,
        .new-scene {
          position: absolute;
          inset: 0; /* top: 0; right: 0; bottom: 0; left: 0; */
          display: flex;
          align-items: center;
          justify-content: center;
        }
        /* 새 화면: CSS 변수 --angle 를 0deg에서 360deg까지 애니메이션 */
        .new-scene {
          z-index: 10;
          --angle: 0deg;
          -webkit-mask-image: conic-gradient(
            from 0deg at 50% 50%,
            transparent 0deg var(--angle),
            black var(--angle) 360deg
          );
          mask-image: conic-gradient(
            from 0deg at 50% 50%,
            transparent 0deg var(--angle),
            black var(--angle) 360deg
          );
          animation: sweep 1s steps(100) forwards;
        }
        @keyframes sweep {
          0%   { --angle: 0deg; }
          1%   { --angle: 3.6deg; }
          2%   { --angle: 7.2deg; }
          3%   { --angle: 10.8deg; }
          4%   { --angle: 14.4deg; }
          5%   { --angle: 18.0deg; }
          6%   { --angle: 21.6deg; }
          7%   { --angle: 25.2deg; }
          8%   { --angle: 28.8deg; }
          9%   { --angle: 32.4deg; }
          10%  { --angle: 36.0deg; }
          11%  { --angle: 39.6deg; }
          12%  { --angle: 43.2deg; }
          13%  { --angle: 46.8deg; }
          14%  { --angle: 50.4deg; }
          15%  { --angle: 54.0deg; }
          16%  { --angle: 57.6deg; }
          17%  { --angle: 61.2deg; }
          18%  { --angle: 64.8deg; }
          19%  { --angle: 68.4deg; }
          20%  { --angle: 72.0deg; }
          21%  { --angle: 75.6deg; }
          22%  { --angle: 79.2deg; }
          23%  { --angle: 82.8deg; }
          24%  { --angle: 86.4deg; }
          25%  { --angle: 90.0deg; }
          26%  { --angle: 93.6deg; }
          27%  { --angle: 97.2deg; }
          28%  { --angle: 100.8deg; }
          29%  { --angle: 104.4deg; }
          30%  { --angle: 108.0deg; }
          31%  { --angle: 111.6deg; }
          32%  { --angle: 115.2deg; }
          33%  { --angle: 118.8deg; }
          34%  { --angle: 122.4deg; }
          35%  { --angle: 126.0deg; }
          36%  { --angle: 129.6deg; }
          37%  { --angle: 133.2deg; }
          38%  { --angle: 136.8deg; }
          39%  { --angle: 140.4deg; }
          40%  { --angle: 144.0deg; }
          41%  { --angle: 147.6deg; }
          42%  { --angle: 151.2deg; }
          43%  { --angle: 154.8deg; }
          44%  { --angle: 158.4deg; }
          45%  { --angle: 162.0deg; }
          46%  { --angle: 165.6deg; }
          47%  { --angle: 169.2deg; }
          48%  { --angle: 172.8deg; }
          49%  { --angle: 176.4deg; }
          50%  { --angle: 180.0deg; }
          51%  { --angle: 183.6deg; }
          52%  { --angle: 187.2deg; }
          53%  { --angle: 190.8deg; }
          54%  { --angle: 194.4deg; }
          55%  { --angle: 198.0deg; }
          56%  { --angle: 201.6deg; }
          57%  { --angle: 205.2deg; }
          58%  { --angle: 208.8deg; }
          59%  { --angle: 212.4deg; }
          60%  { --angle: 216.0deg; }
          61%  { --angle: 219.6deg; }
          62%  { --angle: 223.2deg; }
          63%  { --angle: 226.8deg; }
          64%  { --angle: 230.4deg; }
          65%  { --angle: 234.0deg; }
          66%  { --angle: 237.6deg; }
          67%  { --angle: 241.2deg; }
          68%  { --angle: 244.8deg; }
          69%  { --angle: 248.4deg; }
          70%  { --angle: 252.0deg; }
          71%  { --angle: 255.6deg; }
          72%  { --angle: 259.2deg; }
          73%  { --angle: 262.8deg; }
          74%  { --angle: 266.4deg; }
          75%  { --angle: 270.0deg; }
          76%  { --angle: 273.6deg; }
          77%  { --angle: 277.2deg; }
          78%  { --angle: 280.8deg; }
          79%  { --angle: 284.4deg; }
          80%  { --angle: 288.0deg; }
          81%  { --angle: 291.6deg; }
          82%  { --angle: 295.2deg; }
          83%  { --angle: 298.8deg; }
          84%  { --angle: 302.4deg; }
          85%  { --angle: 306.0deg; }
          86%  { --angle: 309.6deg; }
          87%  { --angle: 313.2deg; }
          88%  { --angle: 316.8deg; }
          89%  { --angle: 320.4deg; }
          90%  { --angle: 324.0deg; }
          91%  { --angle: 327.6deg; }
          92%  { --angle: 331.2deg; }
          93%  { --angle: 334.8deg; }
          94%  { --angle: 338.4deg; }
          95%  { --angle: 342.0deg; }
          96%  { --angle: 345.6deg; }
          97%  { --angle: 349.2deg; }
          98%  { --angle: 352.8deg; }
          99%  { --angle: 356.4deg; }
          100% { --angle: 360.0deg; }
        }

      `}</style>

      {/* 이전 화면(예시) */}
      <div className="old-scene bg-black">
        <h1 className="text-white text-3xl">당신을 인터뷰해도 될까요?</h1>
      </div>

      {/* 다음 화면(예시) - 마스크가 0~360도 회전하며 점점 드러남 */}
      <div className="new-scene bg-black">
        <h1 className="text-white text-3xl">누구도 나에게 해주지 않았던 질문에 답해주세요</h1>
      </div>
    </div>
  );
}

