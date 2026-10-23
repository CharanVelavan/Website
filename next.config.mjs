// the lab's case studies (CASES in design/prototype/v7/cases.js), and the old projects that are achievements
const LAB_CASES = ["Birds-AI", "nephele-community-robot", "ai-native-network-uav", "thz-bandpass-filter", "5g-network-implementation", "emotion-monitoring-system", "waterbot"];
const ACHIEVEMENT_PROJECTS = ["sih-23-finalist", "nbuc-24-first-place", "inventors-challenge-23", "sih-22-finalist"];

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
      // The 3D lab replaced the project pages: each one goes to its case study in the lab, and the four that were also
      // achievements go to their achievement page. The old site is kept on the website-legacy branch.
      ...LAB_CASES.map((slug) => ({ source: `/projects/${slug}`, destination: `/#/projects/${slug}`, permanent: true })),
      ...ACHIEVEMENT_PROJECTS.map((slug) => ({ source: `/projects/${slug}`, destination: `/achievements/${slug}`, permanent: true })),
      { source: "/projects", destination: "/", permanent: true },
    ];
  },
  // The home page is the 3D lab: a static page that design/prototype/site7.py builds into public/ before every build
  async rewrites() {
    return { beforeFiles: [{ source: "/", destination: "/lab.html" }] };
  },
};

export default nextConfig;
