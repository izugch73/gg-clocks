import type { ClockOptions } from "../lib/options";

export type CategoryId = "digital-minimal" | "card" | "dark" | "retro" | "analog";

export type Category = {
  id: CategoryId;
  name: string;
  description: string;
  thumbBg: string;
};

export const CATEGORIES: Category[] = [
  {
    id: "digital-minimal",
    name: "テロップ・ミニマル",
    description: "配信画面の上下にそのまま貼れる、装飾を削いだ時計。",
    thumbBg: "linear-gradient(135deg, #1a1a22, #2a2a36)",
  },
  {
    id: "card",
    name: "カード・ポップ",
    description: "やわらかい色味と明るい雰囲気で、雑談・VTuber配信に馴染むタイプ。",
    thumbBg:
      "linear-gradient(135deg, #ffd9e3 0%, #ffe8a8 50%, #c8e4ff 100%)",
  },
  {
    id: "dark",
    name: "ダーク・グロー",
    description: "黒地＋発光で映える、ゲーム・夜間配信向けのタイプ。",
    thumbBg: "linear-gradient(135deg, #0d0d12, #1c1c25 60%, #2a2230)",
  },
  {
    id: "retro",
    name: "レトロ・ドット",
    description: "ピクセルやドットマトリクスを使った、レトロ感のあるタイプ。",
    thumbBg:
      "radial-gradient(circle, rgba(255,255,255,0.05) 1.2px, transparent 1.6px) 0 0 / 8px 8px, linear-gradient(135deg, #1c1610, #271a16)",
  },
  {
    id: "analog",
    name: "アナログ",
    description: "文字盤と針で構成される伝統的なアナログ時計。",
    thumbBg: "linear-gradient(135deg, #f5efe2, #ece4d2)",
  },
];

export type ClockMeta = {
  slug: string;
  name: string;
  tagline: string;
  category: CategoryId;
  tags: string[];
  recommendedSize: { width: number; height: number };
  /** Defaults optimised for a light/white preview backdrop. */
  defaults?: Partial<ClockOptions>;
  /** Overrides applied when the preview backdrop is set to dark. */
  darkVariant?: Partial<ClockOptions>;
};

