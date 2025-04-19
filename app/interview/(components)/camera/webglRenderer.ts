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
  uniform sampler2D u_overlay;
  uniform float u_bloomThreshold;
  uniform float u_bloomIntensity;
  uniform float u_brightness;
  uniform float u_contrast;
  uniform float u_saturation;
  uniform float u_exposure;
  uniform float u_colorTemp;
  uniform float u_tint;
  uniform float u_highlights;
  uniform float u_shadows;
  uniform float u_vibrance;
  uniform float u_clarity;
  uniform float u_blur;
  uniform float u_mist;
  uniform sampler2D u_noise;
  uniform float     u_time;
  uniform float     u_mistScale;
  uniform float     u_mistSpeed;
  uniform vec2  u_texelSize;
  uniform bool u_hasOverlay;
  varying vec2 v_texCoord;
  
  void main() {
    vec2 uv = v_texCoord;
    vec4 color = texture2D(u_image, v_texCoord);
    vec3 rgb = color.rgb;

     // 1. Exposure (stop adjustment)
    rgb = rgb * pow(2.0, u_exposure);

    // 2. White balance: color temperature & tint
    // simple WB: scale red/blue by colorTemp, green by tint
    float newWBWeight = u_colorTemp;  
    vec3 wbColor = vec3(u_colorTemp, u_tint, 1.0/u_colorTemp);
    rgb = mix(rgb, rgb * wbColor, newWBWeight);

    // 3. Brightness
    rgb *= u_brightness;

    // 4. Contrast
    rgb = (rgb - 0.5) * u_contrast + 0.5;

    // 5. Saturation
    float gray = dot(rgb, vec3(0.299, 0.587, 0.114));
    rgb = mix(vec3(gray), rgb, u_saturation);

    // 6. Highlights & Shadows
    float lum = dot(rgb, vec3(0.299, 0.587, 0.114));
    // highlights: preserve bright areas
    float highMask = smoothstep(0.5, 1.0, lum);
    rgb += (1.0 - rgb) * u_highlights * highMask;
    // shadows: preserve dark areas
    float shadowMask = smoothstep(0.0, 0.5, lum);
    rgb -= rgb * u_shadows * shadowMask;

    // 7. Vibrance (smart saturation)
    float maxc = max(max(rgb.r, rgb.g), rgb.b);
    float minc = min(min(rgb.r, rgb.g), rgb.b);
    float delta = maxc - minc;
    float vibMask = (1.0 - delta) * u_vibrance;
    rgb = mix(vec3(gray), rgb, 1.0 + vibMask);

    // 8. Clarity (local contrast)
    rgb += (rgb - vec3(gray)) * u_clarity;

    // 9. Blur (simple box blur)
    if (u_blur > 0.0) {
      vec3 sum = vec3(0.0);
        for (int x = -1; x <= 1; x++) {
          for (int y = -1; y <= 1; y++) {
            sum += texture2D(u_image, uv + vec2(x, y) * u_texelSize).rgb;
          }
      }
      vec3 blurCol = sum / 9.0;
      rgb = mix(rgb, blurCol, u_blur);
    }

    // 10. Bloom (threshold → box blur → additive composite)
    float luma = dot(rgb, vec3(0.299,0.587,0.114));
    float knee = u_bloomThreshold * u_bloomThreshold;      // threshold²
    float soft = max(luma - u_bloomThreshold, 0.0);
    float softKnee = soft * soft / (4.0 * knee + 1e-6);   // 소프트 니 커브
    float weight = max(softKnee + (luma - u_bloomThreshold), 0.0) / max(luma, 1e-6);
    vec3 highlight = rgb * weight;
    
    if (luma > u_bloomThreshold) {
      vec3 sumBloom = vec3(0.0);
      for (int x = -2; x <= 2; x++) {
        for (int y = -2; y <= 2; y++) {
          vec2 off = vec2(x, y) * u_texelSize;
          vec3 samp = texture2D(u_image, uv + off).rgb;
          float sl = dot(samp, vec3(0.299,0.587,0.114));
          sumBloom += (sl > u_bloomThreshold ? samp : vec3(0.0));
        }
      }
      sumBloom /= float((2*2+1)*(2*2+1));
      rgb += sumBloom * u_bloomIntensity;
    }

    // 11. Overlay blending
    if (u_hasOverlay) {
      vec2 overlayCoord = vec2(1.0 - uv.x, uv.y);
      vec4 overlay = texture2D(u_overlay, overlayCoord);
      rgb = mix(rgb, overlay.rgb, overlay.a);
    }
    
    // 0~1 범위로 클램핑
    rgb = clamp(rgb, 0.0, 1.0);
    
    gl_FragColor = vec4(rgb, color.a);
  }
