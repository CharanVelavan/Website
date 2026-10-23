import { notFound } from "next/navigation";
import { getProjectBySlug, projects } from "@/lib/projects";
import { clipDescription } from "@/lib/site-config";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};

  const description = clipDescription(project.summary);
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

export default async function ProjectSlugLayout({ children, params }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();
  return children;
}
