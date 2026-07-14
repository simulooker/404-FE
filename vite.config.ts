import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  // 1. Vite가 빌드할 때 파일들을 찾을 기준 경로를 지정합니다. (앞뒤 슬래시 필수!)
  base: "/404-FE/",

  server: {
    host: true,
    proxy: {
      "/api": {
        target: "https://gamematch-be.onrender.com",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },

  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg"],
      manifest: {
        name: "GameLink",
        short_name: "GameLink",
        description: "게임 매칭 서비스",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
        // 2. PWA가 시작될 때의 URL도 깃허브 서브디렉토리 경로에 맞춰줍니다.
        start_url: "/404-FE/",
        icons: [
          {
            src: "favicon.svg",
            sizes: "any",
            type: "image/svg+xml",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
      },
    }),
  ],
});
