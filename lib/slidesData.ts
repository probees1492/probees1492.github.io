export type LayoutId =
  | "particle-globe"
  | "intro-layout-dark"
  | "projects-index-dark"
  | "about-layout-dark"
  | "philosophy-layout"
  | "career-timeline"
  | "tech-stack"
  | "contributions-grid"
  | "connecting-dots"
  | "jigsaw-gallery"
  | "project-layout"
  | "testimonial-cards"
  | "contact-layout";

export interface SlideLink {
  text: string;
  url: string;
}

export interface GalleryImage {
  src: string;
  caption: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  company: string;
}

export interface StackLayer {
  label: string;
  detail?: string;
  highlight?: boolean;
  highlightLabel?: string;
}

export interface NoteSection {
  title: string;
  items: string[];
}

export interface Contribution {
  label: string;
  detail?: string;
}

export interface Dot {
  id: string;
  label: string;
  x: number;
  y: number;
  labelPos?: "top" | "bottom" | "left" | "right";
  highlight?: boolean;
}

export interface DotConnection {
  from: string;
  to: string;
}

export interface Career {
  name: string;
  description?: string;
  start: number;
  end: number;
  endLabel?: string;
  title: string;
  role: string;
}

export interface Slide {
  id: string;
  layoutId: LayoutId;
  intro?: string;
  title?: string;
  subtitle?: string;
  body?: string;
  highlightText?: string;
  paragraphs?: string[];
  bullets?: string[];
  links?: SlideLink[];
  images?: GalleryImage[];
  testimonials?: Testimonial[];
  careers?: Career[];
  stack?: StackLayer[];
  contributions?: Contribution[];
  sections?: NoteSection[];
  dots?: Dot[];
  connections?: DotConnection[];
  image?: string;
}

