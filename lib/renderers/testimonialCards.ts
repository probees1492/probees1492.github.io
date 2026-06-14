import { Container, Graphics, Text, TextStyle, FederatedPointerEvent } from "pixi.js";
import type { Slide } from "../slidesData";
import type { LayoutConfig } from "../layouts";
import { makeText } from "./textHelpers";

export function renderTestimonialCards(
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
    t.anchor.set(0.5, 0);
    t.x = layout.intro.position.x;
    t.y = layout.intro.position.y;
    stage.addChild(t);
  }
  if (slide.title && layout.title) {
    const t = makeText(slide.title, layout.title.style);
    t.anchor.set(0.5, 0);
    t.x = layout.title.position.x;
    t.y = layout.title.position.y;
    stage.addChild(t);
  }

  const testimonials = slide.testimonials ?? [];
  const cardW = 440;
  const cardH = 280;
  const centerX = width / 2;
  const centerY = height / 2;

  const cardsLayer = new Container();
  stage.addChild(cardsLayer);

  const cards: Container[] = [];
  testimonials.forEach((t, idx) => {
    const card = new Container();
    const bg = new Graphics();
    bg.roundRect(-cardW / 2, -cardH / 2, cardW, cardH, 14);
    bg.fill(0x111111);
    bg.stroke({ width: 1, color: 0x333333 });
    card.addChild(bg);

    const quote = new Text({
      text: `"${t.quote}"`,
      style: new TextStyle({
        fontFamily: "Helvetica Neue, sans-serif",
        fontSize: 15,
        fontWeight: "400",
        fill: 0xffffff,
        wordWrap: true,
        wordWrapWidth: cardW - 60,
        lineHeight: 24,
      }),
    });
    quote.anchor.set(0, 0);
    quote.x = -cardW / 2 + 30;
    quote.y = -cardH / 2 + 30;
    card.addChild(quote);

    const name = new Text({
      text: t.name,
      style: new TextStyle({
        fontFamily: "Helvetica Neue, sans-serif",
        fontSize: 14,
        fontWeight: "500",
        fill: 0xffffff,
      }),
    });
    name.x = -cardW / 2 + 30;
    name.y = cardH / 2 - 60;
    card.addChild(name);

    const company = new Text({
      text: t.company,
      style: new TextStyle({
        fontFamily: "ui-monospace, monospace",
        fontSize: 12,
        fontWeight: "400",
        fill: 0x888888,
      }),
    });
    company.x = -cardW / 2 + 30;
    company.y = cardH / 2 - 38;
    card.addChild(company);

    cards.push(card);
    cardsLayer.addChild(card);
  });

  let stackOrder = cards.map((_, i) => i);

  function applyStackLayout(animate = true) {
    stackOrder.forEach((cardIdx, depth) => {
      const card = cards[cardIdx];
      const offset = depth * 12;
      const tx = centerX + offset;
      const ty = centerY + offset;
      const ts = 1 - depth * 0.04;
      const tr = depth * 0.02;
      if (!animate) {
        card.x = tx; card.y = ty; card.scale.set(ts); card.rotation = tr;
        cardsLayer.setChildIndex(card, stackOrder.length - 1 - depth);
        return;
      }
      const sx = card.x, sy = card.y, ss = card.scale.x, sr = card.rotation;
      const t0 = performance.now();
      const step = (now: number) => {
        const t = Math.min((now - t0) / 280, 1);
        const e = 1 - Math.pow(1 - t, 3);
        card.x = sx + (tx - sx) * e;
        card.y = sy + (ty - sy) * e;
        const sc = ss + (ts - ss) * e;
        card.scale.set(sc);
        card.rotation = sr + (tr - sr) * e;
        if (t < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      cardsLayer.setChildIndex(card, stackOrder.length - 1 - depth);
    });
  }

  function shuffleTop() {
    const top = stackOrder.shift();
    if (top !== undefined) stackOrder.push(top);
    applyStackLayout();
  }

  cards.forEach((card, idx) => {
    card.eventMode = "static";
    card.cursor = "grab";
    let dragging = false;
    let dx = 0, dy = 0;
    let moved = false;
    card.on("pointerdown", (e: FederatedPointerEvent) => {
      if (stackOrder[0] !== idx) return;
      dragging = true;
      moved = false;
      const p = e.global;
      dx = card.x - p.x;
      dy = card.y - p.y;
      card.cursor = "grabbing";
    });
    card.on("globalpointermove", (e: FederatedPointerEvent) => {
      if (!dragging) return;
      moved = true;
      card.x = e.global.x + dx;
      card.y = e.global.y + dy;
    });
    const release = () => {
      if (!dragging) return;
      dragging = false;
      card.cursor = "grab";
      const distance = Math.hypot(card.x - centerX, card.y - centerY);
      if (distance > 120 || !moved) shuffleTop();
      else applyStackLayout();
    };
    card.on("pointerup", release);
    card.on("pointerupoutside", release);
  });

  applyStackLayout(false);
  return stage;
}
