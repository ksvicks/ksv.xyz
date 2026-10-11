import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // HealthKaati was renamed to HealthKaaati after the first post went live.
  async redirects() {
    return [
      { source: "/blog/healthkaati", destination: "/blog/healthkaaati", permanent: true },
      { source: "/blog/tag/healthkaati", destination: "/blog/tag/healthkaaati", permanent: true },
      { source: "/projects/healthkaati", destination: "/projects/healthkaaati", permanent: true },
    ];
  },
};

export default nextConfig;