export const slidesData: Slide[] = [
  {
    id: "intro",
    layoutId: "particle-globe",
    title: "Seo's SW R&D Journey",
    subtitle: "2026.06",
  },
  {
    id: "career",
    layoutId: "career-timeline",
    intro: "Career",
    careers: [
      {
        name: "가우디오랩 (Gaudio Lab)",
        description: "한국 소재 Audio 기술 스타트업",
        start: 2017,
        end: 2026,
        endLabel: "현재",
        title: "Senior SWE & Technical Leader",
        role: "오디오 관련 소프트웨어 개발",
      },
      {
        name: "Greenwave Systems",
        description: "미국 소재 IoT 기술 스타트업",
        start: 2015,
        end: 2017,
        title: "Senior SWE",
        role: "IPTV 라이브 스트리밍 미들웨어 개발",
      },
      {
        name: "에스코어 (Samsung 자회사)",
        start: 2014,
        end: 2015,
        title: "SWE",
        role: "Tizen Native App Editor 개발",
      },
      {
        name: "휴맥스 (HUMAX)",
        start: 2010,
        end: 2014,
        title: "SWE",
        role: "방송 셋톱박스 미들웨어 개발",
      },
    ],
  },
  {
    id: "humax",
    layoutId: "tech-stack",
    intro: "휴맥스 (HUMAX) · 2010 — 2014 · SWE",
    title:
      "YouView (영국) 방송 규격 대응\n미디어 재생/녹화 기능 C/C++ 미들웨어 개발",
    stack: [
      {
        label: "TV App",
        detail: "사용자 앱 / 미디어 컨트롤 UI",
      },
      {
        label: "Middleware",
        detail:
          "· 시스템 자원 관리\n· DVB 방송 표준 구현\n· 미디어 재생 / 녹화 (C/C++)",
        highlight: true,
        highlightLabel: "담당",
      },
      {
        label: "STB BSP + Linux HW",
        detail: "하드웨어 추상화 · 드라이버",
      },
    ],
    sections: [
      {
        title: "PROJECT",
        items: [
          "YouView (영국 지상파) — 지상파 방송 리시버 오픈플랫폼 (안드로이드 유사)",
          "휴맥스 유럽/일본 공통 미들웨어 개발",
        ],
      },
      {
        title: "주요 경험",
        items: [
          "필드 (유럽, 일본) 이슈 대응",
          "임베디드 환경 제품화",
          "PMO / HW / App 협업 경험",
        ],
      },
    ],
  },
  {
    id: "escore",
    layoutId: "tech-stack",
    intro: "에스코어 (Samsung 자회사) · 2014 — 2015 · SWE",
    title: "Tizen Native App Editor 핵심 컴포넌트 개발",
    stack: [
      {
        label: "IDE UI (Eclipse 기반)",
        detail: "코드 에디터 · 프로젝트 관리 · 빌드 / 디버그",
      },
      {
        label: "Programming Model + WYSIWYG Editor",
        detail:
          "· Native App 개발 방법론 (Programming Model) 설계\n· WYSIWYG 비주얼 UI 에디터",
        highlight: true,
        highlightLabel: "담당",
      },
      {
        label: "Tizen Native API / SDK",
        detail: "Tizen 플랫폼 네이티브 라이브러리",
      },
    ],
    sections: [
      {
        title: "PROJECT",
        items: [
          "Tizen Native App Editor — Tizen 앱 개발자를 위한 Android Studio 형태의 IDE",
        ],
      },
      {
        title: "주요 경험",
        items: [
          "Eclipse · Chromium 오픈소스 활용 전략",
          "프로그래밍 모델 설계 및 기술 문서 작성",
          "삼성 오픈소스 컨퍼런스에서 App Editor 발표",
        ],
      },
    ],
  },
  {
    id: "greenwave",
    layoutId: "tech-stack",
    intro: "Greenwave Systems · 2015 — 2017 · Senior SWE",
    title:
      "Verizon OTT 플랫폼용 C++ 미디어 미들웨어 (HLS / DASH)\n양산 제품 배포 및 이슈 대응",
    stack: [
      {
        label: "Verizon OTT App / Player",
        detail: "사용자 비디오 재생 인터페이스",
      },
      {
        label: "Media Middleware (C++)",
        detail:
          "· MPEG-DASH · HLS · Progressive Download 프로토콜 구현\n· Audio / Video / DRM 데이터 처리 파이프라인\n· 멀티스레드 동시성 프로그래밍",
        highlight: true,
        highlightLabel: "담당",
      },
      {
        label: "Platform (Verizon STB / OTT Device)",
        detail: "Verizon 양산 디바이스 환경",
      },
    ],
    sections: [
      {
        title: "PROJECT",
        items: [
          "Verizon OTT 플랫폼용 미디어 미들웨어",
          "양산 제품 배포 및 라이브 이슈 대응",
        ],
      },
      {
        title: "주요 경험",
        items: [
          "미국 Verizon IPTV HW/OPS 팀과 데일리 스크럼",
          "통합 및 이슈 대응 협업",
        ],
      },
    ],
  },
  {
    id: "gaudio-2017",
    layoutId: "contributions-grid",
    intro: "가우디오랩 (Gaudio Lab) · 2017 — 2018 · Senior SWE",
    title: "VR 제품 리팩토링",
    contributions: [
      {
        label: "VR 연구 코드 (Matlab) SDK화 · 교차 컴파일 환경 구축",
        detail: "Matlab 기반 VR 연구 코드를 SDK로 전환 · 멀티 타겟 교차 컴파일 환경 구축",
      },
      {
        label: "TDD (테스트 주도 개발) 도입",
        detail: "생산성 향상 및 유지보수 효율화를 위한 TDD 프로세스 도입",
      },
      {
        label: "데모 앱 개발 (Oculus · Mobile)",
        detail: "오큘러스 / 모바일 데모 앱 개발",
      },
    ],
    sections: [
      {
        title: "PROJECT",
        items: [
          "VR 제품 리팩토링 — 연구 코드를 SDK로 전환",
        ],
      },
      {
        title: "주요 경험",
        items: [
          "VR 산업 생태계 이해",
          "오디오 신호처리 기본 습득",
        ],
      },
    ],
  },
  {
    id: "gaudio-2019",
    layoutId: "contributions-grid",
    intro: "가우디오랩 (Gaudio Lab) · 2019 — 2022 · Senior SWE",
    title: "회사 전략 피벗 (VR → Audio DSP SDK)에 따른 다양한 기여",
    contributions: [
      {
        label: "Audio DSP SDK 제품화",
        detail: "공간음향 · 라우드니스 제품의 TWS (AirPods Pro 유사), Mobile 등",
      },
      {
        label: "Multi-Platform 제품화 + DevOps",
        detail:
          "임베디드 · 모바일 · 웹 (WebAssembly, TypeScript) 제품화 설계 · DevOps 배포 시스템 구축",
      },
      {
        label: "오디오 처리 SDK (FFmpeg · GStreamer)",
        detail:
          "FFmpeg / GStreamer 기반 오디오 처리 SDK 개발 및 최적화 · 모바일/임베디드 지원",
      },
      {
        label: "TDD 개발 환경 (Matlab · C/C++)",
        detail: "Matlab, C/C++ TDD 개발 환경 설계 및 구축",
      },
    ],
    sections: [
      {
        title: "PROJECT",
        items: [
          "VR SDK 개발팀 합류 후 Audio SDK 전략 피벗 대응",
        ],
      },
      {
        title: "주요 경험",
        items: [
          "스타트업의 빠른 고객 / 시장 대응",
          "미디어 기업의 오디오 관련 Pain Point 이해",
          "SDK의 제품 관점 공학적 설계",
        ],
      },
    ],
  },
  {
    id: "gaudio-2022",
    layoutId: "contributions-grid",
    intro: "가우디오랩 (Gaudio Lab) · 2022 — 현재 · Senior SWE & Technical Leader",
    title: "Audio AI SDK 확장",
    contributions: [
      {
        label: "AI Box 시제품 연구",
        detail:
          "sLM + LLM 하이브리드 · SFT · MCP · STT/TTS Voice Agent",
      },
      {
        label: "On-device SDK 제품화 (Mobile · Desktop)",
        detail: "노이즈 제거 · 음원분리 모델 SDK",
      },
      {
        label: "차량 헤드유닛 공간음향 (GStreamer · CUDA)",
        detail: "외장 앰프 음장 모듈 개발",
      },
      {
        label: "가라오케 시스템 (RK3588)",
        detail: "DSP 음향처리 설계 · 양산 배포 및 이슈 대응",
      },
      {
        label: "AI/DSP SDK 시스템 통합 운영",
        detail: "AOSP · OTT · 임베디드 · 고객 이슈 대응",
      },
    ],
    sections: [
      {
        title: "PROJECT",
        items: [
          "Audio AI SDK 확장 — 다도메인 제품화",
        ],
      },
      {
        title: "주요 경험",
        items: [
          "AI 모델 + DSP 하이브리드 시스템 설계",
          "Mobile · 차량 · 임베디드 다중 플랫폼 제품화",
          "양산 배포 및 고객 이슈 대응 운영",
        ],
      },
    ],
  },
];
