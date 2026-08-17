import { Container, Graphics, Text, TextStyle } from "pixi.js";
import type { Slide } from "../slidesData";
import type { LayoutConfig } from "../layouts";
import { t, type Lang } from "../i18n";
import { RESUME_PALETTE as COLOR } from "../palette";
import { makeText } from "./textHelpers";

const START_YEAR = 2010;
const END_YEAR = 2026;
const TOTAL_YEARS = END_YEAR - START_YEAR;

const HELV = "Helvetica Neue, -apple-system, sans-serif";
const MONO = "ui-monospace, 'SF Mono', Menlo, monospace";

export function renderCareerTimeline(
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

  // Zones
  const leftTextX = 60;
  const leftTextW = 230;
  const axisLeft = leftTextX + leftTextW + 30; // 320
  const axisRight = width - 80; // 920
  const axisWidth = axisRight - axisLeft; // 600
  const pxPerYear = axisWidth / TOTAL_YEARS; // 37.5
  const yearToX = (y: number) => axisLeft + (y - START_YEAR) * pxPerYear;

  const careers = slide.careers ?? [];

  // Vertical layout: rows
  const startY = 110;
  const bottomBuffer = 80;
  const rowsArea = height - startY - bottomBuffer;
  const rowH = rowsArea / Math.max(1, careers.length);

  // Vertical gridlines at 5-year marks (subtle)
  for (const yr of [2015, 2020, 2025]) {
    const g = new Graphics();
    const x = yearToX(yr);
    g.moveTo(x, startY - 4);
    g.lineTo(x, startY + rowsArea - 4);
    g.stroke({ width: 1, color: COLOR.border });
    stage.addChild(g);
    const lbl = new Text({
      text: `${yr}`,
      style: new TextStyle({
        fontFamily: MONO,
        fontSize: 10,
        fontWeight: "400",
        fill: COLOR.subtle,
      }),
    });
    lbl.anchor.set(0.5, 0);
    lbl.x = x;
    lbl.y = startY - 24;
    stage.addChild(lbl);
  }

  // Bottom axis
  const axisLineY = startY + rowsArea + 4;
  const axisLine = new Graphics();
  axisLine.moveTo(axisLeft, axisLineY);
  axisLine.lineTo(axisRight, axisLineY);
  axisLine.stroke({ width: 1, color: COLOR.border });
  stage.addChild(axisLine);

  const startAxisLbl = new Text({
    text: `${START_YEAR}`,
    style: new TextStyle({ fontFamily: MONO, fontSize: 11, fontWeight: "400", fill: COLOR.subtle }),
  });
  startAxisLbl.anchor.set(0, 0);
  startAxisLbl.x = axisLeft;
  startAxisLbl.y = axisLineY + 8;
  stage.addChild(startAxisLbl);

  const endAxisLbl = new Text({
    text: t(lang, "current"),
    style: new TextStyle({ fontFamily: MONO, fontSize: 11, fontWeight: "500", fill: COLOR.accent }),
  });
  endAxisLbl.anchor.set(1, 0);
  endAxisLbl.x = axisRight;
  endAxisLbl.y = axisLineY + 8;
  stage.addChild(endAxisLbl);

  careers.forEach((c, i) => {
    const rowY = startY + i * rowH;
    const isCurrent = !!c.endLabel;
    const barColor = isCurrent ? COLOR.accent : COLOR.ink;

    const barH = 8;
    const barY = rowY + rowH / 2 - barH / 2;
    const xStart = yearToX(c.start);
    const xEnd = yearToX(c.end);
    const barW = Math.max(2, xEnd - xStart);

    // Bar
    const bar = new Graphics();
    bar.roundRect(xStart, barY, barW, barH, barH / 2);
    bar.fill(barColor);
    stage.addChild(bar);

    // Endpoint dot for current
    if (isCurrent) {
      const dot = new Graphics();
      dot.circle(xEnd, barY + barH / 2, 6);
      dot.fill(COLOR.accent);
      stage.addChild(dot);

      // Faint pulse halo
      const halo = new Graphics();
      halo.circle(xEnd, barY + barH / 2, 11);
      halo.fill({ color: COLOR.accent, alpha: 0.18 });
      stage.addChild(halo);
    }

    // Text block — vertically centered on row (4 lines max)
    const lineH = 18;
    const lineCount = c.description ? 4 : 3;
    const blockTopY = rowY + rowH / 2 - (lineCount * lineH) / 2 + 4;
    let lineY = blockTopY;

    // Company name
    const name = new Text({
      text: c.name,
      style: new TextStyle({
        fontFamily: HELV,
        fontSize: 15,
        fontWeight: "600",
        fill: COLOR.ink,
      }),
    });
    name.x = leftTextX;
    name.y = lineY;
    stage.addChild(name);
    lineY += lineH;

    // Company description (italic, muted)
    if (c.description) {
      const desc = new Text({
        text: c.description,
        style: new TextStyle({
          fontFamily: HELV,
          fontSize: 11,
          fontStyle: "italic",
          fontWeight: "400",
          fill: COLOR.muted,
        }),
      });
      desc.x = leftTextX;
      desc.y = lineY;
      stage.addChild(desc);
      lineY += lineH;
    }

    // Title (직급)
    const titleText = new Text({
      text: c.title,
      style: new TextStyle({
        fontFamily: HELV,
        fontSize: 12,
        fontWeight: "500",
        fill: isCurrent ? COLOR.accent : COLOR.ink,
      }),
    });
    titleText.x = leftTextX;
    titleText.y = lineY;
    stage.addChild(titleText);
    lineY += lineH;

    // Role
    const role = new Text({
      text: c.role,
      style: new TextStyle({
        fontFamily: HELV,
        fontSize: 11,
        fontWeight: "400",
        fill: COLOR.muted,
      }),
    });
    role.x = leftTextX;
    role.y = lineY;
    stage.addChild(role);

    // Year labels at bar endpoints
    const startLabel = new Text({
      text: `${c.start}`,
      style: new TextStyle({
        fontFamily: MONO,
        fontSize: 11,
        fontWeight: "400",
        fill: COLOR.muted,
      }),
    });
    startLabel.anchor.set(1, 0.5);
    startLabel.x = xStart - 8;
    startLabel.y = barY + barH / 2;
    stage.addChild(startLabel);

    const endLabelText = c.endLabel || `${c.end}`;
    const endLabel = new Text({
      text: endLabelText,
      style: new TextStyle({
        fontFamily: MONO,
        fontSize: 11,
        fontWeight: isCurrent ? "500" : "400",
        fill: isCurrent ? COLOR.accent : COLOR.muted,
      }),
    });
    endLabel.anchor.set(0, 0.5);
    endLabel.x = xEnd + (isCurrent ? 14 : 8);
    endLabel.y = barY + barH / 2;
    stage.addChild(endLabel);
  });

  return stage;
}
