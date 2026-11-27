const securityHeaders = [
  { key: "Permissions-Policy", value: "camera=(), geolocation=(), microphone=()" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
];

export default {
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      // Blog images don't change once published, so browsers can skip re-checking them for a year.
      // To replace one, give the new file a new name.
      { source: "/images/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=31536000" }] },
    ];
  },
  // Pages from the old React portfolio; keep their links landing somewhere useful.
  async redirects() {
    return [
      { source: "/blog/how-database-replication-actually-works", destination: "/blog/how-database-replication-works", permanent: true },
      { source: "/contact", destination: "/about", permanent: true },
      { source: "/random", destination: "/", permanent: true },
      { source: "/ssh-portfolio", destination: "/blog/ssh-portfolio-guide", permanent: true },
    ];
  },
};
