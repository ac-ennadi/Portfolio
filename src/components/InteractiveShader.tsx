"use client";

import { useEffect, useRef } from "react";

const VERTEX_SHADER = `
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  precision highp float;
  uniform vec2 u_resolution;
  uniform vec2 u_mouse;
  uniform float u_time;

  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(
      0.211324865405187,
      0.366025403784439,
      -0.577350269189626,
      0.024390243902439
    );
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
    m = m * m;
    m = m * m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    float aspect = u_resolution.x / u_resolution.y;

    vec2 p = uv;
    p.x *= aspect;

    vec2 m = u_mouse / u_resolution.xy;
    m.x *= aspect;

    // Interactive mouse displacement
    float dist = length(p - m);
    float mouseInfluence = smoothstep(0.48, 0.0, dist);
    vec2 mouseForce = normalize(p - m + 0.0001) * mouseInfluence * 0.16;

    float t = u_time * 0.09;

    // Domain warp layers (inspired by shaders.com ChromaFlow)
    vec2 q = vec2(
      snoise(p * 1.4 + vec2(t * 0.5, t * 0.35) + mouseForce),
      snoise(p * 1.4 + vec2(t * 0.25, -t * 0.45) - mouseForce)
    );

    vec2 r = vec2(
      snoise(p * 1.8 + 1.1 * q + vec2(1.7, 9.2) + 0.12 * t + mouseForce * 1.2),
      snoise(p * 1.8 + 1.1 * q + vec2(8.3, 2.8) + 0.10 * t - mouseForce * 1.2)
    );

    float f = snoise(p * 1.6 + r + mouseForce * 1.8);
    f = clamp((f + 1.0) * 0.5, 0.0, 1.0);

    // Deep chromatic palette
    vec3 colorVoid   = vec3(0.02, 0.024, 0.028);     // #050607
    vec3 colorNavy   = vec3(0.03, 0.07, 0.15);      // deep midnight
    vec3 colorCobalt = vec3(0.06, 0.18, 0.42);      // cobalt highlight
    vec3 colorCoral  = vec3(1.0, 0.388, 0.388);     // #ff6363 brand accent

    // Mix deep atmospheric layers
    vec3 col = mix(colorVoid, colorNavy, f * 1.8);
    col = mix(col, colorCobalt, clamp(length(q) * 0.4, 0.0, 1.0));

    // Dynamic coral luminescence reacting to mouse interaction & fluid eddies
    float coralReaction = mouseInfluence * 0.45 + pow(f, 3.5) * 0.25;
    col = mix(col, colorCoral, clamp(coralReaction * 0.42, 0.0, 1.0));

    // Subtle edge fade / vignette
    float vig = smoothstep(1.35, 0.2, length(uv - 0.5));
    col *= vig;

    // Restrain brightness to keep foreground text high-contrast and readable
    col = clamp(col * 0.85, 0.0, 1.0);

    gl_FragColor = vec4(col, 1.0);
  }
`;

export default function InteractiveShader() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const gl =
      canvas.getContext("webgl", { alpha: false, antialias: false, powerPreference: "high-performance" }) ||
      (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);

    if (!gl) return;

    const compileShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertShader = compileShader(gl.VERTEX_SHADER, VERTEX_SHADER);
    const fragShader = compileShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vertShader || !fragShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      return;
    }

    gl.useProgram(program);

    // Full screen quad buffer
    const quadVertices = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, quadVertices, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const uResolution = gl.getUniformLocation(program, "u_resolution");
    const uMouse = gl.getUniformLocation(program, "u_mouse");
    const uTime = gl.getUniformLocation(program, "u_time");

    let width = 0;
    let height = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;
    let animationFrameId: number;
    let startTime = performance.now();
    let isVisible = true;

    const handleResize = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uResolution, canvas.width, canvas.height);
    };

    // Center mouse by default
    targetMouseX = (window.innerWidth * 0.5) * (Math.min(window.devicePixelRatio || 1, 1.5));
    targetMouseY = (window.innerHeight * 0.4) * (Math.min(window.devicePixelRatio || 1, 1.5));
    currentMouseX = targetMouseX;
    currentMouseY = targetMouseY;

    handleResize();

    const handlePointerMove = (e: PointerEvent) => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      targetMouseX = e.clientX * dpr;
      targetMouseY = (window.innerHeight - e.clientY) * dpr; // Invert Y for WebGL
    };

    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
    };

    window.addEventListener("resize", handleResize, { passive: true });
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.addEventListener("visibilitychange", handleVisibilityChange);

    const render = (now: number) => {
      if (isVisible) {
        // Smooth mouse lerping
        currentMouseX += (targetMouseX - currentMouseX) * 0.08;
        currentMouseY += (targetMouseY - currentMouseY) * 0.08;

        gl.uniform2f(uMouse, currentMouseX, currentMouseY);
        gl.uniform1f(uTime, (now - startTime) * 0.001);

        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      gl.deleteProgram(program);
      gl.deleteShader(vertShader);
      gl.deleteShader(fragShader);
      gl.deleteBuffer(buffer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="interactive-shader-canvas"
      aria-hidden="true"
    />
  );
}
