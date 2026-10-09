/**
 * Shared browser runtime for every clock component.
 *
 * All clocks used to carry their own copy of the same Intl / setInterval
 * boilerplate, and they all shared the same bugs:
 *   - `hour12: false` without `hourCycle` can yield "24:xx" at midnight on
 *     some engines (and then flips AM/PM in 12-hour mode).
 *   - An invalid `tz` made `Intl.DateTimeFormat` throw inside the first tick,
 *     so the clock froze at the placeholder text.
 *   - `setInterval(tick, 1000)` started at an arbitrary phase, so the display
 *     lagged real time by up to a second and occasionally skipped a second.
 *   - Analog hands jumped backwards at 59 -> 0 because the rotation angle was
 *     reset to 0 while a CSS transition was active.
 *
 * This module fixes those once, for every clock.
 */

export type Lang = "ja" | "en";
export type HourFormat = "12" | "24";

export type TimeParts = {
  /** 0-23 */
  hour: number;
  minute: number;
  second: number;
  /** two-digit month, e.g. "10" */
  month: string;
  /** two-digit day of month, e.g. "09" */
  day: string;
  /** English short weekday from Intl, e.g. "Fri" */
  weekdayEn: string;
};

export const FALLBACK_TZ = "Asia/Tokyo";

const WEEKDAY_JA: Record<string, string> = {
  Sun: "日",
  Mon: "月",
  Tue: "火",
  Wed: "水",
  Thu: "木",
  Fri: "金",
  Sat: "土",
};

export function pad2(n: number | string): string {
  return String(n).padStart(2, "0");
}

function makeFormatter(tz: string): Intl.DateTimeFormat {
  const options: Intl.DateTimeFormatOptions = {
    timeZone: tz,
    hourCycle: "h23",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    weekday: "short",
  };
  try {
    return new Intl.DateTimeFormat("en-US", options);
  } catch {
    // Invalid / unsupported time zone: fall back instead of freezing the clock.
    return new Intl.DateTimeFormat("en-US", { ...options, timeZone: FALLBACK_TZ });
  }
}

/** Returns a function that reads the current wall-clock time in `tz`. */
export function createTimeReader(tz: string | undefined): () => TimeParts {
  const formatter = makeFormatter(tz?.trim() || FALLBACK_TZ);
  return () => {
    const p: Record<string, string> = {};
    for (const part of formatter.formatToParts(new Date())) p[part.type] = part.value;
    return {
      // `% 24` guards engines that still report "24" for midnight.
      hour: Number(p.hour) % 24,
      minute: Number(p.minute),
      second: Number(p.second),
      month: p.month ?? "--",
      day: p.day ?? "--",
      weekdayEn: p.weekday ?? "",
    };
  };
}

/** "HH" for 24h; "hh" plus " AM"/" PM" suffix for 12h (midnight -> 12 AM). */
export function formatHour(hour: number, format: HourFormat): { hour: string; suffix: string } {
  if (format !== "12") return { hour: pad2(hour), suffix: "" };
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  return { hour: pad2(h12), suffix: hour >= 12 ? " PM" : " AM" };
}

/** Weekday label: kanji for ja, upper-case English otherwise. */
export function weekday(en: string, lang: Lang): string {
  if (!en) return "";
  if (lang === "en") return en.toUpperCase();
  return WEEKDAY_JA[en] ?? "";
}

/** Default date rendering shared by most digital clocks: "MM/DD 曜". */
export function formatDate(p: TimeParts, lang: Lang): string {
  return `${p.month}/${p.day} ${weekday(p.weekdayEn, lang)}`;
}

export function readLang(el: HTMLElement): Lang {
  return el.dataset.lang === "en" ? "en" : "ja";
}

export function readFormat(el: HTMLElement): HourFormat {
  return el.dataset.format === "12" ? "12" : "24";
}

/**
 * Runs `tick` immediately and then once per `periodMs`, aligned to the wall
 * clock so the display changes right after each boundary instead of lagging
 * by an arbitrary phase. A throwing tick is logged and does not stop the loop.
 */
export function startTicker(tick: () => void, periodMs = 1000): () => void {
  let timer = 0;
  const run = () => {
    try {
      tick();
    } catch (err) {
      console.error("[clock] tick failed", err);
    }
    const delay = periodMs - (Date.now() % periodMs) + 10;
    timer = window.setTimeout(run, delay);
  };
  run();
  return () => window.clearTimeout(timer);
}

