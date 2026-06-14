import { Container, Graphics, Text, TextStyle } from "pixi.js";
import type { Slide } from "../slidesData";
import type { LayoutConfig } from "../layouts";
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
};

export function renderTechStack(
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

  // Diagram on left
  const layers = slide.stack ?? [];
  const diagX = 60;
  const diagW = 470;
  const diagTopY = 190;
  const diagBottomY = height - 50;
  const diagAvail = diagBottomY - diagTopY;
  const gap = 14;

  // Highlighted layer slightly taller
  const hlIdx = layers.findIndex((l) => l.highlight);
  const nonHL = layers.length - 1;
  const totalH = diagAvail - gap * (layers.length - 1);
  // base height; highlighted gets 1.35x
  const baseH = totalH / (nonHL + 1.35);
  const heights = layers.map((l) => (l.highlight ? baseH * 1.35 : baseH));

  let y = diagTopY;
  layers.forEach((layer, i) => {
    const layerH = heights[i];
    const isHL = layer.highlight === true;

    // Box
    const box = new Graphics();
    box.roundRect(diagX, y, diagW, layerH, 10);
    if (isHL) {
      box.fill({ color: COLOR.current, alpha: 0.1 });
      box.stroke({ width: 2, color: COLOR.current });
    } else {
      box.fill(COLOR.fill);
      box.stroke({ width: 1, color: COLOR.border });
    }
    stage.addChild(box);

    // Layer label (top of box)
    const label = new Text({
      text: layer.label,
      style: new TextStyle({
        fontFamily: HELV,
        fontSize: 17,
        fontWeight: "600",
        fill: isHL ? COLOR.current : COLOR.text,
      }),
    });
    label.x = diagX + 20;
    label.y = y + 16;
    stage.addChild(label);

    // Highlight annotation right next to label
    if (isHL && layer.highlightLabel) {
      const annot = new Text({
        text: `← ${layer.highlightLabel}`,
        style: new TextStyle({
          fontFamily: MONO,
          fontSize: 11,
          fontWeight: "500",
          fill: COLOR.current,
        }),
      });
      annot.x = label.x + label.width + 12;
      annot.y = y + 20;
      stage.addChild(annot);
    }

    // Detail
    if (layer.detail) {
      const detail = new Text({
        text: layer.detail,
        style: new TextStyle({
          fontFamily: HELV,
          fontSize: 12,
          fontWeight: "400",
          fill: isHL ? COLOR.currentText : COLOR.meta,
          lineHeight: 19,
          wordWrap: true,
          wordWrapWidth: diagW - 40,
        }),
      });
      detail.x = diagX + 20;
      detail.y = y + 44;
      stage.addChild(detail);
    }

    // Connector line between layers
    if (i < layers.length - 1) {
      const conn = new Graphics();
      const cx = diagX + diagW / 2;
      conn.moveTo(cx, y + layerH + 2);
      conn.lineTo(cx, y + layerH + gap - 2);
      conn.stroke({ width: 1, color: COLOR.border });
      // tiny arrowheads (double)
      conn.moveTo(cx - 3, y + layerH + 5);
      conn.lineTo(cx, y + layerH + 2);
      conn.lineTo(cx + 3, y + layerH + 5);
      conn.stroke({ width: 1, color: COLOR.border });
      conn.moveTo(cx - 3, y + layerH + gap - 5);
      conn.lineTo(cx, y + layerH + gap - 2);
      conn.lineTo(cx + 3, y + layerH + gap - 5);
      conn.stroke({ width: 1, color: COLOR.border });
      stage.addChild(conn);
    }

    y += layerH + gap;
  });

  // Right column — sections
  const notesX = 580;
  const notesW = width - notesX - 60;
  const sections = slide.sections ?? [];

  let sectionY = 190;
  sections.forEach((section, sIdx) => {
    // Section title
    const nt = new Text({
      text: section.title,
      style: new TextStyle({
        fontFamily: MONO,
        fontSize: 11,
        fontWeight: "500",
        fill: COLOR.faint,
        letterSpacing: 1.5,
      }),
    });
    nt.x = notesX;
    nt.y = sectionY;
    stage.addChild(nt);

    const titleRule = new Graphics();
    titleRule.moveTo(notesX, sectionY + 20);
    titleRule.lineTo(notesX + 40, sectionY + 20);
    titleRule.stroke({ width: 1, color: COLOR.faint });
    stage.addChild(titleRule);

    let itemY = sectionY + 38;
    section.items.forEach((item) => {
      const bullet = new Graphics();
      bullet.circle(notesX + 4, itemY + 8, 3);
      bullet.fill(COLOR.current);
      stage.addChild(bullet);

      const t = new Text({
        text: item,
        style: new TextStyle({
          fontFamily: HELV,
          fontSize: 13,
          fontWeight: "400",
          fill: COLOR.text,
          wordWrap: true,
          wordWrapWidth: notesW - 20,
          lineHeight: 20,
        }),
      });
      t.x = notesX + 16;
      t.y = itemY;
      stage.addChild(t);
      itemY += t.height + 10;
    });

    sectionY = itemY + 18;
  });

  return stage;
}
