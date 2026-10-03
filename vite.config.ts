import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import sitemap from "vite-plugin-sitemap";
import vitePrerender from "vite-plugin-prerender";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    sitemap({
      hostname: "https://solvexsupply.com",
      dynamicRoutes: [
        "/",
        "/products",
        "/sourcing",
        "/industries",
        "/rfq",
        "/contactus",
        "/about",
        "/help",
        "/shop",
      ],
      exclude: [
        "/admin/**",
        "/user/**",
        "/login",
        "/register",
        "/verify",
        "/cart",
      ],
      readable: true,
      // 🔥 Add lastmod, changefreq, priority
      generateRobotsTxt: true,
      robots: [
        {
          userAgent: "*",
          allow: "/",
          disallow: ["/admin/", "/user/", "/login", "/register"],
        },
      ],
    }),

    // vite.config.ts
    vitePrerender({
      staticDir: path.join(__dirname, "dist"),
      routes: ["/", "/aboutus", "/contactus"],
      renderer: new vitePrerender.PuppeteerRenderer({
        renderAfterDocumentEvent: "render-event", // আপনার Home.tsx এ ডিসপ্যাচ করা ইভেন্ট
      }),
    }),
  ],
  optimizeDeps: {
    include: ["react-hook-form", "@hookform/resolvers", "zod"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: [
      "react-hook-form",
      "@hookform/resolvers",
      "zod",
      "react",
      "react-dom",
    ],
  },
  server: {
    port: 3000,
  },
  // 🔥 Build Optimization
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          router: ["react-router"],
          redux: ["@reduxjs/toolkit", "react-redux"],
        },
      },
    },
    sourcemap: false, // Production এ false
    minify: "esbuild",
  },
});
