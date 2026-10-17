import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const securityHeaders = [
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "Strict-Transport-Security",
    // Standard 1-year HSTS policy for production HTTPS.
    // Note: RFC 6797 states browsers ignore HSTS over plain HTTP (e.g. localhost).
    // includeSubDomains and preload should only be enabled when all subdomains have validated TLS
    // and the domain is officially registered on hstspreload.org.
    value: "max-age=31536000",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(self)",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Remove unsafe-eval in production; keep only for development Fast Refresh/source maps
      isProd
        ? "script-src 'self' 'unsafe-inline'"
        : "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: blob: https://images.unsplash.com https://*.tile.openstreetmap.org https://tile.openstreetmap.org",
      "font-src 'self' data: https://fonts.gstatic.com",
      "connect-src 'self' https://router.project-osrm.org https://*.tile.openstreetmap.org https://tile.openstreetmap.org",
      "object-src 'none'",
      "frame-ancestors 'self'",
      "form-action 'self'",
      "base-uri 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  // The project lives under the user's home directory (C:\Users\sridh),
  // which contains its own package-lock.json. Turbopack's root detection
  // walks up and finds that file, misdetecting the home dir as the project
  // root. Pin the root explicitly to the project directory.
  turbopack: {
    root: __dirname,
  },
  images: {
    qualities: [75, 90, 100],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/home",
        permanent: true,
      },
      {
        source: "/home2",
        destination: "/home",
        permanent: true,
      },
      {
        source: "/home3",
        destination: "/home",
        permanent: true,
      },
      {
        source: "/home4",
        destination: "/home",
        permanent: true,
      },
      {
        source: "/home5",
        destination: "/home",
        permanent: true,
      },
      {
        source: "/accommodations",
        destination: "/facilities",
        permanent: true,
      },
      {
        source: "/experience",
        destination: "/gallery",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