`;

export class WebGLRenderer {
  private gl: WebGLRenderingContext;
  private program: WebGLProgram | null = null;
  private positionBuffer: WebGLBuffer | null = null;
  private texCoordBuffer: WebGLBuffer | null = null;
  private texture: WebGLTexture | null = null;
  private overlayTexture: WebGLTexture | null = null;
  private uniformLocations: Record<string, WebGLUniformLocation | null> = {};
  private attributeLocations: {
    position: number;
    texCoord: number;
  } | null = null;
  private noiseTexture: WebGLTexture | null = null;

  constructor(gl: WebGLRenderingContext) {
    this.gl = gl;
  }

  init() {
    this.program = this.createProgram();
    if (!this.program) {
      throw new Error("Failed to create WebGL program");
    }

    this.positionBuffer = this.gl.createBuffer();
    this.texCoordBuffer = this.gl.createBuffer();
    this.texture = this.gl.createTexture();
    this.overlayTexture = this.gl.createTexture();

    if (
      !this.positionBuffer ||
      !this.texCoordBuffer ||
      !this.texture ||
      !this.overlayTexture
    ) {
      throw new Error("Failed to create WebGL buffers or textures");
    }

    // 정점 데이터 설정
    const positions = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const texCoords = new Float32Array([1, 1, 0, 1, 1, 0, 0, 0]);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, positions, this.gl.STATIC_DRAW);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texCoordBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, texCoords, this.gl.STATIC_DRAW);

    // 텍스처 설정
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_WRAP_S,
      this.gl.CLAMP_TO_EDGE
    );
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_WRAP_T,
      this.gl.CLAMP_TO_EDGE
    );
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_MIN_FILTER,
      this.gl.LINEAR
    );
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_MAG_FILTER,
      this.gl.LINEAR
    );

    // 오버레이 텍스처 설정
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.overlayTexture);
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_WRAP_S,
      this.gl.CLAMP_TO_EDGE
    );
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_WRAP_T,
      this.gl.CLAMP_TO_EDGE
    );
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_MIN_FILTER,
      this.gl.LINEAR
    );
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_MAG_FILTER,
      this.gl.LINEAR
    );

    // 초기 오버레이 텍스처 설정 (투명)
    const emptyData = new Uint8Array([0, 0, 0, 0]);
    this.gl.texImage2D(
      this.gl.TEXTURE_2D,
      0,
      this.gl.RGBA,
      1,
      1,
      0,
      this.gl.RGBA,
      this.gl.UNSIGNED_BYTE,
      emptyData
    );

    this.noiseTexture = this.gl.createTexture();
    const size = 256;
    const noiseData = new Uint8Array(size * size);
    for (let i = 0; i < size * size; i++) {
      noiseData[i] = Math.random() * 255;
    }
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.noiseTexture);
    this.gl.texImage2D(
      this.gl.TEXTURE_2D,
      0,
      this.gl.LUMINANCE,
      size,
      size,
      0,
      this.gl.LUMINANCE,
      this.gl.UNSIGNED_BYTE,
      noiseData
    );
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_WRAP_S,
      this.gl.REPEAT
    );
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_WRAP_T,
      this.gl.REPEAT
    );
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_MIN_FILTER,
      this.gl.LINEAR
    );

    // uniform 위치 저장
    const names = [
      "brightness",
      "contrast",
      "saturation",
      "exposure",
      "colorTemp",
      "tint",
      "highlights",
      "shadows",
      "vibrance",
      "clarity",
      "blur",
      "mist",
      "mistScale",
      "mistSpeed",
      "time",
      "noise",
      "texelSize",
      "overlay",
      "hasOverlay",
      "bloomThreshold",
      "bloomIntensity",
    ];

    this.gl.useProgram(this.program);
    names.forEach(
      (name) =>
        (this.uniformLocations[name] = this.gl.getUniformLocation(
          this.program!,
          `u_${name}`
        )!)
    );

    // attribute 위치 저장
    this.attributeLocations = {
      position: this.gl.getAttribLocation(this.program, "a_position"),
      texCoord: this.gl.getAttribLocation(this.program, "a_texCoord"),
    };

    // 초기 오버레이 상태 설정
    if (this.uniformLocations.hasOverlay) {
      this.gl.useProgram(this.program);
      this.gl.uniform1i(this.uniformLocations.hasOverlay, 0);
    }

    // 초기 필터 값 설정
    this.gl.useProgram(this.program);
    this.gl.uniform1f(this.uniformLocations.brightness, 1.0);
    this.gl.uniform1f(this.uniformLocations.contrast, 1.0);
    this.gl.uniform1f(this.uniformLocations.saturation, 1.0);
    this.gl.uniform1f(this.uniformLocations.exposure, 0.0);
    this.gl.uniform1f(this.uniformLocations.colorTemp, 1.0);
    this.gl.uniform1f(this.uniformLocations.tint, 1.0);
    this.gl.uniform1f(this.uniformLocations.highlights, 0.0);
    this.gl.uniform1f(this.uniformLocations.shadows, 0.0);
    this.gl.uniform1f(this.uniformLocations.vibrance, 0.0);
    this.gl.uniform1f(this.uniformLocations.clarity, 0.0);
    this.gl.uniform1f(this.uniformLocations.blur, 0.0);
    this.gl.uniform1f(this.uniformLocations.mist, 0.0);
    this.gl.uniform1f(this.uniformLocations.mistScale, 0.0);
    this.gl.uniform1f(this.uniformLocations.mistSpeed, 0.0);
    this.gl.uniform1f(this.uniformLocations.bloomThreshold, 0.8);
    this.gl.uniform1f(this.uniformLocations.bloomIntensity, 0.5);
  }

  private createShader(type: number, source: string): WebGLShader | null {
    const shader = this.gl.createShader(type);
    if (!shader) throw new Error("Failed to create shader");

    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      const errorLog = this.gl.getShaderInfoLog(shader);
      console.error(
        `Shader compilation error (${
          type === this.gl.VERTEX_SHADER ? "vertex" : "fragment"
        }):`,
        errorLog
      );
      this.gl.deleteShader(shader);
      return null;
    }

    return shader;
  }

  private createProgram(): WebGLProgram | null {
    const vertexShader = this.createShader(
      this.gl.VERTEX_SHADER,
      vertexShaderSource
    );
    const fragmentShader = this.createShader(
      this.gl.FRAGMENT_SHADER,
      fragmentShaderSource
    );

    if (!vertexShader || !fragmentShader) return null;

    const program = this.gl.createProgram();
    if (!program) throw new Error("Failed to create program");

    this.gl.attachShader(program, vertexShader);
    this.gl.attachShader(program, fragmentShader);
    this.gl.linkProgram(program);

    if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
      const errorLog = this.gl.getProgramInfoLog(program);
      console.error("Program linking error:", errorLog);
      this.gl.deleteProgram(program);
      return null;
    }

    return program;
  }

  setOverlay(image: HTMLImageElement | null) {
    if (!this.overlayTexture) return;

    this.gl.bindTexture(this.gl.TEXTURE_2D, this.overlayTexture);

    if (image) {
      this.gl.texImage2D(
        this.gl.TEXTURE_2D,
        0,
        this.gl.RGBA,
        this.gl.RGBA,
        this.gl.UNSIGNED_BYTE,
        image
      );
    } else {
      // 오버레이를 제거할 때는 투명한 텍스처로 초기화
      const emptyData = new Uint8Array([0, 0, 0, 0]);
      this.gl.texImage2D(
        this.gl.TEXTURE_2D,
        0,
        this.gl.RGBA,
        1,
        1,
        0,
        this.gl.RGBA,
        this.gl.UNSIGNED_BYTE,
        emptyData
      );
    }
  }

  draw(video: HTMLVideoElement, filter: FilterData) {
    if (
      !this.program ||
      !this.positionBuffer ||
      !this.texCoordBuffer ||
      !this.texture ||
      !this.overlayTexture ||
      !this.attributeLocations
    ) {
      throw new Error("WebGL resources not initialized");
    }

    this.gl.useProgram(this.program);

    // 버퍼 바인딩
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
    this.gl.enableVertexAttribArray(this.attributeLocations.position);
    this.gl.vertexAttribPointer(
      this.attributeLocations.position,
      2,
      this.gl.FLOAT,
      false,
      0,
      0
    );

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texCoordBuffer);
    this.gl.enableVertexAttribArray(this.attributeLocations.texCoord);
    this.gl.vertexAttribPointer(
      this.attributeLocations.texCoord,
      2,
      this.gl.FLOAT,
      false,
      0,
      0
    );

    // 오버레이 텍스처 설정
    this.gl.activeTexture(this.gl.TEXTURE1);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.overlayTexture);
    if (this.uniformLocations.overlay) {
      this.gl.uniform1i(this.uniformLocations.overlay, 1);
    }
    if (this.uniformLocations.hasOverlay) {
      this.gl.uniform1i(
        this.uniformLocations.hasOverlay,
        this.overlayTexture ? 1 : 0
      );
    }

    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
    this.gl.texImage2D(
      this.gl.TEXTURE_2D,
      0,
      this.gl.RGBA,
      this.gl.RGBA,
      this.gl.UNSIGNED_BYTE,
      video
    );

    // 필터 uniform 설정
    if (this.uniformLocations.brightness) {
      this.gl.uniform1f(this.uniformLocations.brightness, filter.brightness);
    }
    if (this.uniformLocations.contrast) {
      this.gl.uniform1f(this.uniformLocations.contrast, filter.contrast);
    }
    if (this.uniformLocations.saturation) {
      this.gl.uniform1f(this.uniformLocations.saturation, filter.saturation);
    }
    if (this.uniformLocations.exposure) {
      this.gl.uniform1f(this.uniformLocations.exposure, filter.exposure);
    }
    if (this.uniformLocations.colorTemp) {
      this.gl.uniform1f(this.uniformLocations.colorTemp, filter.colorTemp);
    }
    if (this.uniformLocations.tint) {
      this.gl.uniform1f(this.uniformLocations.tint, filter.tint);
    }
    if (this.uniformLocations.highlights) {
      this.gl.uniform1f(this.uniformLocations.highlights, filter.highlights);
    }
    if (this.uniformLocations.shadows) {
      this.gl.uniform1f(this.uniformLocations.shadows, filter.shadows);
    }
    if (this.uniformLocations.vibrance) {
      this.gl.uniform1f(this.uniformLocations.vibrance, filter.vibrance);
    }
    if (this.uniformLocations.clarity) {
      this.gl.uniform1f(this.uniformLocations.clarity, filter.clarity);
    }
    if (this.uniformLocations.blur) {
      this.gl.uniform1f(this.uniformLocations.blur, filter.blur);
    }
    if (this.uniformLocations.mist) {
      this.gl.uniform1f(this.uniformLocations.mist, filter.mist);
    }
    if (this.uniformLocations.mistScale) {
      this.gl.uniform1f(this.uniformLocations.mistScale, filter.mistScale);
    }
    if (this.uniformLocations.mistSpeed) {
      this.gl.uniform1f(this.uniformLocations.mistSpeed, filter.mistSpeed);
    }
    if (this.uniformLocations.bloomThreshold) {
      this.gl.uniform1f(
        this.uniformLocations.bloomThreshold,
        filter.bloomThreshold
      );
    }
    if (this.uniformLocations.bloomIntensity) {
      this.gl.uniform1f(
        this.uniformLocations.bloomIntensity,
        filter.bloomIntensity
      );
    }

    this.gl.uniform1f(this.uniformLocations.time, performance.now() * 0.001);
    this.gl.activeTexture(this.gl.TEXTURE2);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.noiseTexture);
    this.gl.uniform1i(this.uniformLocations.noise, 2);

    if (this.uniformLocations.texelSize) {
      this.gl.uniform2f(
        this.uniformLocations.texelSize,
        1 / video.videoWidth,
        1 / video.videoHeight
      );
    }

    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
  }

  cleanup() {
    if (this.program) {
      this.gl.deleteProgram(this.program);
      this.program = null;
    }
    if (this.positionBuffer) {
      this.gl.deleteBuffer(this.positionBuffer);
      this.positionBuffer = null;
    }
    if (this.texCoordBuffer) {
      this.gl.deleteBuffer(this.texCoordBuffer);
      this.texCoordBuffer = null;
    }
    if (this.texture) {
      this.gl.deleteTexture(this.texture);
      this.texture = null;
    }
    if (this.overlayTexture) {
      this.gl.deleteTexture(this.overlayTexture);
      this.overlayTexture = null;
    }
    this.uniformLocations = {
      brightness: null,
      contrast: null,
      saturation: null,
      exposure: null,
      colorTemp: null,
      tint: null,
      highlights: null,
      shadows: null,
      vibrance: null,
      clarity: null,
      blur: null,
      mist: null,
      texelSize: null,
      overlay: null,
      hasOverlay: null,
    };
    this.attributeLocations = null;
  }
}
