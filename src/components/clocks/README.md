# 時計コンポーネントの作り方（契約）

1つの時計 = `src/components/clocks/<PascalCase>.astro` 1ファイル + `src/data/clocks.ts` の1エントリ。
ファイル名は slug を PascalCase にしたもの（`led-dot-matrix` → `LedDotMatrix.astro`）。登録は自動（`ClockSwitch.astro` が glob で拾う）。

## ルート要素（必須）

```astro
---
import type { ClockOptions } from "../../lib/options";
type Props = { opts: ClockOptions };
const { opts } = Astro.props;
---

<div
  class="xx"                       {/* 短いユニークなクラス。スタイルのスコープに使う */}
  data-clock="my-slug"             {/* slug をそのまま。embed ページの URL 上書きがこれを探す */}
  data-format={opts.format}
  data-seconds={opts.seconds ? "1" : "0"}
  data-date={opts.date ? "1" : "0"}
  data-live={opts.live ? "1" : "0"}
  data-tz={opts.tz}
  data-lang={opts.lang}
  style={`--fg:${opts.fg};--bg:${opts.bg};--accent:${opts.accent};--scale:${opts.scale};`}
>
  ...
</div>
```

- 色は必ず CSS 変数 `--fg` `--bg` `--accent` 経由で使う。固定色は装飾の影などに限る。
- ルートに `transform: scale(var(--scale, 1)); transform-origin: center;` を付ける。
- 配置は Embed レイアウトが body を flex 中央寄せにしている前提。ルートは `recommendedSize` に収まる大きさで描く。
- 外部画像・canvas・外部 JS は禁止。HTML + CSS + inline SVG のみ。
- フォントは `src/data/fonts.ts` の `FONT_SPECS` にある家族名だけ使い、使った家族を `clocks.ts` の `fonts: [...]` に列挙する（embed ページはそれだけを読み込む）。

## デジタル時計の子要素

| 要素 | 役割 | 備考 |
|---|---|---|
| `.hm` | `HH:MM`（12h なら ` AM/PM` 付き） | 必須。プレースホルダは `--:--` |
| `.sec` | 秒 `SS` | 任意。`hidden={!opts.seconds}` を付ける |
| `.ampm` | 12h の ` AM/PM` を秒の後ろに出したいとき | 任意。あると `.hm` には付かない |
| `.date` | `MM/DD 曜` | 任意。`hidden={!opts.date}` |
| `.live` | LIVE バッジ | 任意。`hidden={!opts.live}` |
| `data-with="date"` / `"live"` / `"sec"` | 区切り線・ラベル行など、それに連動して隠す装飾 | SSR でも同じ `hidden={...}` を付ける |

スクリプトは共通ランタイムを呼ぶだけ:

```astro
<script>
  import { mountDigital } from "../../lib/clock-runtime";
  for (const el of document.querySelectorAll<HTMLElement>(".xx")) mountDigital(el);
</script>
```

書式を変えたいときのオプション（`src/lib/clock-runtime.ts` 参照）:
`renderSeconds: (s) => ":" + s`、`renderDate: (p, lang) => ...`、`dateSelector`、`onTick`。
`formatDate(p, lang)` / `weekday(en, lang)` / `pad2(n)` も import できる。

## アナログ時計の子要素

SVG の `<g>` に `.hand-h` `.hand-m` `.hand-s` を付け、`transform-origin` を文字盤中心に合わせる。
秒針は常に描画して `<g class="hand-s sec" {...(opts.seconds ? {} : { hidden: true })}>`（`hidden={...}` は SVG で型エラーになるのでスプレッド）。

```astro
<script>
  import { mountAnalog } from "../../lib/clock-runtime";
  for (const el of document.querySelectorAll<HTMLElement>(".xx")) mountAnalog(el);
</script>
```

針の角度はランタイムが単調増加で回すので、`transition: transform` を付けても逆回転しない。
日付や LIVE を出したい場合は `.date` / `.live` を HTML 要素として併置し、`mountAnalog` の後に `mountDigital` も呼ぶ（`.hm` が無い場合は `mountDigital` は何もしないので、`.hm` を `hidden` で置くこと）。
`mountDigital` は秒の書き込み先から `.hand-s` を自動的に除外するので、秒針グループ `<g class="hand-s sec">` が壊れることはない。秒の数字も出したいときは別の `.sec` 要素（HTML）を置く。

## clocks.ts のエントリ

```ts
{
  slug: "my-slug",
  name: "My Clock",
  tagline: "日本語で40字程度。見た目と向いている配信。",
  category: "card",
  tags: ["card", "pop"],
  recommendedSize: { width: 240, height: 120 },
  fonts: ["Plus Jakarta Sans"],
  defaults: { bg: "transparent", fg: "#1a1a22", accent: "#ff3355", seconds: false, date: true, live: false },
  darkVariant: { fg: "#f4f4f4" },   // 黒ベース配信向けの上書き（任意）
},
```

`defaults` は白い配信背景で映える値、`darkVariant` は黒背景で差し替える値。

## 確認

```sh
npm run check   # 型チェック
npm run build   # dist/<slug>/embed/index.html が生成される
```

ブラウザでは `/<slug>/embed/?tz=Asia/Kolkata&format=12&seconds=1&date=0&live=0` などで URL 上書きが効くことを見る。
