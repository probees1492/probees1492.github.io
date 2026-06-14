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
  currentText: 0xa7f3d0,
  arrow: 0x666666,
};

export function renderWorkflowPipeline(
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

  const stages = slide.pipeline ?? [];
  if (stages.length === 0) return stage;

  const padX = 60;
  const availW = width - padX * 2;
  const arrowW = 32;
  const boxW = (availW - arrowW * (stages.length - 1)) / stages.length;
  const boxH = 300;
  const boxTopY = 200;

  stages.forEach((s, i) => {
    const boxX = padX + i * (boxW + arrowW);
    const isHL = s.highlight === true;

    // Stage label above box (small, mono, letter-spaced)
    if (s.stage) {
      const stageLabel = new Text({
        text: s.stage,
        style: new TextStyle({
          fontFamily: MONO,
          fontSize: 10,
          fontWeight: "500",
          fill: isHL ? COLOR.current : COLOR.faint,
          letterSpacing: 2,
        }),
      });
      stageLabel.x = boxX + 14;
      stageLabel.y = boxTopY - 22;
      stage.addChild(stageLabel);
    }

    // Box
    const box = new Graphics();
    box.roundRect(boxX, boxTopY, boxW, boxH, 10);
    if (isHL) {
      box.fill({ color: COLOR.current, alpha: 0.1 });
      box.stroke({ width: 2, color: COLOR.current });
    } else {
      box.fill(COLOR.fill);
      box.stroke({ width: 1, color: COLOR.border });
    }
    stage.addChild(box);

    // Box title
    const label = new Text({
      text: s.label,
      style: new TextStyle({
        fontFamily: HELV,
        fontSize: 14,
        fontWeight: "600",
        fill: isHL ? COLOR.current : COLOR.text,
        wordWrap: true,
        wordWrapWidth: boxW - 32,
        lineHeight: 20,
      }),
    });
    label.x = boxX + 16;
    label.y = boxTopY + 18;
    stage.addChild(label);

    // Items
    if (s.items && s.items.length > 0) {
      let itemY = boxTopY + 60;
      s.items.forEach((item) => {
        const bullet = new Graphics();
        bullet.circle(boxX + 22, itemY + 8, 2.5);
        bullet.fill(isHL ? COLOR.current : COLOR.meta);
        stage.addChild(bullet);

        const t = new Text({
          text: item,
          style: new TextStyle({
            fontFamily: HELV,
            fontSize: 12,
            fontWeight: "400",
            fill: isHL ? COLOR.currentText : COLOR.meta,
            wordWrap: true,
            wordWrapWidth: boxW - 44,
            lineHeight: 18,
          }),
        });
        t.x = boxX + 32;
        t.y = itemY;
        stage.addChild(t);
        itemY += t.height + 8;
      });
    }

    // Arrow to next box
    if (i < stages.length - 1) {
      const ax = boxX + boxW;
      const ay = boxTopY + boxH / 2;
      const arrow = new Graphics();
      arrow.moveTo(ax + 6, ay);
      arrow.lineTo(ax + arrowW - 8, ay);
      arrow.stroke({ width: 1.5, color: COLOR.arrow });
      arrow.moveTo(ax + arrowW - 12, ay - 5);
      arrow.lineTo(ax + arrowW - 6, ay);
      arrow.lineTo(ax + arrowW - 12, ay + 5);
      arrow.stroke({ width: 1.5, color: COLOR.arrow });
      stage.addChild(arrow);
    }
  });

  // Footer (key success point) — uses slide.body
  if (slide.body) {
    const footerY = boxTopY + boxH + 28;
    const labelPill = new Text({
      text: t(lang, "keyExperience"),
      style: new TextStyle({
        fontFamily: HELV,
        fontSize: 11,
        fontWeight: "600",
        fill: 0x000000,
      }),
    });
    const padW = 10;
    const padH = 4;
    const pw = labelPill.width + padW * 2;
    const ph = labelPill.height + padH * 2;
    const px = padX;
    const py = footerY;
    const pill = new Graphics();
    pill.roundRect(px, py, pw, ph, ph / 2);
    pill.fill(COLOR.current);
    stage.addChild(pill);
    labelPill.x = px + padW;
    labelPill.y = py + padH;
    stage.addChild(labelPill);

    const bodyText = new Text({
      text: slide.body,
      style: new TextStyle({
        fontFamily: HELV,
        fontSize: 13,
        fontWeight: "400",
        fill: COLOR.text,
        wordWrap: true,
        wordWrapWidth: width - padX * 2 - pw - 16,
        lineHeight: 20,
      }),
    });
    bodyText.x = px + pw + 14;
    bodyText.y = py + Math.max(0, (ph - bodyText.height) / 2);
    stage.addChild(bodyText);
  }

  return stage;
}
