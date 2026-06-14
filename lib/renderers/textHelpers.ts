import { Container, Text, TextStyle, Graphics } from "pixi.js";
import type { TextStyle as LayoutTextStyle } from "../layouts";
import type { SlideLink } from "../slidesData";

export function makeText(content: string, style: LayoutTextStyle): Text {
  const ts = new TextStyle({
    fontFamily: style.fontFamily,
    fontSize: style.fontSize,
    fontWeight: style.fontWeight as any,
    fill: style.fill,
    align: style.align ?? "left",
    fontStyle: style.fontStyle ?? "normal",
    lineHeight: style.lineHeight,
    wordWrap: style.wordWrap ?? false,
    wordWrapWidth: style.wordWrapWidth,
  });
  return new Text({ text: content, style: ts });
}

export function placeAnchored(
  text: Text,
  pos: { x: number; y: number; anchor?: { x: number; y: number } },
) {
  if (pos.anchor) text.anchor.set(pos.anchor.x, pos.anchor.y);
  text.x = pos.x;
  text.y = pos.y;
}

export function renderLinks(
  container: Container,
  links: SlideLink[],
  style: LayoutTextStyle,
  startX: number,
  startY: number,
  onActivate: (url: string) => void,
) {
  let y = startY;
  const lh = style.lineHeight ?? style.fontSize * 1.4;
  for (const link of links) {
    const t = makeText(link.text, style);
    t.x = startX;
    t.y = y;
    t.eventMode = "static";
    t.cursor = "pointer";
    t.on("pointertap", (e) => {
      e.stopPropagation();
      onActivate(link.url);
    });
    t.on("pointerover", () => {
      t.alpha = 0.6;
    });
    t.on("pointerout", () => {
      t.alpha = 1;
    });
    const underline = new Graphics();
    underline.moveTo(startX, y + style.fontSize + 4);
    underline.lineTo(startX + t.width, y + style.fontSize + 4);
    underline.stroke({ width: 1, color: style.fill, alpha: 0.4 });
    container.addChild(underline);
    container.addChild(t);
    y += lh;
  }
}
