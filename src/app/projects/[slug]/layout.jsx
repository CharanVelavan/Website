import { getProjectBySlug, projects } from "@/lib/projects";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};

  const description =
    project.summary?.length > 160
      ? `${project.summary.slice(0, 157)}...`
      : project.summary;
  const image = project.images?.[0] || "/profile.jpg";

  return {
    title: project.title,
    description,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      type: "article",
      title: `${project.title} | Charan Velavan`,
      description,
      images: [{ url: image, alt: project.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} | Charan Velavan`,
      description,
      images: [image],
    },
  };
}

export default function ProjectSlugLayout({ children }) {
  return children;
}
