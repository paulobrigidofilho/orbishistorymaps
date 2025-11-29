import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const enableProxyDebug = process.env.VITE_DEBUG_PROXY === "true";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 5173,
    proxy: {
      "/api": {
        target: "http://backend:4000",
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
        target: "http://backend:4000",
        changeOrigin: true,
        secure: false,
      },
      "/uploads": {
        target: "http://backend:4000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
