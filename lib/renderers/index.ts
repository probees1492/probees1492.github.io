import { Container, Graphics } from "pixi.js";
import type { Slide } from "../slidesData";
import { layouts } from "../layouts";
import { renderParticleGlobe } from "./particleGlobe";
import { renderSimpleText } from "./simpleText";
import { renderJigsawGallery } from "./jigsawGallery";
import { renderTestimonialCards } from "./testimonialCards";
import { renderCareerTimeline } from "./careerTimeline";
import { renderTechStack } from "./techStack";
import { renderContributionsGrid } from "./contributionsGrid";
import { renderConnectingDots } from "./connectingDots";

const CARD_RADIUS = 14;

export function renderSlide(
  slide: Slide,
  width: number,
  height: number,
  onNavigate: (url: string) => void,
): Container {
  const layout = layouts[slide.layoutId];
  if (!layout) return new Container();

  const card = new Container();

  // First shadow filled with the page background color (acts as a seamless backdrop, no drop shadow)
  const shadowFar = new Graphics();
  shadowFar.roundRect(-8, 10, width + 16, height + 22, CARD_RADIUS + 6);
  shadowFar.fill({ color: 0xe5e5e5, alpha: 1 });
  card.addChild(shadowFar);

  let content: Container;
  switch (slide.layoutId) {
    case "particle-globe":
      content = renderParticleGlobe(slide, layout, width, height, onNavigate);
      break;
    case "jigsaw-gallery":
      content = renderJigsawGallery(slide, layout, width, height);
      break;
    case "career-timeline":
      content = renderCareerTimeline(slide, layout, width, height);
      break;
    case "tech-stack":
      content = renderTechStack(slide, layout, width, height);
      break;
    case "contributions-grid":
      content = renderContributionsGrid(slide, layout, width, height);
      break;
    case "connecting-dots":
      content = renderConnectingDots(slide, layout, width, height);
      break;
    case "testimonial-cards":
      content = renderTestimonialCards(slide, layout, width, height);
      break;
    default:
      content = renderSimpleText(slide, layout, width, height, onNavigate);
  }

  // Clip content to rounded card via mask, so its rect background gets rounded corners
  const mask = new Graphics();
  mask.roundRect(0, 0, width, height, CARD_RADIUS);
  mask.fill(0xffffff);
  card.addChild(mask);
  content.mask = mask;
  card.addChild(content);

  return card;
}
