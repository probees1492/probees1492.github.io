"use client";
import { useEffect, useRef, useState } from "react";
import { slidesData, type Slide } from "@/lib/slidesData";

const CARD_W = 1000;
const CARD_H = 600;
const CARD_PAD_X = 40;
const CARD_PAD_Y = 24;
const STAGE_W = CARD_W + CARD_PAD_X * 2; // 1080
const STAGE_H = CARD_H + CARD_PAD_Y * 2; // 648
const CARD_X = CARD_PAD_X;
const CARD_Y = CARD_PAD_Y;
const TRANSITION_MS = 760;

// easeOutBack: slight overshoot then snap back — magnetic feel
function easeOutBack(t: number): number {
  const c1 = 1.5;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

export default function SlideStage() {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const appRef = useRef<any>(null);
  const layerRef = useRef<any>(null);
  const currentContainerRef = useRef<any>(null);
  const transitionAbortRef = useRef<(() => void) | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);
  const [index, setIndex] = useState(0);
  const indexRef = useRef(0);
  const prevIndexRef = useRef(0);
  indexRef.current = index;

  function goTo(target: number | string) {
    let nextIdx = -1;
    if (typeof target === "number") nextIdx = target;
    else {
      const hash = target.replace(/^#/, "").replace(/^slide:\/\//, "");
      const i = slidesData.findIndex((s) => s.id === hash);
      if (i >= 0) nextIdx = i;
    }
    if (nextIdx < 0 || nextIdx >= slidesData.length) return;
    if (nextIdx === indexRef.current) return;
    prevIndexRef.current = indexRef.current;
    setIndex(nextIdx);
    history.replaceState(null, "", `#${slidesData[nextIdx].id}`);
  }

  function handleNavigate(url: string) {
    if (url.startsWith("#") || url.startsWith("slide://")) {
      goTo(url);
      return;
    }
    if (url.startsWith("[") || url === "") return;
    window.open(url, "_blank", "noopener");
  }

  useEffect(() => {
    let canceled = false;
    (async () => {
      const PIXI = await import("pixi.js");
      if (canceled) return;
      const app = new PIXI.Application();
      await app.init({
        width: STAGE_W,
        height: STAGE_H,
        background: 0xe5e5e5,
        antialias: true,
        autoDensity: true,
        resolution: window.devicePixelRatio || 1,
      });
      if (canceled) {
        app.destroy(true);
        return;
      }
      hostRef.current!.appendChild(app.canvas);
      appRef.current = app;
      const layer = new PIXI.Container();
      app.stage.addChild(layer);
      layerRef.current = layer;

      const onResize = () => {
        if (!hostRef.current) return;
        const host = hostRef.current;
        const cs = getComputedStyle(host);
        const padX = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
        const padY = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
        const availW = host.clientWidth - padX;
        const availH = host.clientHeight - padY;
        const scale = Math.min(availW / STAGE_W, availH / STAGE_H);
        const canvas = app.canvas;
        canvas.style.width = `${STAGE_W * scale}px`;
        canvas.style.height = `${STAGE_H * scale}px`;
      };
      onResize();
      window.addEventListener("resize", onResize);

      const hash = window.location.hash.replace(/^#/, "");
      if (hash) {
        const i = slidesData.findIndex((s) => s.id === hash);
        if (i >= 0) setIndex(i);
      }

      cleanupRef.current = () => {
        window.removeEventListener("resize", onResize);
        try {
          app.destroy(true, { children: true });
        } catch {}
      };
    })();
    return () => {
      canceled = true;
      cleanupRef.current?.();
    };
  }, []);

  useEffect(() => {
    let canceled = false;
    (async () => {
      // Wait for layer to be ready
      for (let i = 0; i < 50 && !layerRef.current; i++) {
        await new Promise((r) => setTimeout(r, 30));
        if (canceled) return;
      }
      const layer = layerRef.current;
      if (!layer || canceled) return;

      const slide = slidesData[indexRef.current];
      const { renderSlide } = await import("@/lib/renderers");
      if (canceled) return;

      const incoming = renderSlide(slide as Slide, CARD_W, CARD_H, handleNavigate);
      incoming.y = CARD_Y;
      const outgoing = currentContainerRef.current;

      const direction = indexRef.current >= prevIndexRef.current ? 1 : -1;
      const isFirst = !outgoing;

      if (isFirst) {
        incoming.alpha = 0;
        incoming.x = CARD_X;
        incoming.y = CARD_Y + 16;
        layer.addChild(incoming);
        currentContainerRef.current = incoming;
        const t0 = performance.now();
        transitionAbortRef.current?.();
        let raf = 0;
        const step = (now: number) => {
          const t = Math.min((now - t0) / TRANSITION_MS, 1);
          const e = easeOutBack(t);
          incoming.alpha = Math.min(1, Math.max(0, t * 1.6));
          incoming.y = CARD_Y + 16 * (1 - e);
          if (t < 1) raf = requestAnimationFrame(step);
          else incoming.y = CARD_Y;
        };
        raf = requestAnimationFrame(step);
        transitionAbortRef.current = () => cancelAnimationFrame(raf);
        return;
      }

      // Whole-card swap: outgoing slides off, incoming slides in from opposite gutter
      transitionAbortRef.current?.();

      // next (direction>0): outgoing → left off-screen, incoming comes from right
      // prev (direction<0): outgoing → right off-screen, incoming comes from left
      // Push targets a bit past the canvas edge so easeOutBack overshoot stays hidden
      const inStartX = direction > 0 ? STAGE_W + 80 : -CARD_W - 80;
      const outTargetX = direction > 0 ? -CARD_W - 80 : STAGE_W + 80;

      incoming.x = inStartX;
      incoming.alpha = 1;
      layer.addChild(incoming);
      currentContainerRef.current = incoming;

      const outStartX = outgoing.x;

      const t0 = performance.now();
      let raf = 0;
      const step = (now: number) => {
        const t = Math.min((now - t0) / TRANSITION_MS, 1);
        const e = easeOutBack(t);
        outgoing.x = outStartX + (outTargetX - outStartX) * e;
        incoming.x = inStartX + (CARD_X - inStartX) * e;

        if (t < 1) {
          raf = requestAnimationFrame(step);
        } else {
          incoming.x = CARD_X;
          layer.removeChild(outgoing);
          try {
            outgoing.destroy({ children: true });
          } catch {}
        }
      };
      raf = requestAnimationFrame(step);
      transitionAbortRef.current = () => {
        cancelAnimationFrame(raf);
        try {
          layer.removeChild(outgoing);
          outgoing.destroy({ children: true });
        } catch {}
        incoming.x = CARD_X;
        incoming.y = CARD_Y;
        incoming.alpha = 1;
      };
    })();
    return () => {
      canceled = true;
    };
  }, [index]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === " ") {
        e.preventDefault();
        goTo(Math.min(indexRef.current + 1, slidesData.length - 1));
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        goTo(Math.max(indexRef.current - 1, 0));
      } else if (e.key === "Home") {
        goTo(0);
      } else if (e.key === "End") {
        goTo(slidesData.length - 1);
      }
    }
    let wheelLock = 0;
    function onWheel(e: WheelEvent) {
      const now = performance.now();
      if (now - wheelLock < 800) return;
      if (Math.abs(e.deltaY) < 30) return;
      wheelLock = now;
      if (e.deltaY > 0)
        goTo(Math.min(indexRef.current + 1, slidesData.length - 1));
      else goTo(Math.max(indexRef.current - 1, 0));
    }
    function onHash() {
      const hash = window.location.hash.replace(/^#/, "");
      if (!hash) return;
      const i = slidesData.findIndex((s) => s.id === hash);
      if (i >= 0 && i !== indexRef.current) setIndex(i);
    }
    window.addEventListener("keydown", onKey);
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("hashchange", onHash);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("hashchange", onHash);
    };
  }, []);

  return (
    <>
      <div id="stage-root" ref={hostRef} />
      <div className="nav-hint">
        ← → ↑ ↓  ·  scroll  ·  {index + 1} / {slidesData.length}
      </div>
      <Progress index={index} total={slidesData.length} />
    </>
  );
}

function Progress({ index, total }: { index: number; total: number }) {
  return (
    <div
      style={{
        position: "fixed",
        top: 20,
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        gap: 6,
        zIndex: 2,
        pointerEvents: "none",
      }}
    >
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          style={{
            width: i === index ? 22 : 6,
            height: 3,
            borderRadius: 2,
            background: i === index ? "#111" : "rgba(0,0,0,0.18)",
            transition: "width 280ms ease, background 280ms ease",
          }}
        />
      ))}
    </div>
  );
}
