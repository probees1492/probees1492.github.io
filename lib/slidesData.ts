export type LayoutId =
  | "particle-globe"
  | "intro-layout-dark"
  | "projects-index-dark"
  | "about-layout-dark"
  | "philosophy-layout"
  | "career-timeline"
  | "tech-stack"
  | "contributions-grid"
  | "workflow-pipeline"
  | "hobby-card"
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

export interface PipelineStage {
  stage?: string;
  label: string;
  items?: string[];
  highlight?: boolean;
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
  pipeline?: PipelineStage[];
  sections?: NoteSection[];
  dots?: Dot[];
  connections?: DotConnection[];
  image?: string;
  // Hobby slide
  videoUrl?: string;
  videoArea?: { x: number; y: number; w: number; h: number };
  progress?: number;
  goal?: string;
  components?: string[];
}

export const slidesDataKo: Slide[] = [
  {
    id: "intro",
    layoutId: "particle-globe",
    title: "Seo's SW R&D Journey",
    highlightText: "Seo",
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
    title: "VR 공간음향 Audio SDK 리팩토링",
    contributions: [
      {
        label: "VR 공간음향 연구 코드 (Matlab) SDK화 · 교차 컴파일 환경 구축",
        detail: "Matlab 기반 VR 공간음향 연구 코드를 SDK로 전환 · 멀티 타겟 교차 컴파일 환경 구축",
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
          "VR 공간음향 Audio SDK 리팩토링 — 연구 코드를 SDK로 전환",
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
        label: "TDD 개발 환경 (Matlab · C/C++)",
        detail: "Matlab, C/C++ TDD 개발 환경 설계 및 구축",
      },
      {
        label: "Multi-Platform 제품화 + DevOps",
        detail:
          "임베디드 · 모바일 · 웹 (WebAssembly, TypeScript) 제품화 설계 · DevOps 배포 시스템 구축",
      },
      {
        label: "오디오 관련 오픈소스 프레임워크 모듈화",
        detail:
          "FFmpeg / GStreamer 기반 오디오 처리 SDK 개발 및 최적화 · 모바일 / 임베디드 지원",
      },
      {
        label: "Audio DSP SDK 제품화",
        detail: "공간음향 · 라우드니스 SDK — TWS (AirPods Pro 유사) · Mobile 등",
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
          "영상 / 오디오 서비스 기업의 오디오 관련 Pain Point 이해",
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
        label: "AI / DSP SDK 시스템 통합 운영",
        detail: "AOSP · OTT · 임베디드 · 고객 이슈 대응",
      },
    ],
    sections: [
      {
        title: "PROJECT",
        items: [
          "노이즈 제거 AI SDK",
          "음원분리 AI SDK",
          "차량 IVI 공간음향 프로젝트",
          "가라오케 기기 신호처리 모듈화",
        ],
      },
      {
        title: "주요 경험",
        items: [
          "업무 설계 및 분장",
          "고객 기술 미팅, 솔루션 제안",
          "딥러닝 모델 학습 및 서빙 업무 흐름",
          "추론 모델 최적화 및 품질 관리",
        ],
      },
    ],
  },
  {
    id: "gaudio-ai",
    layoutId: "workflow-pipeline",
    intro: "Gaudio Lab · Audio AI SDK",
    title: "음원분리 모델 학습 및 서빙 업무 흐름",
    body: "연구 코드 버전 관리 및 타겟 시스템에 적합한 모델 설계 협업",
    pipeline: [
      {
        stage: "INPUT",
        label: "AI 연구팀",
        items: [
          "PyTorch 기반 모델",
          "학습된 체크포인트",
        ],
      },
      {
        stage: "TRANSFORM",
        label: "양자화 / 파인튜닝",
        items: [
          "양자화 (Quantization)",
          "파인튜닝 (Fine-tuning)",
        ],
        highlight: true,
      },
      {
        stage: "QC",
        label: "품질 제어 (QC)",
        items: [
          "정량 지표 측정",
          "정성 지표 측정",
          "출시 기준 평가",
        ],
        highlight: true,
      },
      {
        stage: "OPTIMIZE",
        label: "타겟 시스템 최적화",
        items: [
          "SIMD 가속",
          "캐시 친화적 메모리 액세스",
          "HW 가속 (NPU · GPU)",
        ],
        highlight: true,
      },
    ],
  },
  {
    id: "gaudio-ai2",
    layoutId: "workflow-pipeline",
    intro: "Gaudio Lab · Audio AI SDK",
    title: "노이즈 제거 모델 최적화 및 품질 관리",
    body: "추론 엔진 동향 · 다양한 시스템 특징 및 통합 시 고려 요소",
    pipeline: [
      {
        stage: "TARGET",
        label: "타겟 디바이스 / 앱 선정",
        items: [
          "모바일 / 웹 앱",
          "하드웨어 스펙",
          "가용 자원",
          "개발 환경 등",
        ],
        highlight: true,
      },
      {
        stage: "BENCHMARK",
        label: "추론 엔진 벤치마킹",
        items: [
          "NCNN · TNN",
          "NPU / GPU SDK",
          "TFLite",
          "직접 구현",
        ],
        highlight: true,
      },
      {
        stage: "EVALUATE",
        label: "정성 / 정량 측정",
        items: [
          "성능 · 품질 지표",
          "리소스 사용량",
        ],
        highlight: true,
      },
      {
        stage: "VERSION",
        label: "버전 관리",
        items: [
          "릴리즈 추적",
          "회귀 테스트",
        ],
        highlight: true,
      },
    ],
  },
  {
    id: "hobby",
    layoutId: "hobby-card",
    intro: "취미 · Side Project",
    title: "자율주행 레고 자동차",
    progress: 25,
    goal: "음성으로 호출하고 심부름 하는 로봇",
    components: [
      "Lego Defender 42110",
      "Arduino (모터 제어)",
      "RPI5 (ROS2)",
      "LLM (Claude API)",
      "Edge STT",
    ],
    videoUrl: "https://www.youtube.com/embed/3sqj9-MXEdk?start=52",
    videoArea: { x: 500, y: 170, w: 440, h: 290 },
  },
];

