import { Container, Graphics, Text, TextStyle } from "pixi.js";
import type { Slide } from "../slidesData";
import type { LayoutConfig } from "../layouts";

const HELV = "Helvetica Neue, -apple-system, sans-serif";
const IVY = "Times New Roman, serif";
const MONO = "ui-monospace, 'SF Mono', Menlo, monospace";

const COLOR = {
  text: 0xffffff,
  meta: 0x9ca3af,
  faint: 0x6b7280,
  dot: 0xffffff,
  line: 0xffffff,
  current: 0x22c55e,
};

export function renderConnectingDots(
  slide: Slide,
  layout: LayoutConfig,
  width: number,
  height: number,
): Container {
  const stage = new Container();

  const bg = new Graphics();
  bg.rect(0, 0, width, height);
  bg.fill(layout.background.color);
  stage.addChild(bg);

  // Background stars (deterministic-ish)
  for (let i = 0; i < 70; i++) {
    const s = new Graphics();
    const px = ((i * 137) % width);
    const py = ((i * 91 + 13) % height);
    const r = 0.3 + ((i * 7) % 10) / 20;
    const a = 0.06 + ((i * 11) % 15) / 100;
    s.circle(px, py, r);
    s.fill({ color: 0xffffff, alpha: a });
    stage.addChild(s);
  }

  // Intro (centered)
  if (slide.intro) {
    const t = new Text({
      text: slide.intro,
      style: new TextStyle({
        fontFamily: MONO,
        fontSize: 12,
        fontWeight: "400",
        fill: COLOR.faint,
        align: "center",
        letterSpacing: 2,
      }),
    });
    t.anchor.set(0.5, 0);
    t.x = width / 2;
    t.y = 50;
    stage.addChild(t);
  }

  // Title (centered, italic)
  if (slide.title) {
    const t = new Text({
      text: slide.title,
      style: new TextStyle({
        fontFamily: IVY,
        fontSize: 36,
        fontStyle: "italic",
        fontWeight: "400",
        fill: COLOR.text,
        align: "center",
        lineHeight: 44,
      }),
    });
    t.anchor.set(0.5, 0);
    t.x = width / 2;
    t.y = 78;
    stage.addChild(t);
  }

  // Quote (body field, centered, italic, gray)
  if (slide.body) {
    const t = new Text({
      text: slide.body,
      style: new TextStyle({
        fontFamily: IVY,
        fontSize: 13,
        fontStyle: "italic",
        fontWeight: "400",
        fill: COLOR.meta,
        align: "center",
        lineHeight: 20,
        wordWrap: true,
        wordWrapWidth: 760,
      }),
    });
    t.anchor.set(0.5, 0);
    t.x = width / 2;
    t.y = 140;
    stage.addChild(t);
  }

  // Build dot lookup
  const dotMap = new Map<string, NonNullable<Slide["dots"]>[number]>();
  (slide.dots ?? []).forEach((d) => dotMap.set(d.id, d));

  // Draw connection lines first (behind dots)
  (slide.connections ?? []).forEach(({ from, to }) => {
    const a = dotMap.get(from);
    const b = dotMap.get(to);
    if (!a || !b) return;
    const line = new Graphics();
    line.moveTo(a.x, a.y);
    line.lineTo(b.x, b.y);
    line.stroke({ width: 1, color: COLOR.line, alpha: 0.18 });
    stage.addChild(line);
  });

  // Draw dots + labels
  (slide.dots ?? []).forEach((d) => {
    const isHL = d.highlight === true;

    if (isHL) {
      const glow = new Graphics();
      glow.circle(d.x, d.y, 14);
      glow.fill({ color: COLOR.current, alpha: 0.18 });
      stage.addChild(glow);
    }

    const dot = new Graphics();
    dot.circle(d.x, d.y, isHL ? 6 : 4);
    dot.fill(isHL ? COLOR.current : COLOR.dot);
    stage.addChild(dot);

    const label = new Text({
      text: d.label,
      style: new TextStyle({
        fontFamily: HELV,
        fontSize: 12,
        fontWeight: isHL ? "600" : "400",
        fill: isHL ? COLOR.current : 0xe5e5e5,
      }),
    });
    const pos = d.labelPos || "bottom";
    if (pos === "top") {
      label.anchor.set(0.5, 1);
      label.x = d.x;
      label.y = d.y - 12;
    } else if (pos === "bottom") {
      label.anchor.set(0.5, 0);
      label.x = d.x;
      label.y = d.y + 12;
    } else if (pos === "right") {
      label.anchor.set(0, 0.5);
      label.x = d.x + 12;
      label.y = d.y;
    } else {
      label.anchor.set(1, 0.5);
      label.x = d.x - 12;
      label.y = d.y;
    }
    stage.addChild(label);
  });

  return stage;
}
