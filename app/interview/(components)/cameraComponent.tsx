"use client";

import React, { useEffect, useImperativeHandle, useRef } from "react";
import Image from "next/image";

interface CameraComponentProps {
  filter?: Filter;
  afterDraw?: (ctx: CanvasRenderingContext2D) => void;
}

const CAMERA_FPS = 24;
const FRAME_INTERVAL = 1000 / CAMERA_FPS;

// WebGL 셰이더
const vertexShaderSource = `
  attribute vec2 a_position;
  attribute vec2 a_texCoord;
  varying vec2 v_texCoord;
  void main() {
    gl_Position = vec4(a_position, 0, 1);
    v_texCoord = a_texCoord;
  }
`;

const fragmentShaderSource = `
  precision mediump float;
  uniform sampler2D u_image;
  uniform float u_brightness;
  uniform float u_contrast;
  uniform float u_saturation;
  varying vec2 v_texCoord;
  
  void main() {
    vec4 color = texture2D(u_image, v_texCoord);
    vec3 rgb = color.rgb;
    
    // 1. 밝기 적용
    rgb = rgb * u_brightness;
    
    // 2. 대비 적용
    rgb = (rgb - 0.5) * u_contrast + 0.5;
    
    // 3. 채도 적용
    float gray = dot(rgb, vec3(0.299, 0.587, 0.114));
    rgb = mix(vec3(gray), rgb, u_saturation);
    
    // 0~1 범위로 클램핑
    rgb = clamp(rgb, 0.0, 1.0);
    
    gl_FragColor = vec4(rgb, color.a);
  }
`;

