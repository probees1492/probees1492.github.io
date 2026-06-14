import { Container, Graphics, Ticker } from "pixi.js";
import type { Slide } from "../slidesData";
import type { LayoutConfig } from "../layouts";
import { makeText, placeAnchored, renderLinks } from "./textHelpers";

export function renderParticleGlobe(
  slide: Slide,
  layout: LayoutConfig,
  width: number,
  height: number,
  onNavigate: (url: string) => void,
): Container {
  const c = new Container();

  const bg = new Graphics();
  bg.rect(0, 0, width, height);
  bg.fill(layout.background.color);
  c.addChild(bg);

  const cx = width / 2;
  const cy = height / 2 - 40;
  const radius = 140;
  const N = 600;

  const particles: { x: number; y: number; z: number; g: Graphics }[] = [];
  const dots = new Container();
  dots.x = cx;
  dots.y = cy;
  c.addChild(dots);

  for (let i = 0; i < N; i++) {
    const theta = Math.acos(1 - (2 * (i + 0.5)) / N);
    const phi = Math.PI * (1 + Math.sqrt(5)) * i;
    const x = Math.sin(theta) * Math.cos(phi);
    const y = Math.sin(theta) * Math.sin(phi);
    const z = Math.cos(theta);
    const g = new Graphics();
    g.circle(0, 0, 1.2);
    g.fill(0xffffff);
    dots.addChild(g);
    particles.push({ x, y, z, g });
  }

  const mouse = { x: 0, y: 0, active: false };
  c.eventMode = "static";
  c.hitArea = { contains: () => true } as any;
  c.on("globalpointermove", (e) => {
    mouse.x = (e.global.x - cx) / radius;
    mouse.y = (e.global.y - cy) / radius;
    mouse.active = true;
  });
  c.on("pointerleave", () => {
    mouse.active = false;
  });

  let rotY = 0;
  let rotX = 0;
  const tick = (t: Ticker) => {
    rotY += 0.003 * t.deltaTime;
    rotX += 0.0008 * t.deltaTime;
    const cy_ = Math.cos(rotX), sy_ = Math.sin(rotX);
    const cx_ = Math.cos(rotY), sx_ = Math.sin(rotY);
    for (const p of particles) {
      let x = p.x, y = p.y, z = p.z;
      const y1 = y * cy_ - z * sy_;
      const z1 = y * sy_ + z * cy_;
      const x2 = x * cx_ + z1 * sx_;
      const z2 = -x * sx_ + z1 * cx_;

      let px = x2, py = y1, pz = z2;
      if (mouse.active) {
        const dx = px - mouse.x;
        const dy = py - mouse.y;
        const d2 = dx * dx + dy * dy;
        const force = Math.min(0.35, 0.05 / (d2 + 0.04));
        px += dx * force;
        py += dy * force;
      }

      const scale = 1 / (2.5 - pz);
      p.g.x = px * radius;
      p.g.y = py * radius;
      p.g.scale.set(scale);
      p.g.alpha = 0.3 + 0.7 * scale;
    }
  };
  Ticker.shared.add(tick);
  const originalDestroy = c.destroy.bind(c);
  c.destroy = (opts?: any) => {
    Ticker.shared.remove(tick);
    originalDestroy(opts);
  };

  if (slide.title && layout.title) {
    const titleCfg = layout.title;
    const hl = slide.highlightText;
    if (hl && slide.title.includes(hl)) {
      // Split into [before, hl, after] and render each with own color
      const idx = slide.title.indexOf(hl);
      const before = slide.title.slice(0, idx);
      const after = slide.title.slice(idx + hl.length);
      const HL_COLOR = 0x22c55e;

      const parts: Array<{ text: string; color: number }> = [];
      if (before) parts.push({ text: before, color: titleCfg.style.fill });
      parts.push({ text: hl, color: HL_COLOR });
      if (after) parts.push({ text: after, color: titleCfg.style.fill });

      const partTexts = parts.map((p) =>
        makeText(p.text, { ...titleCfg.style, fill: p.color }),
      );
      const totalW = partTexts.reduce((acc, t) => acc + t.width, 0);
      const cx = titleCfg.position.x;
      const cy = titleCfg.position.y;
      let x = cx - totalW / 2;
      const anchorY = titleCfg.position.anchor?.y ?? 0.5;
      for (const t of partTexts) {
        t.anchor.set(0, anchorY);
        t.x = x;
        t.y = cy;
        c.addChild(t);
        x += t.width;
      }
    } else {
      const t = makeText(slide.title, titleCfg.style);
      placeAnchored(t, titleCfg.position);
      c.addChild(t);
    }
  }
  if (slide.subtitle && layout.body) {
    const t = makeText(slide.subtitle, layout.body.style);
    t.anchor.set(0.5, 0);
    t.x = layout.body.position.x;
    t.y = layout.body.position.y;
    c.addChild(t);
  }
  if (slide.links?.length && layout.body) {
    renderLinks(
      c,
      slide.links,
      { ...layout.body.style, fontSize: 14, fill: 0xffffff },
      width / 2 - 40,
      height - 80,
      onNavigate,
    );
  }
  return c;
}
