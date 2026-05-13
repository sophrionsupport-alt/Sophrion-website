import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  async redirects() {
    return [
      { source: "/students", destination: "/join", permanent: false },
      { source: "/students/:path*", destination: "/join", permanent: false },
      { source: "/colleges", destination: "/institutions", permanent: false },
      { source: "/colleges/:path*", destination: "/institutions", permanent: false },
      { source: "/products", destination: "/ecosystem", permanent: false },
      { source: "/services", destination: "/ecosystem", permanent: false },
    ];
  },
};

export default nextConfig;