export type DigitalOptions = {
  /** Element receiving "HH:MM" (+ AM/PM). Default ".hm". */
  hmSelector?: string;
  /** Element receiving the seconds text. Default ".sec". */
  secSelector?: string;
  /** Element receiving the date text. Default ".date". */
  dateSelector?: string;
  /**
   * Optional element for the 12-hour " AM"/" PM" suffix. When present, the
   * suffix goes there instead of being appended to the hm text, so a clock
   * can render "12:40:17 AM" with the seconds between hm and the suffix.
   * Default ".ampm".
   */
  ampmSelector?: string;
  /** Customise the seconds text, e.g. prefix a colon. Receives "SS". */
  renderSeconds?: (sec: string) => string;
  /** Customise the date text. */
  renderDate?: (p: TimeParts, lang: Lang) => string;
  /** Extra per-tick hook for component-specific extras. */
  onTick?: (p: TimeParts, ctx: { lang: Lang; format: HourFormat }) => void;
};

/**
 * Wires a digital clock root. Reads tz / lang / format from data-* attributes
 * (already overridden by the embed page's URL parser) and updates the
 * .hm / .sec / .date children once per second.
 */
export function mountDigital(el: HTMLElement, options: DigitalOptions = {}): void {
  const {
    hmSelector = ".hm",
    secSelector = ".sec",
    dateSelector = ".date",
    ampmSelector = ".ampm",
    renderSeconds = (s) => s,
    renderDate = formatDate,
    onTick,
  } = options;

  const read = createTimeReader(el.dataset.tz);
  const lang = readLang(el);
  const format = readFormat(el);
  const hmEl = el.querySelector<HTMLElement>(hmSelector);
  // Analog clocks mark the seconds hand `<g class="hand-s sec">` so the URL
  // override can hide it; that group must never receive the seconds text.
  const secEl = Array.from(el.querySelectorAll<HTMLElement>(secSelector)).find(
    (node) => !node.classList.contains("hand-s"),
  ) ?? null;
  const dateEl = el.querySelector<HTMLElement>(dateSelector);
  const ampmEl = el.querySelector<HTMLElement>(ampmSelector);
  if (!hmEl) return;

  startTicker(() => {
    const p = read();
    const { hour, suffix } = formatHour(p.hour, format);
    hmEl.textContent = `${hour}:${pad2(p.minute)}${ampmEl ? "" : suffix}`;
    if (ampmEl) ampmEl.textContent = suffix;
    if (secEl) secEl.textContent = renderSeconds(pad2(p.second));
    if (dateEl) dateEl.textContent = renderDate(p, lang);
    onTick?.(p, { lang, format });
  });
}

export type AnalogOptions = {
  hourSelector?: string;
  minuteSelector?: string;
  secondSelector?: string;
};

type Hand = { el: SVGElement | HTMLElement; prev: number; turns: number };

/**
 * Wires an analog clock root. Hands are rotated with a monotonically
 * increasing angle so CSS transitions never spin backwards at 59 -> 0.
 */
export function mountAnalog(el: HTMLElement, options: AnalogOptions = {}): void {
  const {
    hourSelector = ".hand-h",
    minuteSelector = ".hand-m",
    secondSelector = ".hand-s",
  } = options;

  const read = createTimeReader(el.dataset.tz);
  const pick = (sel: string): Hand | null => {
    const found = el.querySelector<SVGElement | HTMLElement>(sel);
    return found ? { el: found, prev: -1, turns: 0 } : null;
  };
  const hands = {
    h: pick(hourSelector),
    m: pick(minuteSelector),
    s: pick(secondSelector),
  };
  if (!hands.h || !hands.m) return;

  const rotate = (hand: Hand | null, deg: number) => {
    if (!hand) return;
    // A large drop means the hand passed 12 o'clock (e.g. 354 -> 0); a small
    // backwards step (DST end, manual clock change) should just move back.
    if (hand.prev >= 0 && deg < hand.prev - 180) hand.turns += 1;
    hand.prev = deg;
    hand.el.style.transform = `rotate(${hand.turns * 360 + deg}deg)`;
  };

  let first = true;
  startTicker(() => {
    const { hour, minute, second } = read();
    const all = [hands.h, hands.m, hands.s].filter((h): h is Hand => h !== null);
    // Place the hands instantly on the first tick instead of animating from 0.
    if (first) for (const h of all) h.el.style.transition = "none";
    rotate(hands.h, (hour % 12) * 30 + minute * 0.5);
    rotate(hands.m, minute * 6 + second * 0.1);
    rotate(hands.s, second * 6);
    if (first) {
      first = false;
      void el.getBoundingClientRect(); // flush styles before re-enabling transitions
      for (const h of all) h.el.style.transition = "";
    }
  });
}
