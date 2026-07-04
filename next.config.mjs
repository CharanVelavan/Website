/** @type {import('next').NextConfig} */
const nextConfig = {
  // Pin the workspace root — a stray lockfile two levels up otherwise makes
  // Next.js guess the wrong root and warn on every build.
  turbopack: {
    root: import.meta.dirname,
  },
};

export default nextConfig;
