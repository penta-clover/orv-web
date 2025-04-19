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
  | "lark"
  | "timecapsule";

type FilterData = {
  brightness: number;
  contrast: number;
  saturation: number;
  exposure: number;
  colorTemp: number;
  tint: number;
  highlights: number;
  shadows: number;
  vibrance: number;
  clarity: number;
  blur: number;
  mist: number;
  mistScale: number;
  mistSpeed: number;
  bloomThreshold: number;
  bloomIntensity: number;
  vignetteRadius: number;
  vignetteSoftness: number;
};

