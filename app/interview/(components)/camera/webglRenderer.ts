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

export class WebGLRenderer {
  private gl: WebGLRenderingContext;
  private program: WebGLProgram | null = null;
  private positionBuffer: WebGLBuffer | null = null;
  private texCoordBuffer: WebGLBuffer | null = null;
  private texture: WebGLTexture | null = null;
  private uniformLocations: {
    brightness: WebGLUniformLocation | null;
    contrast: WebGLUniformLocation | null;
    saturation: WebGLUniformLocation | null;
  } = {
    brightness: null,
    contrast: null,
    saturation: null,
  };
  private attributeLocations: {
    position: number;
    texCoord: number;
  } | null = null;

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

    if (!this.positionBuffer || !this.texCoordBuffer || !this.texture) {
      throw new Error("Failed to create WebGL buffers or texture");
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

    // uniform 위치 저장
    this.uniformLocations = {
      brightness: this.gl.getUniformLocation(this.program, "u_brightness"),
      contrast: this.gl.getUniformLocation(this.program, "u_contrast"),
      saturation: this.gl.getUniformLocation(this.program, "u_saturation"),
    };

    // attribute 위치 저장
    this.attributeLocations = {
      position: this.gl.getAttribLocation(this.program, "a_position"),
      texCoord: this.gl.getAttribLocation(this.program, "a_texCoord"),
    };
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

  draw(video: HTMLVideoElement, filter: FilterData) {
    if (
      !this.program ||
      !this.positionBuffer ||
      !this.texCoordBuffer ||
      !this.texture ||
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

    // 텍스처 업데이트
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
    this.uniformLocations = {
      brightness: null,
      contrast: null,
      saturation: null,
    };
    this.attributeLocations = null;
  }
}