// ──────────────────────────────────────────────────────────────────────
// English variant — same slide ids and structure, translated content.
// ──────────────────────────────────────────────────────────────────────
export const slidesDataEn: Slide[] = [
  {
    id: "intro",
    layoutId: "particle-globe",
    title: "Seo's SW R&D Journey",
    highlightText: "Seo",
    subtitle: "2026.06",
  },
  {
    id: "career",
    layoutId: "career-timeline",
    intro: "Career",
    careers: [
      {
        name: "Gaudio Lab",
        description: "Audio tech startup based in Korea",
        start: 2017,
        end: 2026,
        endLabel: "Present",
        title: "Senior SWE & Technical Leader",
        role: "Audio software development",
      },
      {
        name: "Greenwave Systems",
        description: "IoT tech startup based in the US",
        start: 2015,
        end: 2017,
        title: "Senior SWE",
        role: "IPTV live streaming middleware development",
      },
      {
        name: "S-Core (Samsung subsidiary)",
        start: 2014,
        end: 2015,
        title: "SWE",
        role: "Tizen Native App Editor development",
      },
      {
        name: "HUMAX",
        start: 2010,
        end: 2014,
        title: "SWE",
        role: "Broadcast STB middleware development",
      },
    ],
  },
  {
    id: "humax",
    layoutId: "tech-stack",
    intro: "HUMAX · 2010 — 2014 · SWE",
    title:
      "YouView (UK) broadcast spec compliance\nMedia playback / recording C/C++ middleware",
    stack: [
      {
        label: "TV App",
        detail: "User app / media control UI",
      },
      {
        label: "Middleware",
        detail:
          "· System resource management\n· DVB broadcast standard implementation\n· Media playback / recording (C/C++)",
        highlight: true,
        highlightLabel: "Owned",
      },
      {
        label: "STB BSP + Linux HW",
        detail: "Hardware abstraction · drivers",
      },
    ],
    sections: [
      {
        title: "PROJECT",
        items: [
          "YouView (UK terrestrial) — open platform broadcast receiver (Android-like)",
          "HUMAX Europe / Japan common middleware",
        ],
      },
      {
        title: "Key Experience",
        items: [
          "Field (EU, Japan) issue response",
          "Embedded product launch",
          "PMO / HW / App collaboration",
        ],
      },
    ],
  },
  {
    id: "escore",
    layoutId: "tech-stack",
    intro: "S-Core (Samsung subsidiary) · 2014 — 2015 · SWE",
    title: "Tizen Native App Editor — core component development",
    stack: [
      {
        label: "IDE UI (Eclipse-based)",
        detail: "Code editor · project management · build / debug",
      },
      {
        label: "Programming Model + WYSIWYG Editor",
        detail:
          "· Native App development methodology (Programming Model)\n· WYSIWYG visual UI editor",
        highlight: true,
        highlightLabel: "Owned",
      },
      {
        label: "Tizen Native API / SDK",
        detail: "Tizen platform native library",
      },
    ],
    sections: [
      {
        title: "PROJECT",
        items: [
          "Tizen Native App Editor — Android Studio-style IDE for Tizen app developers",
        ],
      },
      {
        title: "Key Experience",
        items: [
          "Eclipse · Chromium open source integration strategy",
          "Programming model design and technical documentation",
          "Presented App Editor at Samsung Open Source Conference",
        ],
      },
    ],
  },
  {
    id: "greenwave",
    layoutId: "tech-stack",
    intro: "Greenwave Systems · 2015 — 2017 · Senior SWE",
    title:
      "Verizon OTT C++ media middleware (HLS / DASH)\nMass production deployment and issue response",
    stack: [
      {
        label: "Verizon OTT App / Player",
        detail: "User video playback interface",
      },
      {
        label: "Media Middleware (C++)",
        detail:
          "· MPEG-DASH · HLS · Progressive Download protocols\n· Audio / Video / DRM data pipeline\n· Multi-threaded concurrency",
        highlight: true,
        highlightLabel: "Owned",
      },
      {
        label: "Platform (Verizon STB / OTT Device)",
        detail: "Verizon mass-production device environment",
      },
    ],
    sections: [
      {
        title: "PROJECT",
        items: [
          "Verizon OTT platform media middleware",
          "Mass-production deployment and live issue response",
        ],
      },
      {
        title: "Key Experience",
        items: [
          "Daily scrum with US Verizon IPTV HW / OPS team",
          "Integration and issue-response collaboration",
        ],
      },
    ],
  },
  {
    id: "gaudio-2017",
    layoutId: "contributions-grid",
    intro: "Gaudio Lab · 2017 — 2018 · Senior SWE",
    title: "VR Spatial Audio SDK Refactoring",
    contributions: [
      {
        label: "VR spatial audio research code (Matlab) → SDK · cross-compile env",
        detail:
          "Convert Matlab-based VR spatial audio research code into SDK · multi-target cross-compile env",
      },
      {
        label: "TDD (Test-Driven Development) adoption",
        detail: "TDD process for productivity and maintainability",
      },
      {
        label: "Demo app development (Oculus · Mobile)",
        detail: "Oculus / Mobile demo app development",
      },
    ],
    sections: [
      {
        title: "PROJECT",
        items: [
          "VR Spatial Audio SDK refactoring — research code to SDK",
        ],
      },
      {
        title: "Key Experience",
        items: [
          "VR industry ecosystem understanding",
          "Audio signal processing fundamentals",
        ],
      },
    ],
  },
  {
    id: "gaudio-2019",
    layoutId: "contributions-grid",
    intro: "Gaudio Lab · 2019 — 2022 · Senior SWE",
    title: "Various contributions to company pivot (VR → Audio DSP SDK)",
    contributions: [
      {
        label: "TDD development environment (Matlab · C/C++)",
        detail: "Matlab, C/C++ TDD environment design and build",
      },
      {
        label: "Multi-platform productization + DevOps",
        detail:
          "Embedded · Mobile · Web (WebAssembly, TypeScript) productization · DevOps deploy system",
      },
      {
        label: "Audio open-source framework modularization",
        detail:
          "FFmpeg / GStreamer-based audio processing SDK development and optimization · Mobile / Embedded support",
      },
      {
        label: "Audio DSP SDK productization",
        detail: "Spatial Audio · Loudness SDK — TWS (AirPods Pro-like) · Mobile, etc.",
      },
    ],
    sections: [
      {
        title: "PROJECT",
        items: [
          "Joined VR SDK team, then responded to Audio SDK strategy pivot",
        ],
      },
      {
        title: "Key Experience",
        items: [
          "Fast startup customer / market response",
          "Understanding audio pain points of video / audio service companies",
          "Engineering design from SDK product perspective",
        ],
      },
    ],
  },
  {
    id: "gaudio-2022",
    layoutId: "contributions-grid",
    intro: "Gaudio Lab · 2022 — Present · Senior SWE & Technical Leader",
    title: "Audio AI SDK Expansion",
    contributions: [
      {
        label: "AI Box prototype research",
        detail:
          "sLM + LLM hybrid · SFT · MCP · STT/TTS Voice Agent",
      },
      {
        label: "On-device SDK productization (Mobile · Desktop)",
        detail: "Noise reduction · source separation model SDK",
      },
      {
        label: "Automotive head-unit spatial audio (GStreamer · CUDA)",
        detail: "External amplifier sound-field module",
      },
      {
        label: "Karaoke system (RK3588)",
        detail: "DSP audio processing design · mass-production deployment and issue response",
      },
      {
        label: "AI / DSP SDK system integration and operations",
        detail: "AOSP · OTT · Embedded · customer issue response",
      },
    ],
    sections: [
      {
        title: "PROJECT",
        items: [
          "Noise reduction AI SDK",
          "Source separation AI SDK",
          "Automotive IVI spatial audio project",
          "Karaoke device signal processing modularization",
        ],
      },
      {
        title: "Key Experience",
        items: [
          "Task design and assignment",
          "Customer technical meetings, solution proposals",
          "Deep learning model training and serving workflow",
          "Inference model optimization and quality management",
        ],
      },
    ],
  },
  {
    id: "gaudio-ai",
    layoutId: "workflow-pipeline",
    intro: "Gaudio Lab · Audio AI SDK",
    title: "Source separation model — training & serving workflow",
    body:
      "Research code versioning and target-system-fit model design collaboration",
    pipeline: [
      {
        stage: "INPUT",
        label: "AI Research Team",
        items: ["PyTorch-based model", "Trained checkpoint"],
      },
      {
        stage: "TRANSFORM",
        label: "Quantization / Fine-tuning",
        items: ["Quantization", "Fine-tuning"],
        highlight: true,
      },
      {
        stage: "QC",
        label: "Quality Control (QC)",
        items: [
          "Quantitative metrics",
          "Qualitative metrics",
          "Release criteria",
        ],
        highlight: true,
      },
      {
        stage: "OPTIMIZE",
        label: "Target system optimization",
        items: [
          "SIMD acceleration",
          "Cache-friendly memory access",
          "HW acceleration (NPU · GPU)",
        ],
        highlight: true,
      },
    ],
  },
  {
    id: "gaudio-ai2",
    layoutId: "workflow-pipeline",
    intro: "Gaudio Lab · Audio AI SDK",
    title: "Noise reduction model — optimization & quality management",
    body:
      "Inference engine trends · diverse system characteristics and integration considerations",
    pipeline: [
      {
        stage: "TARGET",
        label: "Target device / app selection",
        items: [
          "Mobile / Web app",
          "Hardware spec",
          "Available resources",
          "Dev environment, etc.",
        ],
        highlight: true,
      },
      {
        stage: "BENCHMARK",
        label: "Inference engine benchmarking",
        items: [
          "NCNN · TNN",
          "NPU / GPU SDK",
          "TFLite",
          "Custom implementation",
        ],
        highlight: true,
      },
      {
        stage: "EVALUATE",
        label: "Qualitative / Quantitative measurement",
        items: ["Performance · quality metrics", "Resource usage"],
        highlight: true,
      },
      {
        stage: "VERSION",
        label: "Version management",
        items: ["Release tracking", "Regression testing"],
        highlight: true,
      },
    ],
  },
  {
    id: "hobby",
    layoutId: "hobby-card",
    intro: "Hobby · Side Project",
    title: "Autonomous Lego Car",
    progress: 25,
    goal: "Voice-controlled errand-running robot",
    components: [
      "Lego Defender 42110",
      "Arduino (motor control)",
      "RPI5 (ROS2)",
      "LLM (Claude API)",
      "Edge STT",
    ],
    videoUrl: "https://www.youtube.com/embed/3sqj9-MXEdk?start=52",
    videoArea: { x: 500, y: 170, w: 440, h: 290 },
  },
];

import type { Lang } from "./i18n";

export function getSlides(lang: Lang): Slide[] {
  return lang === "en" ? slidesDataEn : slidesDataKo;
}

// Backward-compat alias
export const slidesData = slidesDataKo;
