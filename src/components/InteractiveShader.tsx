"use client";

import { useEffect, useRef } from "react";

const VERTEX_SHADER = `
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

// Inspired by shaders.com FlutedGlass + Swirl + ChromaFlow
const FRAGMENT_SHADER = `
  precision highp float;
  uniform vec2 u_resolution;
  uniform vec2 u_mouse;
  uniform vec2 u_mouse_velocity;
  uniform float u_time;

  const float PI = 3.14159265359;
  const float FLUTE_ANGLE = 30.0 * PI / 180.0; // 30 deg fluted glass
  const float FLUTE_FREQ = 7.2;

  // Simplex 2D noise
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

  // Color field computation with Swirl & ChromaFlow
  vec3 sampleColorField(vec2 p, float t, vec2 mousePos, vec2 mouseVel, float mouseDist) {
    // Palette matched to Achraf's theme:
    // Void base canvas
    vec3 colorBase   = vec3(0.025, 0.03, 0.038);    // #06080a
    vec3 colorIndigo = vec3(0.07, 0.14, 0.32);     // deep space indigo
    vec3 colorCobalt = vec3(0.14, 0.32, 0.68);     // electric sky / cobalt
    vec3 colorCoral  = vec3(1.0, 0.388, 0.388);    // #ff6363 Coral Pulse
    vec3 colorEmber  = vec3(0.35, 0.12, 0.16);     // Ember Hush #452324

    // ChromaFlow velocity & direction
    float speed = clamp(length(mouseVel) * 16.0, 0.0, 1.0);
    vec2 dir = normalize(mouseVel + 0.0001);

    // Dynamic directional color (up/down: coral/indigo, left/right: ember/cobalt)
    vec3 dirColor = mix(colorIndigo, colorCoral, clamp(dir.y * 0.5 + 0.5, 0.0, 1.0));
    dirColor = mix(dirColor, colorCobalt, clamp(dir.x * 0.5 + 0.5, 0.0, 1.0));

    // Interactive mouse displacement ripple
    float mouseRadius = 0.52;
    float mouseInfluence = smoothstep(mouseRadius, 0.0, mouseDist);
    vec2 mouseForce = (p - mousePos) * mouseInfluence * 0.28;

    // Swirl layers (blend=50, detail=1.7)
    float detail = 1.6;
    vec2 q = vec2(
      snoise(p * detail + vec2(t * 0.28, t * 0.18) + mouseForce),
      snoise(p * detail + vec2(-t * 0.22, t * 0.32) - mouseForce)
    );

    float n = snoise(p * 1.35 + q * 1.3 + t * 0.12);
    float blend = clamp((n + 1.0) * 0.5, 0.0, 1.0);

    // Layer blending
    vec3 col = mix(colorBase, colorIndigo, blend * 1.5);
    col = mix(col, colorCobalt, clamp(length(q) * 0.55, 0.0, 1.0));

    // Dynamic coral glow and ChromaFlow reaction around cursor
    float coralEffect = mouseInfluence * (0.45 + speed * 0.55) + pow(blend, 3.2) * 0.25;
    col = mix(col, mix(colorCoral, dirColor, 0.45), clamp(coralEffect * 0.7, 0.0, 1.0));

    return col;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    float aspect = u_resolution.x / u_resolution.y;

    vec2 p = uv;
    p.x *= aspect;

    vec2 m = u_mouse / u_resolution.xy;
    m.x *= aspect;

    float t = u_time * 0.22;

    // 1. FLUTED GLASS RIGID CYLINDRICAL GEOMETRY (30 degrees)
    vec2 rotCoord = vec2(
      p.x * cos(FLUTE_ANGLE) - p.y * sin(FLUTE_ANGLE),
      p.x * sin(FLUTE_ANGLE) + p.y * cos(FLUTE_ANGLE)
    );

    float flutePhase = rotCoord.x * FLUTE_FREQ * 2.0 * PI;
    float fluteNormal = cos(flutePhase); // Surface slope for cylindrical lens refraction

    // Refraction along glass cylinder axis
    vec2 fluteDir = vec2(-sin(FLUTE_ANGLE), cos(FLUTE_ANGLE));
    float refraction = 0.042;
    float aberration = 0.024; // Chromatic aberration separation

    // Sample RGB channels with chromatic aberration
    vec2 pR = p + fluteDir * fluteNormal * (refraction * (1.0 + aberration));
    vec2 pG = p + fluteDir * fluteNormal * refraction;
    vec2 pB = p + fluteDir * fluteNormal * (refraction * (1.0 - aberration));

    vec3 colR = sampleColorField(pR, t, m, u_mouse_velocity, length(pR - m));
    vec3 colG = sampleColorField(pG, t, m, u_mouse_velocity, length(pG - m));
    vec3 colB = sampleColorField(pB, t, m, u_mouse_velocity, length(pB - m));

    vec3 finalColor = vec3(colR.r, colG.g, colB.b);

    // 2. SPECULAR GLASS RIDGE SHEEN
    float lightSlope = max(0.0, fluteNormal * 0.65 + 0.35);
    float glassSpecular = pow(lightSlope, 9.0) * 0.28;
    float glassEdge = pow(abs(fluteNormal), 3.5) * 0.16;

    float distToMouse = length(p - m);
    vec3 specColor = mix(vec3(0.9, 0.95, 1.0), vec3(1.0, 0.45, 0.45), smoothstep(0.42, 0.0, distToMouse));
    finalColor += specColor * (glassSpecular + glassEdge);

    // 3. AMBIENT VIGNETTE
    float vig = smoothstep(1.35, 0.25, length(uv - 0.5));
    finalColor *= vig;

    // Keep deep and luxurious so foreground text remains 100% crisp
    finalColor = clamp(finalColor, 0.0, 1.0);

    gl_FragColor = vec4(finalColor, 1.0);
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
      canvas.getContext("webgl", {
        alpha: false,
        antialias: false,
        powerPreference: "high-performance",
      }) || (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);

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

    const quadVertices = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, quadVertices, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const uResolution = gl.getUniformLocation(program, "u_resolution");
    const uMouse = gl.getUniformLocation(program, "u_mouse");
    const uMouseVelocity = gl.getUniformLocation(program, "u_mouse_velocity");
    const uTime = gl.getUniformLocation(program, "u_time");

    let width = 0;
    let height = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;
    let lastMouseX = 0;
    let lastMouseY = 0;
    let mouseVelX = 0;
    let mouseVelY = 0;

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

    const initDpr = Math.min(window.devicePixelRatio || 1, 1.5);
    targetMouseX = window.innerWidth * 0.5 * initDpr;
    targetMouseY = window.innerHeight * 0.5 * initDpr;
    currentMouseX = targetMouseX;
    currentMouseY = targetMouseY;
    lastMouseX = targetMouseX;
    lastMouseY = targetMouseY;

    handleResize();

    const handlePointerMove = (e: PointerEvent) => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      targetMouseX = e.clientX * dpr;
      targetMouseY = (window.innerHeight - e.clientY) * dpr; // WebGL Y is inverted
    };

    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
    };

    window.addEventListener("resize", handleResize, { passive: true });
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.addEventListener("visibilitychange", handleVisibilityChange);

    const render = (now: number) => {
      if (isVisible) {
        // Smooth lerp for mouse position
        currentMouseX += (targetMouseX - currentMouseX) * 0.08;
        currentMouseY += (targetMouseY - currentMouseY) * 0.08;

        // Calculate velocity for ChromaFlow effect
        const vx = (currentMouseX - lastMouseX) * 0.01;
        const vy = (currentMouseY - lastMouseY) * 0.01;
        mouseVelX += (vx - mouseVelX) * 0.15;
        mouseVelY += (vy - mouseVelY) * 0.15;
        lastMouseX = currentMouseX;
        lastMouseY = currentMouseY;

        gl.uniform2f(uMouse, currentMouseX, currentMouseY);
        gl.uniform2f(uMouseVelocity, mouseVelX, mouseVelY);
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
