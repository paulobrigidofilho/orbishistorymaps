import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const enableProxyDebug = process.env.VITE_DEBUG_PROXY === "true";
const backendTarget = process.env.VITE_BACKEND_URL || "http://localhost:4000";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 5173,
    proxy: {
      "/api": {
        target: backendTarget,
        changeOrigin: true,
        secure: false,
        configure: enableProxyDebug
          ? (proxy) => {
              const stamp = () => new Date().toISOString();
              proxy.on("error", (err, req) => {
                console.log(
                  `[Proxy ERROR ${stamp()}] ${req.method} ${req.url} -> ${
                    err.message
                  }`
                );
              });
              proxy.on("proxyReq", (proxyReq, req) => {
                console.log(
                  `[Proxy REQUEST ${stamp()}] ${req.method} ${req.url}`
                );
              });
              proxy.on("proxyRes", (proxyRes, req) => {
                console.log(
                  `[Proxy RESPONSE ${stamp()}] ${proxyRes.statusCode} ${
                    req.method
                  } ${req.url}`
                );
              });
            }
          : undefined,
      },
      "/config": {
        target: backendTarget,
        changeOrigin: true,
        secure: false,
      },
      "/health": {
        target: backendTarget,
        changeOrigin: true,
        secure: false,
      },
      "/uploads": {
        target: backendTarget,
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
