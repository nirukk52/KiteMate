// vite.config.ts
import { sveltekit } from "file:///Users/priyankalalge/KiteMate/KiteMate/frontend/node_modules/@sveltejs/kit/src/exports/vite/index.js";
import { defineConfig } from "file:///Users/priyankalalge/KiteMate/KiteMate/frontend/node_modules/vitest/dist/config.js";
var vite_config_default = defineConfig({
  plugins: [sveltekit()],
  server: {
    port: 5173,
    proxy: {
      // Proxy API requests to Encore backend during development
      "/api": {
        target: "http://localhost:4000",
        changeOrigin: true
      }
    }
  },
  test: {
    include: ["src/**/*.{test,spec}.{js,ts}"]
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvcHJpeWFua2FsYWxnZS9LaXRlTWF0ZS9LaXRlTWF0ZS9mcm9udGVuZFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL3ByaXlhbmthbGFsZ2UvS2l0ZU1hdGUvS2l0ZU1hdGUvZnJvbnRlbmQvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL3ByaXlhbmthbGFsZ2UvS2l0ZU1hdGUvS2l0ZU1hdGUvZnJvbnRlbmQvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBzdmVsdGVraXQgfSBmcm9tICdAc3ZlbHRlanMva2l0L3ZpdGUnO1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZXN0L2NvbmZpZyc7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtzdmVsdGVraXQoKV0sXG4gIHNlcnZlcjoge1xuICAgIHBvcnQ6IDUxNzMsXG4gICAgcHJveHk6IHtcbiAgICAgIC8vIFByb3h5IEFQSSByZXF1ZXN0cyB0byBFbmNvcmUgYmFja2VuZCBkdXJpbmcgZGV2ZWxvcG1lbnRcbiAgICAgICcvYXBpJzoge1xuICAgICAgICB0YXJnZXQ6ICdodHRwOi8vbG9jYWxob3N0OjQwMDAnLFxuICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWVcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIHRlc3Q6IHtcbiAgICBpbmNsdWRlOiBbJ3NyYy8qKi8qLnt0ZXN0LHNwZWN9Lntqcyx0c30nXVxuICB9XG59KTtcblxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUErVCxTQUFTLGlCQUFpQjtBQUN6VixTQUFTLG9CQUFvQjtBQUU3QixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTLENBQUMsVUFBVSxDQUFDO0FBQUEsRUFDckIsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sT0FBTztBQUFBO0FBQUEsTUFFTCxRQUFRO0FBQUEsUUFDTixRQUFRO0FBQUEsUUFDUixjQUFjO0FBQUEsTUFDaEI7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBQ0EsTUFBTTtBQUFBLElBQ0osU0FBUyxDQUFDLDhCQUE4QjtBQUFBLEVBQzFDO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
