const securityHeaders = [
  { key: "Permissions-Policy", value: "camera=(), geolocation=(), microphone=()" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
];

export default {
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  // Pages from the old React portfolio; keep their links landing somewhere useful.
  async redirects() {
    return [
      { source: "/projects", destination: "/about", permanent: true },
      { source: "/contact", destination: "/about", permanent: true },
      { source: "/random", destination: "/", permanent: true },
      { source: "/ssh-portfolio", destination: "/blog/ssh-portfolio-guide", permanent: true },
    ];
  },
};
