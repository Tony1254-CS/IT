"use client";

import { useEffect, useRef } from "react";
import * as OGL from "ogl";

const vertex = `
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const fragment = `
  precision highp float;

  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec2 uMouse;

  void main() {
    vec2 uv = gl_FragCoord.xy / uResolution.xy;

    // Slow flowing noise layers
    float n = 0.0;
    for (float i = 0.0; i < 4.0; i++) {
      float freq = pow(2.0, i);
      float amp = pow(0.5, i);
      n += sin(uv.x * freq * 1.5 + uTime * 0.08 * amp) *
           sin(uv.y * freq * 1.5 + uTime * 0.08 * amp) * amp;
    }

    // Cursor interaction - soft glow following pointer.
    // uMouse is already normalized (0..1) in the mousemove handler.
    vec2 mouse = uMouse;
    float cursorDist = distance(uv, mouse);
    float glow = exp(-cursorDist * 12.0) * 0.25;

    // Graphite base (#1A1A1C) shifting to champagne (#C8B28A)
    vec3 graphite = vec3(0.102, 0.102, 0.110);
    vec3 champagne = vec3(0.784, 0.698, 0.541);

    float t = (n * 0.5 + 0.5) * 0.55 + glow;
    t = clamp(t, 0.0, 1.0);
    t = t * t * (3.0 - 2.0 * t); // smoothstep

    vec3 color = mix(graphite, champagne, t);

    // Silk-like vertical sheen
    float sheen = pow(sin(uv.y * 8.0 + uTime * 0.15) * 0.5 + 0.5, 4.0);
    color += sheen * champagne * 0.15;

    gl_FragColor = vec4(color, 1.0);
  }
`;

export default function HeroShader() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new OGL.Renderer({ canvas, alpha: false, dpr: Math.min(window.devicePixelRatio, 1.5) });
    const gl = renderer.gl;

    const program = new OGL.Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new OGL.Vec2() },
        uMouse: { value: new OGL.Vec2(0.5, 0.5) },
      },
    });

    const geometry = new OGL.Geometry(gl, {
      position: { data: new Float32Array([-1, -1, 3, -1, -1, 3]), size: 2 },
    });

    const mesh = new OGL.Mesh(gl, { geometry, program });

    const prefersReducedMotion =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Start paused; resume when visible
    let paused = true;
    const observer = new IntersectionObserver(
      (entries) => {
        paused = !entries[0].isIntersecting;
      },
      { threshold: 0 }
    );
    observer.observe(canvas);

    const startTime = performance.now();

    const onMouseMove = (e: MouseEvent) => {
      program.uniforms.uMouse.value.set(
        e.clientX / window.innerWidth,
        e.clientY / window.innerHeight
      );
      if (prefersReducedMotion) {
        renderer.render({ scene: mesh });
      }
    };
    window.addEventListener("mousemove", onMouseMove);

    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      program.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
      if (prefersReducedMotion) {
        renderer.render({ scene: mesh });
      }
    };
    window.addEventListener("resize", onResize);
    onResize();

    const render = () => {
      if (prefersReducedMotion) {
        program.uniforms.uTime.value = 1.0;
        renderer.render({ scene: mesh });
        return;
      }
      if (!paused) {
        const t = (performance.now() - startTime) / 1000;
        program.uniforms.uTime.value = t;
      }
      renderer.render({ scene: mesh });
      rafRef.current = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(rafRef.current);
      observer.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />;
}
