import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://clocks.thegg.jp",
  devToolbar: { enabled: false },
  build: {
    inlineStylesheets: "always",
  },
  integrations: [
    sitemap({
      filter: (page) => !page.includes("/embed"),
    }),
  ],
});
