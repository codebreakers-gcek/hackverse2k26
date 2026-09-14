import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "*.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "*.cloudinary.com",
      },
    ],
  },
  serverExternalPackages: ["@resvg/resvg-js", "pdfkit"],
  // Allow mobile devices and local network hosts in development
  allowedDevOrigins: [
    "localhost",
    "127.0.0.1",
    "192.168.1.42",
    "192.168.*",
    "*.local",
  ],
};

export default nextConfig;
