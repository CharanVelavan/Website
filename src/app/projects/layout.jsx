export const metadata = {
  // Keep default + template so /projects/[slug] titles still get the suffix
  title: { default: "Projects", template: "%s | Charan Velavan" },
  description:
    "Projects by Charan Velavan — 5G search & rescue drones, interaction robots, embedded AI, and next-generation communication systems.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsLayout({ children }) {
  return children;
}
