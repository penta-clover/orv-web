// 녹화 설정 관련
type Aspect = "frontal" | "whole" | "side" | "none";
type Filter =
  | "default"
  | "grayscale"
  | "warm"
  | "dark"
  | "bright"
  | "cold"
  | "monotone"
  | "bright"
  | "natural"
  | "soft"
  | "lark";

type FilterData = {
  brightness: number;
  contrast: number;
  saturation: number;
};

type Source =
  | HTMLImageElement
  | HTMLVideoElement
  | HTMLCanvasElement
  | ImageBitmap
  | OffscreenCanvas;
