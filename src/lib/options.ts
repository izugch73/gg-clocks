export type ClockOptions = {
  fg: string;
  bg: string;
  accent: string;
  format: "24" | "12";
  seconds: boolean;
  date: boolean;
  live: boolean;
  tz: string;
  lang: "ja" | "en";
  scale: number;
};

export const DEFAULTS: ClockOptions = {
  fg: "#000000",
  bg: "#ffffffb3",
  accent: "#000000",
  format: "24",
  seconds: false,
  date: true,
  live: true,
  tz: "Asia/Tokyo",
  lang: "ja",
  scale: 1,
};

const HEX = /^[0-9a-fA-F]{3,8}$/;

function normalizeColor(raw: string | null, fallback: string): string {
  if (!raw) return fallback;
  const v = raw.trim();
  if (v === "transparent" || v === "none") return "transparent";
  if (v.startsWith("#")) return HEX.test(v.slice(1)) ? v : fallback;
  if (HEX.test(v)) return `#${v}`;
  if (/^(rgb|hsl)a?\(/.test(v)) return v;
  return fallback;
}

function bool(raw: string | null, fallback: boolean): boolean {
  if (raw == null) return fallback;
  const v = raw.toLowerCase();
  if (v === "1" || v === "true" || v === "yes") return true;
  if (v === "0" || v === "false" || v === "no") return false;
  return fallback;
}

function num(raw: string | null, fallback: number, min: number, max: number): number {
  if (raw == null) return fallback;
  const n = Number(raw);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

export function parseOptions(params: URLSearchParams): ClockOptions {
  const format = params.get("format");
  const lang = params.get("lang");
  return {
    fg: normalizeColor(params.get("fg"), DEFAULTS.fg),
    bg: normalizeColor(params.get("bg"), DEFAULTS.bg),
    accent: normalizeColor(params.get("accent"), DEFAULTS.accent),
    format: format === "12" ? "12" : "24",
    seconds: bool(params.get("seconds"), DEFAULTS.seconds),
    date: bool(params.get("date"), DEFAULTS.date),
    live: bool(params.get("live"), DEFAULTS.live),
    tz: params.get("tz")?.trim() || DEFAULTS.tz,
    lang: lang === "en" ? "en" : "ja",
    scale: num(params.get("scale"), DEFAULTS.scale, 0.5, 4),
  };
}

export function serializeOptions(opts: ClockOptions): string {
  const params = new URLSearchParams();
  const setIfDiff = (key: keyof ClockOptions, value: string) => {
    if (String(DEFAULTS[key]) !== String(opts[key])) params.set(key, value);
  };
  setIfDiff("fg", opts.fg);
  setIfDiff("bg", opts.bg);
  setIfDiff("accent", opts.accent);
  setIfDiff("format", opts.format);
  setIfDiff("seconds", opts.seconds ? "1" : "0");
  setIfDiff("date", opts.date ? "1" : "0");
  setIfDiff("live", opts.live ? "1" : "0");
  setIfDiff("tz", opts.tz);
  setIfDiff("lang", opts.lang);
  setIfDiff("scale", String(opts.scale));
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}