// WebGL 유틸리티 함수들
function createShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) throw new Error("Failed to create shader");

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("Shader compilation error:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

function createProgram(gl: WebGLRenderingContext) {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = createShader(
    gl,
    gl.FRAGMENT_SHADER,
    fragmentShaderSource
  );

  if (!vertexShader || !fragmentShader) return null;

  const program = gl.createProgram();
  if (!program) throw new Error("Failed to create program");

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("Program linking error:", gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }

  return program;
}

// 필터 설정을 WebGL uniform으로 변환하는 함수
// 나중에 RGB 기준이든, Convolution Matrix든 변경할 수 있음
// 일단 밝기, 채도, 대비 사용
function getFilterUniforms(filter: Filter) {
  switch (filter) {
    case "bright":
      return {
        brightness: 1.2,
        contrast: 1.0,
        saturation: 1.0,
      };
    case "monotone": {
      return {
        brightness: 1.1,
        contrast: 0.9,
        saturation: 0.0,
      };
    }
    case "natural":
      return {
        brightness: 1.05,
        contrast: 1.05,
        saturation: 1.0,
      };
    case "soft":
      return {
        brightness: 1.1,
        contrast: 0.85,
        saturation: 1.1,
      };
    case "lark":
      return {
        brightness: 1.15,
        contrast: 0.95,
        saturation: 0.8,
      };
    case "grayscale":
      return {
        brightness: 1.0,
        contrast: 1.0,
        saturation: 0.0,
      };
    case "warm":
      return {
        brightness: 1.1,
        contrast: 1.0,
        saturation: 1.2,
      };
    case "cold":
      return {
        brightness: 0.9,
        contrast: 1.0,
        saturation: 0.8,
      };
    case "dark":
      return {
        brightness: 0.8,
        contrast: 1.0,
        saturation: 1.0,
      };
    default:
      return {
        brightness: 1.0,
        contrast: 1.0,
        saturation: 1.0,
      };
  }
}

// CameraComponent를 forwardRef로 감싸서 외부에서 canvas 엘리먼트를 참조할 수 있도록 합니다.
export const CameraComponent = React.forwardRef<
  HTMLCanvasElement,
  CameraComponentProps
>((props, ref) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewRef = useRef<HTMLCanvasElement>(null);
  const setTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const currentFilterRef = useRef<Filter | undefined>(props.filter);
  const afterDrawRef = useRef<
    ((ctx: CanvasRenderingContext2D) => void) | undefined
  >(props.afterDraw);
  const overlayRef = useRef<HTMLImageElement | null>(null);

  useImperativeHandle(ref, () => canvasRef.current as HTMLCanvasElement);

  // 값 변경시마다 ref 업데이트
  useEffect(() => {
    currentFilterRef.current = props.filter;
  }, [props.filter]);

  useEffect(() => {
    afterDrawRef.current = props.afterDraw;
  }, [props.afterDraw]);

  useEffect(() => {
    const img = new window.Image();
    img.src = "/images/studio-lighting-fhd.png";
    img.onload = () => {
      overlayRef.current = img;
    };
  }, []);

  // 카메라 설정
  useEffect(() => {
    let stream: MediaStream | null = null;
    if (typeof window !== "undefined" && navigator.mediaDevices) {
      const enableCamera = async () => {
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: {
              // HD 해상도 적용
              width: { ideal: 1280 },
              height: { ideal: 720 },
            },
            audio: true,
          });
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
        } catch (error) {
          console.error("카메라를 활성화하는 도중 에러 발생:", error);
        }
      };

      enableCamera();
    }

    // cleanup: 컴포넌트 unmount 시 스트림의 트랙 종료
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = null;
      }
    };
  }, []);

  // 캔버스 설정
  useEffect(() => {
    const video = localVideoRef.current;
    const canvas = canvasRef.current;
    const preview = previewRef.current;

    if (!video || !canvas || !preview) return;

    // WebGL 컨텍스트 초기화 (preview 캔버스에서)
    const gl = preview.getContext("webgl");
    if (!gl) {
      console.error("WebGL not supported");
      return;
    }

    // WebGL 프로그램 생성
    const program = createProgram(gl);
    if (!program) {
      console.error("Failed to create WebGL program");
      return;
    }

    // 버퍼 초기화
    const positionBuffer = gl.createBuffer();
    const texCoordBuffer = gl.createBuffer();
    if (!positionBuffer || !texCoordBuffer) {
      console.error("Failed to create buffers");
      return;
    }

    // 정점 데이터 설정
    const positions = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const texCoords = new Float32Array([0, 1, 1, 1, 0, 0, 1, 0]);

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, texCoords, gl.STATIC_DRAW);

    // 텍스처 초기화
    const texture = gl.createTexture();
    if (!texture) {
      console.error("Failed to create texture");
      return;
    }

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    // 비디오 크기가 변경될 때만 캔버스 크기 조정
    let lastVideoWidth = 0;
    let lastVideoHeight = 0;

    const updateCanvasSize = () => {
      if (
        video.videoWidth !== lastVideoWidth ||
        video.videoHeight !== lastVideoHeight
      ) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        preview.width = video.videoWidth;
        preview.height = video.videoHeight;
        lastVideoWidth = video.videoWidth;
        lastVideoHeight = video.videoHeight;
      }
    };

    const drawFrame = () => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        updateCanvasSize();

        // WebGL 렌더링
        gl.viewport(0, 0, preview.width, preview.height);
        gl.useProgram(program);

        // 버퍼 바인딩
        const positionLocation = gl.getAttribLocation(program, "a_position");
        const texCoordLocation = gl.getAttribLocation(program, "a_texCoord");

        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
        gl.enableVertexAttribArray(texCoordLocation);
        gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);

        // 텍스처 업데이트
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGBA,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          video
        );

        // 필터 uniform 설정
        const currentFilter = currentFilterRef.current;
        const uniforms = getFilterUniforms(currentFilter || "default");

        const brightnessLocation = gl.getUniformLocation(
          program,
          "u_brightness"
        );
        const contrastLocation = gl.getUniformLocation(program, "u_contrast");
        const saturationLocation = gl.getUniformLocation(
          program,
          "u_saturation"
        );

        gl.uniform1f(brightnessLocation, uniforms.brightness);
        gl.uniform1f(contrastLocation, uniforms.contrast);
        gl.uniform1f(saturationLocation, uniforms.saturation);

        // 그리기
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        // 오버레이와 자막 그리기
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(preview, 0, 0, preview.width, preview.height);
          if (overlayRef.current) {
            ctx.drawImage(
              overlayRef.current,
              0,
              0,
              canvas.width,
              canvas.height
            );
          }

          // 자막 그리기
          if (afterDrawRef.current) {
            afterDrawRef.current(ctx);
          }
        }
      }

      setTimeoutRef.current = setTimeout(drawFrame, FRAME_INTERVAL);
    };

    video.onloadedmetadata = () => {
      drawFrame();
    };

    return () => {
      if (setTimeoutRef.current) {
        clearTimeout(setTimeoutRef.current);
      }
      if (gl) {
        gl.deleteProgram(program);
        gl.deleteBuffer(positionBuffer);
        gl.deleteBuffer(texCoordBuffer);
        gl.deleteTexture(texture);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      <div
        className="absolute inset-0 z-10"
        style={{ transform: "scaleX(-1)" }}
      >
        <Image
          unoptimized
          src="https://d3bdjeyz3ry3pi.cloudfront.net/static/images/studio-lighting.png"
          fill
          alt="studio-lighting"
        />
      </div>
      <video
        ref={localVideoRef}
        autoPlay
        playsInline
        muted
        style={{
          width: "0",
          height: "0",
          position: "absolute",
          opacity: "0",
          pointerEvents: "none",
        }}
      />
      <canvas
        ref={canvasRef}
        style={{
          width: "0",
          height: "0",
          position: "absolute",
          opacity: "0",
          pointerEvents: "none",
        }}
      />
      <canvas
        ref={previewRef}
        style={{
          width: "100%",
          aspectRatio: "16/9",
          objectFit: "cover",
          maxHeight: "100%",
        }}
      />
    </div>
  );
});
