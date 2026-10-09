/**
 * Google Fonts families a clock may use. Each clock lists the families it
 * needs in its `fonts` meta (src/data/clocks.ts); the embed page then loads
 * only those, so adding fonts here costs nothing for clocks that don't use them.
 *
 * Key: the family name exactly as written in CSS `font-family`.
 * Value: the css2 API "family=" spec (weights included where the family has them).
 */
export const FONT_SPECS: Record<string, string> = {
  // Latin
  Roboto: "Roboto:wght@500;700;900",
  "Plus Jakarta Sans": "Plus Jakarta Sans:wght@500;700;800",
  "Share Tech Mono": "Share Tech Mono",
  "Press Start 2P": "Press Start 2P",
  Audiowide: "Audiowide",
  Orbitron: "Orbitron:wght@500;700;900",
  VT323: "VT323",
  "Bebas Neue": "Bebas Neue",
  "Playfair Display": "Playfair Display:wght@400;700;900",
  Cinzel: "Cinzel:wght@400;700",
  "Major Mono Display": "Major Mono Display",
  "Rubik Mono One": "Rubik Mono One",
  Silkscreen: "Silkscreen:wght@400;700",
  Pacifico: "Pacifico",
  Caveat: "Caveat:wght@400;700",
  Comfortaa: "Comfortaa:wght@400;700",
  Oswald: "Oswald:wght@400;700",
  Anton: "Anton",
  Monoton: "Monoton",
  Bungee: "Bungee",
  Righteous: "Righteous",
  "Space Mono": "Space Mono:wght@400;700",
  "IBM Plex Mono": "IBM Plex Mono:wght@400;700",
  Fredoka: "Fredoka:wght@400;700",
  Lobster: "Lobster",
  "Permanent Marker": "Permanent Marker",
  "Shadows Into Light": "Shadows Into Light",
  // Japanese
  "Zen Old Mincho": "Zen Old Mincho:wght@400;700;900",
  "Zen Kaku Gothic New": "Zen Kaku Gothic New:wght@500;700;900",
  DotGothic16: "DotGothic16",
  "Dela Gothic One": "Dela Gothic One",
  "Kosugi Maru": "Kosugi Maru",
  "Hachi Maru Pop": "Hachi Maru Pop",
  "Reggae One": "Reggae One",
  "Yusei Magic": "Yusei Magic",
  "Train One": "Train One",
  "Noto Serif JP": "Noto Serif JP:wght@400;700;900",
};

/** Builds the Google Fonts stylesheet URL for the given families (Roboto if none). */
export function googleFontsHref(families: string[] | undefined): string {
  const list = [...new Set(families && families.length > 0 ? families : ["Roboto"])];
  const parts = list.map((family) => {
    const spec = FONT_SPECS[family];
    if (!spec) {
      throw new Error(`Unknown font "${family}". Add it to src/data/fonts.ts or fix the clock's fonts meta.`);
    }
    return "family=" + spec.replace(/ /g, "+");
  });
  return `https://fonts.googleapis.com/css2?${parts.join("&")}&display=swap`;
}
