import { NextResponse } from "next/server";
import { projects } from "@/lib/projects";

// One URL per project: /projects/birds-ai and other case variants redirect to the
// real slug. Done here, before the page cache, because a redirect from inside a
// prerendered page would be cached under the wrong URL.
const SLUGS = new Map(projects.map((p) => [p.slug.toLowerCase(), p.slug]));

export function proxy(request) {
  const slug = decodeURIComponent(request.nextUrl.pathname.split("/")[2] || "");
  const real = SLUGS.get(slug.toLowerCase());
  if (!real || real === slug) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = `/projects/${real}`;
  return NextResponse.redirect(url, 308);
}

export const config = {
  matcher: "/projects/:slug",
};
