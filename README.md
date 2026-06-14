# Profile Site (Draft)

tashfeen.me 형식의 슬라이드형 포트폴리오. Next.js + PIXI.js v8.

## 실행

```bash
npm install
npm run dev
# → http://localhost:3000
```

## 조작

- `← / → / ↑ / ↓ / Space` : 슬라이드 이동
- `Home / End` : 처음 / 끝
- 마우스 휠 : 슬라이드 이동
- URL 해시 (`#about`, `#jigsaw-gallery` 등) : 직접 진입

## 슬라이드 구성

| # | id | layoutId |
|---|---|---|
| 1 | intro | particle-globe |
| 2 | about | intro-layout-dark |
| 3 | main-menu | projects-index-dark |
| 4 | who-am-i | about-layout-dark |
| 5 | philosophy | philosophy-layout |
| 6 | jigsaw-gallery | jigsaw-gallery (8-puzzle 인터랙션) |
| 7 | projects-index | projects-index-dark |
| 8 | project-1 ~ 3 | project-layout |
| 9 | testimonials | testimonial-cards (드래그/셔플) |
| 10 | contact | contact-layout |

## 채워야 할 곳

전부 `[대괄호]` placeholder로 표시. 일괄 검색해 치환:

- `lib/slidesData.ts` — 모든 텍스트 / URL / 이미지 경로
- `app/layout.tsx` — `<title>` / description
- `components/HiddenSEO.tsx` — h1 / bio
- `public/img/exp-*.jpg` — jigsaw용 사진 7장 (없으면 자동 placeholder 생성)

## 폴더 구조

```
app/
  layout.tsx, page.tsx, globals.css
components/
  StageClient.tsx     # ssr:false dynamic wrapper
  SlideStage.tsx      # PIXI Application, 키보드/휠/해시 라우팅
  HiddenSEO.tsx       # 크롤러용 숨김 DOM
lib/
  slidesData.ts       # 슬라이드 데이터 (placeholder 가득)
  layouts.ts          # layoutId별 스타일/포지션 config
  renderers/
    index.ts          # layoutId → 렌더러 분배
    textHelpers.ts    # makeText, renderLinks
    particleGlobe.ts  # intro — 회전하는 파티클 구
    simpleText.ts     # intro/about/projects/contact/philosophy 등 텍스트 슬라이드
    jigsawGallery.ts  # 8-puzzle (썸네일 → 프리뷰 → 셔플 → BFS 자동풀이 → confetti)
    testimonialCards.ts # 카드 스택, 드래그 / 클릭 셔플
```
