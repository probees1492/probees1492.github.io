import type { LayoutId } from "./slidesData";
import { RESUME_PALETTE as COLOR } from "./palette";

export interface TextStyle {
  fontFamily: string;
  fontSize: number;
  fontWeight: string;
  fill: number;
  align?: "left" | "center" | "right";
  fontStyle?: "normal" | "italic";
  lineHeight?: number;
  wordWrap?: boolean;
  wordWrapWidth?: number;
}

export interface LayoutConfig {
  id: LayoutId;
  background: { color: number };
  intro?: { style: TextStyle; position: { x: number; y: number } };
  title?: { style: TextStyle; position: { x: number; y: number; anchor?: { x: number; y: number } } };
  body?: { style: TextStyle; position: { x: number; y: number } };
  links?: { style: TextStyle; position: { x: number; y: number } };
}

const HELV = "Helvetica Neue, -apple-system, BlinkMacSystemFont, sans-serif";
const MONO = "ui-monospace, 'SF Mono', Menlo, monospace";
const IVY = "'Times New Roman', serif";

export const layouts: Record<LayoutId, LayoutConfig> = {
  "particle-globe": {
    id: "particle-globe",
    background: { color: COLOR.page },
    title: {
      style: { fontFamily: IVY, fontSize: 56, fontWeight: "400", fill: COLOR.ink, align: "center", fontStyle: "italic", lineHeight: 64 },
      position: { x: 500, y: 280, anchor: { x: 0.5, y: 0.5 } },
    },
    body: {
      style: { fontFamily: HELV, fontSize: 14, fontWeight: "400", fill: COLOR.muted, align: "center", lineHeight: 22 },
      position: { x: 500, y: 360 },
    },
  },
  "intro-layout-dark": {
    id: "intro-layout-dark",
    background: { color: COLOR.page },
    intro: {
      style: { fontFamily: MONO, fontSize: 14, fontWeight: "400", fill: COLOR.muted, lineHeight: 22 },
      position: { x: 60, y: 60 },
    },
    title: {
      style: { fontFamily: HELV, fontSize: 36, fontWeight: "500", fill: COLOR.ink, align: "left", lineHeight: 48, wordWrap: true, wordWrapWidth: 880 },
      position: { x: 60, y: 180 },
    },
    body: {
      style: { fontFamily: HELV, fontSize: 16, fontWeight: "400", fill: COLOR.ink, align: "left", lineHeight: 26, wordWrap: true, wordWrapWidth: 720 },
      position: { x: 60, y: 420 },
    },
    links: {
      style: { fontFamily: HELV, fontSize: 14, fontWeight: "500", fill: COLOR.accent, lineHeight: 22 },
      position: { x: 60, y: 500 },
    },
  },
  "projects-index-dark": {
    id: "projects-index-dark",
    background: { color: COLOR.page },
    intro: {
      style: { fontFamily: MONO, fontSize: 14, fontWeight: "400", fill: COLOR.muted, lineHeight: 22 },
      position: { x: 60, y: 60 },
    },
    title: {
      style: { fontFamily: HELV, fontSize: 48, fontWeight: "500", fill: COLOR.ink, lineHeight: 56 },
      position: { x: 60, y: 120 },
    },
    links: {
      style: { fontFamily: HELV, fontSize: 22, fontWeight: "400", fill: COLOR.ink, lineHeight: 40 },
      position: { x: 60, y: 220 },
    },
  },
  "about-layout-dark": {
    id: "about-layout-dark",
    background: { color: COLOR.page },
    intro: {
      style: { fontFamily: MONO, fontSize: 14, fontWeight: "400", fill: COLOR.muted, lineHeight: 22 },
      position: { x: 60, y: 60 },
    },
    title: {
      style: { fontFamily: HELV, fontSize: 32, fontWeight: "500", fill: COLOR.ink, lineHeight: 42, wordWrap: true, wordWrapWidth: 880 },
      position: { x: 60, y: 120 },
    },
    body: {
      style: { fontFamily: HELV, fontSize: 16, fontWeight: "400", fill: COLOR.ink, lineHeight: 26, wordWrap: true, wordWrapWidth: 720 },
      position: { x: 60, y: 260 },
    },
    links: {
      style: { fontFamily: HELV, fontSize: 14, fontWeight: "500", fill: COLOR.accent, lineHeight: 24 },
      position: { x: 60, y: 500 },
    },
  },
  "philosophy-layout": {
    id: "philosophy-layout",
    background: { color: COLOR.page },
    intro: {
      style: { fontFamily: MONO, fontSize: 14, fontWeight: "400", fill: COLOR.muted, lineHeight: 22 },
      position: { x: 60, y: 60 },
    },
    title: {
      style: { fontFamily: IVY, fontSize: 36, fontStyle: "italic", fontWeight: "400", fill: COLOR.ink, lineHeight: 48, wordWrap: true, wordWrapWidth: 880 },
      position: { x: 60, y: 120 },
    },
    body: {
      style: { fontFamily: HELV, fontSize: 15, fontWeight: "400", fill: COLOR.ink, lineHeight: 24, wordWrap: true, wordWrapWidth: 820 },
      position: { x: 60, y: 240 },
    },
  },
  "tech-stack": {
    id: "tech-stack",
    background: { color: COLOR.page },
    intro: {
      style: { fontFamily: MONO, fontSize: 13, fontWeight: "400", fill: COLOR.muted, lineHeight: 20 },
      position: { x: 60, y: 50 },
    },
    title: {
      style: { fontFamily: HELV, fontSize: 22, fontWeight: "500", fill: COLOR.ink, lineHeight: 30, wordWrap: true, wordWrapWidth: 880 },
      position: { x: 60, y: 78 },
    },
  },
  "contributions-grid": {
    id: "contributions-grid",
    background: { color: COLOR.page },
    intro: {
      style: { fontFamily: MONO, fontSize: 13, fontWeight: "400", fill: COLOR.muted, lineHeight: 20 },
      position: { x: 60, y: 50 },
    },
    title: {
      style: { fontFamily: HELV, fontSize: 22, fontWeight: "500", fill: COLOR.ink, lineHeight: 30, wordWrap: true, wordWrapWidth: 880 },
      position: { x: 60, y: 78 },
    },
  },
  "workflow-pipeline": {
    id: "workflow-pipeline",
    background: { color: COLOR.page },
    intro: {
      style: { fontFamily: MONO, fontSize: 13, fontWeight: "400", fill: COLOR.muted, lineHeight: 20 },
      position: { x: 60, y: 50 },
    },
    title: {
      style: { fontFamily: HELV, fontSize: 22, fontWeight: "500", fill: COLOR.ink, lineHeight: 30, wordWrap: true, wordWrapWidth: 880 },
      position: { x: 60, y: 78 },
    },
  },
  "hobby-card": {
    id: "hobby-card",
    background: { color: COLOR.page },
    intro: {
      style: { fontFamily: MONO, fontSize: 13, fontWeight: "400", fill: COLOR.muted, lineHeight: 20 },
      position: { x: 60, y: 50 },
    },
    title: {
      style: { fontFamily: IVY, fontSize: 32, fontStyle: "italic", fontWeight: "400", fill: COLOR.ink, lineHeight: 40, wordWrap: true, wordWrapWidth: 880 },
      position: { x: 60, y: 78 },
    },
  },
  "connecting-dots": {
    id: "connecting-dots",
    background: { color: COLOR.page },
    intro: {
      style: { fontFamily: MONO, fontSize: 12, fontWeight: "400", fill: COLOR.muted, align: "center", lineHeight: 18 },
      position: { x: 500, y: 50 },
    },
    title: {
      style: { fontFamily: IVY, fontSize: 36, fontStyle: "italic", fontWeight: "400", fill: COLOR.ink, align: "center", lineHeight: 44 },
      position: { x: 500, y: 78, anchor: { x: 0.5, y: 0 } },
    },
  },
  "career-timeline": {
    id: "career-timeline",
    background: { color: COLOR.page },
    intro: {
      style: { fontFamily: MONO, fontSize: 14, fontWeight: "400", fill: COLOR.muted, lineHeight: 22 },
      position: { x: 60, y: 60 },
    },
  },
  "jigsaw-gallery": {
    id: "jigsaw-gallery",
    background: { color: COLOR.page },
    intro: {
      style: { fontFamily: MONO, fontSize: 14, fontWeight: "400", fill: COLOR.muted, lineHeight: 22 },
      position: { x: 60, y: 60 },
    },
    title: {
      style: { fontFamily: HELV, fontSize: 16, fontWeight: "400", fill: COLOR.ink, lineHeight: 24 },
      position: { x: 220, y: 60 },
    },
  },
  "project-layout": {
    id: "project-layout",
    background: { color: COLOR.page },
    intro: {
      style: { fontFamily: MONO, fontSize: 14, fontWeight: "400", fill: COLOR.muted, lineHeight: 22 },
      position: { x: 60, y: 60 },
    },
    title: {
      style: { fontFamily: HELV, fontSize: 40, fontWeight: "500", fill: COLOR.ink, lineHeight: 50, wordWrap: true, wordWrapWidth: 880 },
      position: { x: 60, y: 110 },
    },
    body: {
      style: { fontFamily: HELV, fontSize: 18, fontWeight: "400", fill: COLOR.ink, lineHeight: 28, wordWrap: true, wordWrapWidth: 820 },
      position: { x: 60, y: 220 },
    },
    links: {
      style: { fontFamily: HELV, fontSize: 14, fontWeight: "500", fill: COLOR.accent, lineHeight: 22 },
      position: { x: 60, y: 520 },
    },
  },
  "testimonial-cards": {
    id: "testimonial-cards",
    background: { color: COLOR.page },
    intro: {
      style: { fontFamily: MONO, fontSize: 14, fontWeight: "400", fill: COLOR.muted, align: "center", lineHeight: 22 },
      position: { x: 500, y: 50 },
    },
    title: {
      style: { fontFamily: HELV, fontSize: 14, fontWeight: "300", fill: COLOR.muted, align: "center", lineHeight: 22 },
      position: { x: 500, y: 540 },
    },
  },
  "contact-layout": {
    id: "contact-layout",
    background: { color: COLOR.page },
    intro: {
      style: { fontFamily: MONO, fontSize: 14, fontWeight: "400", fill: COLOR.muted, lineHeight: 22 },
      position: { x: 60, y: 60 },
    },
    title: {
      style: { fontFamily: HELV, fontSize: 56, fontWeight: "500", fill: COLOR.ink, lineHeight: 64, wordWrap: true, wordWrapWidth: 880 },
      position: { x: 60, y: 200 },
    },
    body: {
      style: { fontFamily: HELV, fontSize: 18, fontWeight: "400", fill: COLOR.ink, lineHeight: 28, wordWrap: true, wordWrapWidth: 720 },
      position: { x: 60, y: 320 },
    },
    links: {
      style: { fontFamily: HELV, fontSize: 16, fontWeight: "500", fill: COLOR.accent, lineHeight: 28 },
      position: { x: 60, y: 400 },
    },
  },
};
