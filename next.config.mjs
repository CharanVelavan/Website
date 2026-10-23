/** @type {import('next').NextConfig} */
const nextConfig = {
  // Pin the workspace root — a stray lockfile two levels up otherwise makes
  // Next.js guess the wrong root and warn on every build.
  turbopack: {
    root: import.meta.dirname,
  },
  // The old Vercel host served a full duplicate of the site. Send it to the
  // real domain so search engines index one copy.
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "charanvelavan-portfolio.vercel.app" }],
        destination: "https://www.charanvelavan.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
