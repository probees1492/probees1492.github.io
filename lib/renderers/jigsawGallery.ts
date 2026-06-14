import {
  Container,
  Graphics,
  Sprite,
  Text,
  TextStyle,
  Assets,
  Texture,
} from "pixi.js";
import type { Slide } from "../slidesData";
import type { LayoutConfig } from "../layouts";
import { makeText } from "./textHelpers";

const PALETTE = [
  0x223344, 0x334455, 0x445566, 0x556677, 0x667788, 0x445577, 0x334466, 0x556688, 0x447799,
];

async function loadOrPlaceholder(src: string, idx: number): Promise<Texture> {
  if (src && !src.startsWith("[")) {
    try {
      return await Assets.load(src);
    } catch {}
  }
  const c = document.createElement("canvas");
  c.width = 760;
  c.height = 470;
  const ctx = c.getContext("2d")!;
  const baseColor = PALETTE[idx % PALETTE.length];
  const r = (baseColor >> 16) & 0xff;
  const g = (baseColor >> 8) & 0xff;
  const b = baseColor & 0xff;
  const grad = ctx.createLinearGradient(0, 0, 760, 470);
  grad.addColorStop(0, `rgb(${r},${g},${b})`);
  grad.addColorStop(1, `rgb(${Math.max(0, r - 40)},${Math.max(0, g - 40)},${Math.max(0, b - 40)})`);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 760, 470);
  ctx.strokeStyle = "rgba(255,255,255,0.15)";
  for (let i = 0; i < 8; i++) {
    ctx.beginPath();
    ctx.arc(120 + i * 80, 100 + ((i * 37) % 270), 60 + (i % 3) * 20, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.font = "600 48px -apple-system, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(`Photo ${idx + 1}`, 380, 240);
  ctx.font = "400 16px ui-monospace, monospace";
  ctx.fillStyle = "rgba(255,255,255,0.45)";
  ctx.fillText("placeholder", 380, 270);
  return Texture.from(c);
}

export function renderJigsawGallery(
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

  let order = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  let mode: "preview" | "puzzle" = "preview";
  let animating = false;
  let solved = false;
  let solving = false;
  let current = 0;

  const thumbsRail = new Container();
  thumbsRail.x = 50;
  thumbsRail.y = 80;

  const previewLayer = new Container();
  previewLayer.x = 180;
  previewLayer.y = 80;

  const puzzleLayer = new Container();
  puzzleLayer.x = 365;
  puzzleLayer.y = 110;
  puzzleLayer.visible = false;

  const confetti = new Container();

  stage.addChild(thumbsRail);
  stage.addChild(previewLayer);
  stage.addChild(puzzleLayer);
  stage.addChild(confetti);

  const captionStyle = new TextStyle({
    fontFamily: "Helvetica Neue, sans-serif",
    fontSize: 18,
    fontWeight: "400",
    fill: 0xffffff,
    align: "center",
  });
  const caption = new Text({ text: "", style: captionStyle });
  caption.anchor.set(0.5, 0);
  caption.x = 560;
  caption.y = 50;
  stage.addChild(caption);

  const statusStyle = new TextStyle({
    fontFamily: "Helvetica Neue, sans-serif",
    fontSize: 14,
    fontWeight: "300",
    fill: 0x888888,
    align: "center",
  });
  const status = new Text({ text: "이미지를 클릭하면 퍼즐이 시작됩니다", style: statusStyle });
  status.anchor.set(0.5, 0);
  status.x = 560;
  status.y = 565;
  stage.addChild(status);

  const solvedStyle = new TextStyle({
    fontFamily: "Times New Roman, serif",
    fontSize: 48,
    fontStyle: "italic",
    fontWeight: "400",
    fill: 0xffffff,
  });
  const solvedText = new Text({ text: "Solved!", style: solvedStyle });
  solvedText.anchor.set(0.5);
  solvedText.x = 560;
  solvedText.y = 315;
  solvedText.visible = false;
  stage.addChild(solvedText);

  const solveBtn = new Container();
  solveBtn.x = width - 130;
  solveBtn.y = height - 50;
  solveBtn.visible = false;
  const solveBg = new Graphics();
  solveBg.roundRect(0, 0, 100, 36, 18);
  solveBg.fill(0xffffff);
  solveBtn.addChild(solveBg);
  const solveLabel = new Text({
    text: "Solve it",
    style: new TextStyle({ fontFamily: "Helvetica Neue, sans-serif", fontSize: 13, fontWeight: "500", fill: 0 }),
  });
  solveLabel.anchor.set(0.5);
  solveLabel.x = 50;
  solveLabel.y = 18;
  solveBtn.addChild(solveLabel);
  solveBtn.eventMode = "static";
  solveBtn.cursor = "pointer";
  solveBtn.on("pointerover", () => (solveBg.tint = 0xcccccc));
  solveBtn.on("pointerout", () => (solveBg.tint = 0xffffff));
  stage.addChild(solveBtn);

  const thumbSelectors: Graphics[] = [];
  const thumbs: Container[] = [];
  let previewSprite: Sprite | null = null;
  let pieces: Container[] = [];
  let currentTex: Texture | null = null;

  const images = slide.images ?? [];

  function setActiveThumb(i: number) {
    thumbSelectors.forEach((g, idx) => (g.visible = idx === i));
    current = i;
    if (images[i]) caption.text = images[i].caption;
  }

  async function loadPreview(i: number) {
    const img = images[i];
    if (!img) return;
    const tex = await loadOrPlaceholder(img.src, i);
    currentTex = tex;
    if (previewSprite) {
      previewLayer.removeChild(previewSprite);
      previewSprite.destroy();
    }
    previewSprite = new Sprite(tex);
    const sx = 760 / tex.width;
    const sy = 470 / tex.height;
    const s = Math.min(sx, sy);
    previewSprite.scale.set(s);
    previewSprite.x = (760 - tex.width * s) / 2;
    previewSprite.y = (470 - tex.height * s) / 2;
    previewSprite.eventMode = "static";
    previewSprite.cursor = "pointer";
    previewSprite.on("pointertap", (e) => {
      e.stopPropagation();
      if (mode === "preview") {
        enterPuzzle();
        shuffle();
      }
    });
    const mask = new Graphics();
    mask.roundRect(previewSprite.x, previewSprite.y, tex.width * s, tex.height * s, 8);
    mask.fill(0xffffff);
    previewLayer.addChild(mask);
    previewSprite.mask = mask;
    previewLayer.addChild(previewSprite);
  }

  function buildPieces() {
    pieces.forEach((p) => {
      puzzleLayer.removeChild(p);
      p.destroy({ children: true });
    });
    pieces = [];
    if (!currentTex) return;
    const tex = currentTex;
    const tw = tex.width;
    const th = tex.height;
    const s = Math.max(390 / tw, 390 / th);
    const offX = (tw * s - 390) / 2;
    const offY = (th * s - 390) / 2;
    order.forEach((cellValue, gridIdx) => {
      if (cellValue === 8) return;
      const piece = new Container();
      const col = cellValue % 3;
      const row = Math.floor(cellValue / 3);
      const gridCol = gridIdx % 3;
      const gridRow = Math.floor(gridIdx / 3);

      const sp = new Sprite(tex);
      sp.scale.set(s);
      sp.x = -(130 * col) - offX;
      sp.y = -(130 * row) - offY;

      const mask = new Graphics();
      mask.roundRect(1, 1, 128, 128, 4);
      mask.fill(0xffffff);
      piece.addChild(sp);
      piece.addChild(mask);
      sp.mask = mask;

      const border = new Graphics();
      border.roundRect(0, 0, 130, 130, 4);
      border.stroke({ width: 1, color: 0x333334, alpha: 0.5 });
      piece.addChild(border);

      piece.x = 130 * gridCol;
      piece.y = 130 * gridRow;
      piece.eventMode = "static";
      piece.cursor = "pointer";
      (piece as any)._cellValue = cellValue;
      piece.on("pointertap", (e) => {
        e.stopPropagation();
        if (animating || solved || solving) return;
        tryMove(cellValue);
      });
      pieces.push(piece);
      puzzleLayer.addChild(piece);
    });
  }

  function tryMove(cellValue: number) {
    const from = order.indexOf(cellValue);
    const empty = order.indexOf(8);
    const fc = from % 3, fr = Math.floor(from / 3);
    const ec = empty % 3, er = Math.floor(empty / 3);
    const adjacent = (Math.abs(fc - ec) === 1 && fr === er) || (Math.abs(fr - er) === 1 && fc === ec);
    if (!adjacent) return;
    animating = true;
    [order[from], order[empty]] = [order[empty], order[from]];
    const piece = pieces.find((p) => (p as any)._cellValue === cellValue);
    if (!piece) {
      animating = false;
      return;
    }
    const tx = ec * 130;
    const ty = er * 130;
    const sx = piece.x;
    const sy = piece.y;
    const t0 = performance.now();
    const step = (now: number) => {
      const t = Math.min((now - t0) / 150, 1);
      const e = 1 - Math.pow(1 - t, 3);
      piece.x = sx + (tx - sx) * e;
      piece.y = sy + (ty - sy) * e;
      if (t < 1) requestAnimationFrame(step);
      else {
        animating = false;
        if (isSolved()) celebrate();
      }
    };
    requestAnimationFrame(step);
  }

  function isSolved(): boolean {
    for (let i = 0; i < 9; i++) if (order[i] !== i) return false;
    return true;
  }

  function celebrate() {
    solved = true;
    solvedText.visible = true;
    status.text = "축하합니다 🎉";
    confettiBurst();
    setTimeout(() => {
      exitPuzzle();
      loadPreview(current);
    }, 3000);
  }

  function confettiBurst() {
    const colors = [0xff6b6b, 0x4ecdc4, 0xffe66d, 0x95e1d3, 0xf38181, 0xaa96da, 0xfcbad3];
    const parts: { g: Graphics; vx: number; vy: number; rot: number }[] = [];
    for (let i = 0; i < 80; i++) {
      const g = new Graphics();
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = 4 + Math.random() * 8;
      if (Math.random() > 0.5) g.rect(-size / 2, -size / 2, size, size * 0.6);
      else g.circle(0, 0, size / 2);
      g.fill(color);
      g.x = 560 + (Math.random() - 0.5) * 100;
      g.y = 315;
      confetti.addChild(g);
      parts.push({
        g,
        vx: (Math.random() - 0.5) * 15,
        vy: -8 - Math.random() * 12,
        rot: (Math.random() - 0.5) * 0.3,
      });
    }
    const t0 = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - t0) / 2000, 1);
      for (const p of parts) {
        if (p.g.destroyed) continue;
        p.g.x += p.vx;
        p.g.y += p.vy;
        p.vy += 0.5;
        p.g.rotation += p.rot;
        p.g.alpha = 1 - t;
      }
      if (t < 1) requestAnimationFrame(tick);
      else
        parts.forEach((p) => {
          if (!p.g.destroyed) {
            confetti.removeChild(p.g);
            p.g.destroy();
          }
        });
    };
    requestAnimationFrame(tick);
  }

  function shuffle() {
    order = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    buildPieces();
    animating = true;
    status.text = "Shuffling…";
    solveBtn.visible = false;
    let count = 0;
    let prev = -1;
    const total = 25;
    setTimeout(function step() {
      if (count >= total) {
        animating = false;
        status.text = "빈 칸 옆 타일을 클릭해 슬라이드하세요";
        solveBtn.visible = true;
        return;
      }
      const empty = order.indexOf(8);
      const er = Math.floor(empty / 3), ec = empty % 3;
      const cand: number[] = [];
      if (er > 0) cand.push(empty - 3);
      if (er < 2) cand.push(empty + 3);
      if (ec > 0) cand.push(empty - 1);
      if (ec < 2) cand.push(empty + 1);
      const filtered = prev !== -1 && cand.length > 1 ? cand.filter((i) => i !== prev) : cand;
      const pick = filtered[Math.floor(Math.random() * filtered.length)];
      const value = order[pick];
      const piece = pieces.find((p) => (p as any)._cellValue === value);
      if (!piece) {
        count++;
        step();
        return;
      }
      [order[pick], order[empty]] = [order[empty], order[pick]];
      prev = empty;
      const tx = (empty % 3) * 130;
      const ty = Math.floor(empty / 3) * 130;
      const sx = piece.x, sy = piece.y;
      const t0 = performance.now();
      const anim = (now: number) => {
        const t = Math.min((now - t0) / 120, 1);
        const e = 1 - Math.pow(1 - t, 2);
        piece.x = sx + (tx - sx) * e;
        piece.y = sy + (ty - sy) * e;
        if (t < 1) requestAnimationFrame(anim);
        else {
          count++;
          step();
        }
      };
      requestAnimationFrame(anim);
    }, 500);
  }

  function bfsSolve(): number[] {
    const goal = "0,1,2,3,4,5,6,7,8";
    const start = order.join(",");
    if (start === goal) return [];
    const queue: { state: number[]; moves: number[] }[] = [{ state: [...order], moves: [] }];
    const seen = new Set<string>([start]);
    while (queue.length) {
      const { state, moves } = queue.shift()!;
      const empty = state.indexOf(8);
      const er = Math.floor(empty / 3), ec = empty % 3;
      const dirs = [
        { dr: -1, dc: 0 },
        { dr: 1, dc: 0 },
        { dr: 0, dc: -1 },
        { dr: 0, dc: 1 },
      ];
      for (const { dr, dc } of dirs) {
        const nr = er + dr, nc = ec + dc;
        if (nr < 0 || nr > 2 || nc < 0 || nc > 2) continue;
        const ni = nr * 3 + nc;
        const ns = [...state];
        [ns[empty], ns[ni]] = [ns[ni], ns[empty]];
        const key = ns.join(",");
        if (seen.has(key)) continue;
        seen.add(key);
        const nm = [...moves, ni];
        if (key === goal) return nm;
        queue.push({ state: ns, moves: nm });
      }
      if (seen.size > 200000) break;
    }
    return [];
  }

  function autoSolve() {
    if (solving || animating || solved) return;
    solving = true;
    solveBtn.visible = false;
    status.text = "Solving…";
    const moves = bfsSolve();
    if (moves.length === 0) {
      solving = false;
      solveBtn.visible = true;
      status.text = "이미 풀려있거나 해가 없습니다";
      return;
    }
    let i = 0;
    const playNext = () => {
      if (i >= moves.length) {
        solving = false;
        if (isSolved()) celebrate();
        return;
      }
      const idx = moves[i];
      const value = order[idx];
      const empty = order.indexOf(8);
      const piece = pieces.find((p) => (p as any)._cellValue === value);
      if (!piece) {
        i++;
        setTimeout(playNext, 40);
        return;
      }
      [order[idx], order[empty]] = [order[empty], order[idx]];
      const tx = (empty % 3) * 130;
      const ty = Math.floor(empty / 3) * 130;
      const sx = piece.x, sy = piece.y;
      const t0 = performance.now();
      const anim = (now: number) => {
        const t = Math.min((now - t0) / 120, 1);
        const e = 1 - Math.pow(1 - t, 3);
        piece.x = sx + (tx - sx) * e;
        piece.y = sy + (ty - sy) * e;
        if (t < 1) requestAnimationFrame(anim);
        else {
          i++;
          setTimeout(playNext, 80);
        }
      };
      requestAnimationFrame(anim);
    };
    playNext();
  }

  solveBtn.on("pointertap", (e) => {
    e.stopPropagation();
    autoSolve();
  });

  function enterPuzzle() {
    mode = "puzzle";
    solved = false;
    previewLayer.visible = false;
    puzzleLayer.visible = true;
    solveBtn.visible = true;
    status.text = "빈 칸 옆 타일을 클릭해 슬라이드하세요";
  }
  function exitPuzzle() {
    mode = "preview";
    solved = false;
    previewLayer.visible = true;
    puzzleLayer.visible = false;
    solveBtn.visible = false;
    solvedText.visible = false;
    status.text = "이미지를 클릭하면 퍼즐이 시작됩니다";
  }

  // build thumbnails
  images.forEach((img, i) => {
    const thumb = new Container();
    thumb.y = 68 * i;

    const sel = new Graphics();
    sel.roundRect(-4, -4, 88, 68, 8);
    sel.stroke({ width: 3, color: 0xffffff });
    sel.visible = i === 0;
    thumbSelectors.push(sel);
    thumb.addChild(sel);

    const fallback = new Graphics();
    fallback.roundRect(0, 0, 80, 60, 6);
    fallback.fill(PALETTE[i % PALETTE.length]);
    thumb.addChild(fallback);

    loadOrPlaceholder(img.src, i).then((tex) => {
      const sp = new Sprite(tex);
      const s = Math.max(80 / tex.width, 60 / tex.height);
      sp.scale.set(s);
      sp.x = (80 - tex.width * s) / 2;
      sp.y = (60 - tex.height * s) / 2;
      const mask = new Graphics();
      mask.roundRect(0, 0, 80, 60, 6);
      mask.fill(0xffffff);
      thumb.addChild(mask);
      sp.mask = mask;
      thumb.addChild(sp);
    });

    thumb.eventMode = "static";
    thumb.cursor = "pointer";
    thumb.on("pointertap", (e) => {
      e.stopPropagation();
      if (i !== current || mode === "puzzle") {
        setActiveThumb(i);
        loadPreview(i).then(() => {
          enterPuzzle();
          shuffle();
        });
      }
    });
    thumb.on("pointerover", () => {
      if (i !== current) thumb.alpha = 0.8;
    });
    thumb.on("pointerout", () => {
      thumb.alpha = 1;
    });
    thumbs.push(thumb);
    thumbsRail.addChild(thumb);
  });

  setActiveThumb(0);
  loadPreview(0);

  return stage;
}
