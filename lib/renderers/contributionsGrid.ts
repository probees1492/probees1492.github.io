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
};

export function renderContributionsGrid(
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

  // Left column — contribution cards
  const items = slide.contributions ?? [];
  const cardX = 60;
  const cardW = 470;
  const cardTopY = items.length >= 5 ? 170 : 195;
  const cardBottomY = height - 50;
  const cardGap = items.length >= 5 ? 8 : 10;
  const totalAvail = cardBottomY - cardTopY;
  const cardH = (totalAvail - cardGap * (items.length - 1)) / Math.max(1, items.length);

  items.forEach((c, i) => {
    const y = cardTopY + i * (cardH + cardGap);

    const card = new Graphics();
    card.roundRect(cardX, y, cardW, cardH, 8);
    card.fill(COLOR.fill);
    card.stroke({ width: 1, color: COLOR.border });
    stage.addChild(card);

    // Green left accent bar (sits inside card, slightly inset from rounded corners)
    const accent = new Graphics();
    accent.rect(cardX + 2, y + 8, 3, cardH - 16);
    accent.fill(COLOR.current);
    stage.addChild(accent);

    // Label
    const label = new Text({
      text: c.label,
      style: new TextStyle({
        fontFamily: HELV,
        fontSize: 14,
        fontWeight: "600",
        fill: COLOR.text,
      }),
    });
    label.x = cardX + 20;
    label.y = y + 12;
    stage.addChild(label);

    // Detail (wraps)
    if (c.detail) {
      const detail = new Text({
        text: c.detail,
        style: new TextStyle({
          fontFamily: HELV,
          fontSize: 11,
          fontWeight: "400",
          fill: COLOR.meta,
          wordWrap: true,
          wordWrapWidth: cardW - 40,
          lineHeight: 16,
        }),
      });
      detail.x = cardX + 20;
      detail.y = y + 34;
      stage.addChild(detail);
    }
  });

  // Right column — sections (same as tech-stack)
  const notesX = 580;
  const notesW = width - notesX - 60;
  const sections = slide.sections ?? [];

  let sectionY = 195;
  sections.forEach((section) => {
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
