import { Container, Graphics, Text, TextStyle } from "pixi.js";
import type { Slide } from "../slidesData";
import type { LayoutConfig } from "../layouts";
import { t, type Lang } from "../i18n";
import { makeText } from "./textHelpers";

const HELV = "Helvetica Neue, -apple-system, sans-serif";
const MONO = "ui-monospace, 'SF Mono', Menlo, monospace";

const COLOR = {
  text: 0xffffff,
  meta: 0x9ca3af,
  faint: 0x6b7280,
  border: 0x3f3f46,
  fill: 0x101015,
  current: 0x22c55e,
  trackBg: 0x222226,
};

export function renderHobbyCard(
  slide: Slide,
  layout: LayoutConfig,
  width: number,
  height: number,
  lang: Lang = "ko",
): Container {
  const stage = new Container();

  const bg = new Graphics();
  bg.rect(0, 0, width, height);
  bg.fill(layout.background.color);
  stage.addChild(bg);

  if (slide.intro && layout.intro) {
    const t = makeText(slide.intro, layout.intro.style);
    t.x = layout.intro.position.x;
    t.y = layout.intro.position.y;
    stage.addChild(t);
  }
  if (slide.title && layout.title) {
    const t = makeText(slide.title, layout.title.style);
    t.x = layout.title.position.x;
    t.y = layout.title.position.y;
    stage.addChild(t);
  }

  // Left column — info panel
  const leftX = 60;
  const leftW = 400;
  let y = 170;

  // Progress section
  if (typeof slide.progress === "number") {
    const progLabel = new Text({
      text: t(lang, "progress"),
      style: new TextStyle({
        fontFamily: MONO,
        fontSize: 11,
        fontWeight: "500",
        fill: COLOR.faint,
        letterSpacing: 1.5,
      }),
    });
    progLabel.x = leftX;
    progLabel.y = y;
    stage.addChild(progLabel);

    const progValue = new Text({
      text: `${slide.progress}%`,
      style: new TextStyle({
        fontFamily: HELV,
        fontSize: 28,
        fontWeight: "600",
        fill: COLOR.current,
      }),
    });
    progValue.anchor.set(1, 0);
    progValue.x = leftX + leftW;
    progValue.y = y - 8;
    stage.addChild(progValue);

    // Progress bar track + fill
    y += 28;
    const trackH = 6;
    const track = new Graphics();
    track.roundRect(leftX, y, leftW, trackH, trackH / 2);
    track.fill(COLOR.trackBg);
    stage.addChild(track);

    const fillW = (leftW * Math.max(0, Math.min(100, slide.progress))) / 100;
    const fill = new Graphics();
    fill.roundRect(leftX, y, fillW, trackH, trackH / 2);
    fill.fill(COLOR.current);
    stage.addChild(fill);

    y += trackH + 30;
  }

  // Goal section
  if (slide.goal) {
    const goalLabel = new Text({
      text: t(lang, "goal"),
      style: new TextStyle({
        fontFamily: MONO,
        fontSize: 11,
        fontWeight: "500",
        fill: COLOR.faint,
        letterSpacing: 1.5,
      }),
    });
    goalLabel.x = leftX;
    goalLabel.y = y;
    stage.addChild(goalLabel);

    y += 22;

    const goalText = new Text({
      text: slide.goal,
      style: new TextStyle({
        fontFamily: HELV,
        fontSize: 16,
        fontWeight: "500",
        fill: COLOR.text,
        wordWrap: true,
        wordWrapWidth: leftW,
        lineHeight: 24,
      }),
    });
    goalText.x = leftX;
    goalText.y = y;
    stage.addChild(goalText);
    y += goalText.height + 24;
  }

  // Components section
  if (slide.components && slide.components.length > 0) {
    const compLabel = new Text({
      text: t(lang, "components"),
      style: new TextStyle({
        fontFamily: MONO,
        fontSize: 11,
        fontWeight: "500",
        fill: COLOR.faint,
        letterSpacing: 1.5,
      }),
    });
    compLabel.x = leftX;
    compLabel.y = y;
    stage.addChild(compLabel);
    y += 22;

    slide.components.forEach((c) => {
      const bullet = new Graphics();
      bullet.circle(leftX + 4, y + 8, 2.5);
      bullet.fill(COLOR.current);
      stage.addChild(bullet);

      const t = new Text({
        text: c,
        style: new TextStyle({
          fontFamily: HELV,
          fontSize: 13,
          fontWeight: "400",
          fill: COLOR.text,
        }),
      });
      t.x = leftX + 16;
      t.y = y;
      stage.addChild(t);
      y += 22;
    });
  }

  // Right column — video placeholder frame (iframe overlays from DOM)
  if (slide.videoArea) {
    const a = slide.videoArea;
    const frame = new Graphics();
    frame.roundRect(a.x, a.y, a.w, a.h, 10);
    frame.fill(0x0a0a0d);
    frame.stroke({ width: 1, color: COLOR.border });
    stage.addChild(frame);

    // Hint text inside the frame (covered by iframe when overlay mounts)
    const hint = new Text({
      text: t(lang, "loadingVideo"),
      style: new TextStyle({
        fontFamily: MONO,
        fontSize: 12,
        fontWeight: "400",
        fill: COLOR.faint,
      }),
    });
    hint.anchor.set(0.5, 0.5);
    hint.x = a.x + a.w / 2;
    hint.y = a.y + a.h / 2;
    stage.addChild(hint);
  }

  return stage;
}
