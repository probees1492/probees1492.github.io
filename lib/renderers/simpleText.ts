import { Container, Graphics } from "pixi.js";
import type { Slide } from "../slidesData";
import type { LayoutConfig } from "../layouts";
import { makeText, placeAnchored, renderLinks } from "./textHelpers";

export function renderSimpleText(
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

  if (slide.intro && layout.intro) {
    const t = makeText(slide.intro, layout.intro.style);
    placeAnchored(t, layout.intro.position);
    c.addChild(t);
  }

  if (slide.title && layout.title) {
    const t = makeText(slide.title, layout.title.style);
    placeAnchored(t, layout.title.position);
    c.addChild(t);
  }

  if (slide.body && layout.body) {
    const t = makeText(slide.body, layout.body.style);
    placeAnchored(t, layout.body.position);
    c.addChild(t);
  }

  if (slide.paragraphs?.length && layout.body) {
    const baseY = layout.body.position.y + (slide.body ? 80 : 0);
    const lh = layout.body.style.lineHeight ?? layout.body.style.fontSize * 1.5;
    let y = baseY;
    for (const p of slide.paragraphs) {
      const t = makeText(p, layout.body.style);
      t.x = layout.body.position.x;
      t.y = y;
      c.addChild(t);
      y += t.height + lh * 0.4;
    }
  }

  if (slide.bullets?.length && layout.links) {
    const lh = layout.links.style.lineHeight ?? layout.links.style.fontSize * 1.4;
    let y = layout.links.position.y;
    for (const b of slide.bullets) {
      const t = makeText(`— ${b}`, layout.links.style);
      t.x = layout.links.position.x;
      t.y = y;
      c.addChild(t);
      y += lh;
    }
  }

  if (slide.links?.length && layout.links) {
    const offsetY =
      (slide.bullets?.length ?? 0) *
      (layout.links.style.lineHeight ?? layout.links.style.fontSize * 1.4);
    renderLinks(
      c,
      slide.links,
      layout.links.style,
      layout.links.position.x,
      layout.links.position.y + offsetY + (slide.bullets?.length ? 40 : 0),
      onNavigate,
    );
  }

  return c;
}