export const CLOCKS: ClockMeta[] = [
  {
    slug: "digital-simple",
    name: "Digital Inline",
    tagline: "画面上下のテロップにそのまま貼れる、横長インライン帯。",
    category: "digital-minimal",
    tags: ["digital", "minimal", "bar"],
    recommendedSize: { width: 380, height: 44 },
    defaults: { bg: "#0d0d10", fg: "#f6f6f4", accent: "#ff3355" },
  },
  {
    slug: "subtitle-bar",
    name: "Subtitle Bar",
    tagline: "字幕風の素テキスト＋下線一本。背景は使わずに重ねる前提。",
    category: "digital-minimal",
    tags: ["minimal", "telop", "subtitle"],
    recommendedSize: { width: 380, height: 44 },
    defaults: {
      bg: "transparent",
      fg: "#0d0d10",
      accent: "#ff3355",
      live: true,
    },
    darkVariant: { fg: "#f6f6f4" },
  },
  {
    slug: "mono-stack",
    name: "Mono Stack",
    tagline: "時刻と日付を縦に積んだ極シンプルな2行構成。",
    category: "digital-minimal",
    tags: ["minimal", "mono", "stack"],
    recommendedSize: { width: 200, height: 110 },
    defaults: {
      bg: "transparent",
      fg: "#0d0d10",
      accent: "#0d0d10",
      live: false,
    },
    darkVariant: { fg: "#f6f6f4", accent: "#f6f6f4" },
  },
  {
    slug: "bracket",
    name: "Bracket",
    tagline: "角括弧で時刻を挟む、コードエディタ風のミニマル。",
    category: "digital-minimal",
    tags: ["minimal", "code"],
    recommendedSize: { width: 240, height: 60 },
    defaults: {
      bg: "transparent",
      fg: "#0d0d10",
      accent: "#ff5d5d",
      live: false,
    },
    darkVariant: { fg: "#f6f6f4" },
  },
  {
    slug: "outline-number",
    name: "Outline Number",
    tagline: "縁取りだけの巨大数字。塗りなしで背景に溶ける。",
    category: "digital-minimal",
    tags: ["minimal", "outline"],
    recommendedSize: { width: 260, height: 120 },
    defaults: {
      bg: "transparent",
      fg: "#0d0d10",
      accent: "#ff5d5d",
      live: false,
    },
    darkVariant: { fg: "#f6f6f4" },
  },
  {
    slug: "mini-tag",
    name: "Mini Tag",
    tagline: "極小の隅貼り用タグ。配信画面のどこにでも置ける。",
    category: "digital-minimal",
    tags: ["minimal", "tag", "small"],
    recommendedSize: { width: 160, height: 30 },
    defaults: {
      bg: "#15171a",
      fg: "#f6f6f4",
      accent: "#ff3355",
      live: true,
    },
  },
  {
    slug: "sticker",
    name: "Sticker",
    tagline: "雑談・VTuber配信に馴染む、丸みのあるパステルカード。",
    category: "card",
    tags: ["card", "pop", "light"],
    recommendedSize: { width: 200, height: 150 },
    defaults: {
      bg: "transparent",
      fg: "#3a2a3a",
      accent: "#ffb3c7",
      live: false,
    },
  },
  {
    slug: "pop-sticker",
    name: "Pop Sticker",
    tagline: "ビビッド黄＋ブラック枠＋ドット縁取り。元気な雑談配信に。",
    category: "card",
    tags: ["card", "pop", "light"],
    recommendedSize: { width: 220, height: 160 },
    defaults: {
      bg: "#ffe55c",
      fg: "#15171a",
      accent: "#15171a",
      live: false,
    },
  },
  {
    slug: "glass-frost",
    name: "Glass Frost",
    tagline: "細い枠と柔らかな影だけの軽やかな箱。どんな配信にも馴染む。",
    category: "card",
    tags: ["card", "glass", "light"],
    recommendedSize: { width: 240, height: 140 },
    defaults: {
      bg: "transparent",
      fg: "#1a1a22",
      accent: "#1a1a22",
      live: false,
    },
    darkVariant: { fg: "#f4f4f4", accent: "#f4f4f4" },
  },
  {
    slug: "chip",
    name: "Chip",
    tagline: "UIチップ風の上品なピル。最小限の装飾でどんな配信にも馴染む。",
    category: "card",
    tags: ["card", "minimal", "light"],
    recommendedSize: { width: 280, height: 50 },
    defaults: {
      bg: "#ffffff",
      fg: "#15171a",
      accent: "#6b6b6b",
      live: false,
    },
    darkVariant: { bg: "#15171a", fg: "#f6f6f4", accent: "#a0a0a0" },
  },
  {
    slug: "digital-led",
    name: "Digital LED",
    tagline: "7セグ風のグロー演出。ゲーム配信の隅に映える。",
    category: "dark",
    tags: ["digital", "neon", "dark"],
    recommendedSize: { width: 260, height: 110 },
    defaults: {
      bg: "transparent",
      fg: "#16ff7c",
      accent: "#16ff7c",
      seconds: true,
      live: false,
    },
  },
  {
    slug: "neon-glow",
    name: "Neon Glow",
    tagline: "蛍光カラーのグロー演出。夜のFPS・テク系配信に。",
    category: "dark",
    tags: ["digital", "neon", "dark"],
    recommendedSize: { width: 300, height: 130 },
    defaults: {
      bg: "#0a0a14",
      fg: "#ff3df2",
      accent: "#00f0ff",
      seconds: false,
      live: false,
    },
  },
  {
    slug: "terminal",
    name: "Terminal",
    tagline: "CLI風プロンプト＋点滅カーソル。Tech系・プログラミング配信に。",
    category: "dark",
    tags: ["digital", "code", "dark"],
    recommendedSize: { width: 320, height: 140 },
    defaults: {
      bg: "#0a0d0c",
      fg: "#7df57f",
      accent: "#7df57f",
      seconds: true,
      live: false,
    },
  },
  {
    slug: "pixel",
    name: "Pixel",
    tagline: "ドット絵フォント＋段付きシャドウ。レトロゲー配信に。",
    category: "retro",
    tags: ["retro", "pixel"],
    recommendedSize: { width: 260, height: 130 },
    defaults: {
      bg: "#ffd9e8",
      fg: "#3a1f4d",
      accent: "#ff5d8f",
      seconds: false,
      live: true,
    },
  },
  {
    slug: "led-dot-matrix",
    name: "LED Dot Matrix",
    tagline: "ドット穴の奥で光るマトリクスLED。駅・空港の表示板感。",
    category: "retro",
    tags: ["digital", "retro"],
    recommendedSize: { width: 300, height: 130 },
    defaults: {
      bg: "#dbe9f7",
      fg: "#1a4a8c",
      accent: "#1a4a8c",
      seconds: false,
      live: false,
    },
  },
  {
    slug: "cassette",
    name: "Cassette Tape",
    tagline: "カセットテープのレーベル風。アナログメディアな空気感。",
    category: "retro",
    tags: ["retro", "paper", "light"],
    recommendedSize: { width: 280, height: 170 },
    defaults: {
      bg: "#f7eed8",
      fg: "#2a221b",
      accent: "#bd2c2c",
      seconds: false,
      live: false,
    },
  },
  {
    slug: "analog-minimal",
    name: "Analog Minimal",
    tagline: "白フチのアナログ。動きで配信中だと一目でわかる。",
    category: "analog",
    tags: ["analog", "minimal"],
    recommendedSize: { width: 220, height: 220 },
    defaults: { date: false, live: false, bg: "transparent", fg: "#1a1a1a", accent: "#1a1a1a" },
    darkVariant: { fg: "#f4f4f4", accent: "#f4f4f4" },
  },
  {
    slug: "analog-classic",
    name: "Analog Classic",
    tagline: "文字盤・3針・ベゼルの伝統的アナログ。落ち着いた配信に。",
    category: "analog",
    tags: ["analog", "classic"],
    recommendedSize: { width: 220, height: 220 },
    defaults: {
      bg: "#f5efe2",
      date: false,
      live: false,
      seconds: true,
      fg: "#1a1a1a",
      accent: "#cc3030",
    },
    darkVariant: { bg: "#1c1c25", fg: "#e8e8ee", accent: "#ff5d5d" },
  },
  {
    slug: "analog-roman",
    name: "Analog Roman",
    tagline: "ローマ数字＋細い針のクラシック。落ち着いたチャンネルに。",
    category: "analog",
    tags: ["analog", "classic"],
    recommendedSize: { width: 220, height: 220 },
    defaults: {
      bg: "#fbf6ec",
      date: false,
      live: false,
      seconds: true,
      fg: "#222a35",
      accent: "#a23030",
    },
  },
  {
    slug: "analog-dot",
    name: "Analog Dot",
    tagline: "12個のドットだけのアナログ。極限まで削いだミニマル。",
    category: "analog",
    tags: ["analog", "minimal"],
    recommendedSize: { width: 220, height: 220 },
    defaults: {
      bg: "transparent",
      date: false,
      live: false,
      seconds: true,
      fg: "#1a1a1a",
      accent: "#1a1a1a",
    },
    darkVariant: { fg: "#f4f4f4", accent: "#f4f4f4" },
  },
];

export function findClock(slug: string | undefined): ClockMeta | undefined {
  if (!slug) return undefined;
  return CLOCKS.find((c) => c.slug === slug);
}

export function clocksByCategory(id: CategoryId): ClockMeta[] {
  return CLOCKS.filter((c) => c.category === id);
}

export function variantQuery(variant: Partial<ClockOptions> | undefined): string {
  if (!variant) return "";
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(variant)) {
    if (v === undefined || v === null) continue;
    if (typeof v === "boolean") p.set(k, v ? "1" : "0");
    else p.set(k, String(v));
  }
  return p.toString();
}
