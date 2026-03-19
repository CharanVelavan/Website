import SkeletonCard from "@/components/SkeletonCard";

export default function ProjectLoading() {
  return (
    <div className="mx-auto max-w-[1600px] px-4 sm:px-6 pt-28 pb-16 lg:py-24">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[280px_1fr] xl:grid-cols-[280px_1fr_240px] xl:gap-6">
        {/* Left sidebar skeleton */}
        <div className="hidden lg:flex flex-col gap-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-10 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 animate-pulse"
            />
          ))}
        </div>

        {/* Main content skeleton */}
        <div className="w-full max-w-4xl space-y-8">
          {/* Breadcrumb */}
          <div className="h-5 w-32 rounded-lg bg-black/5 dark:bg-white/5 animate-pulse" />
          {/* Title */}
          <div className="space-y-3">
            <div className="h-10 w-3/4 rounded-xl bg-black/5 dark:bg-white/5 animate-pulse" />
            <div className="h-5 w-full rounded-lg bg-black/5 dark:bg-white/5 animate-pulse" />
            <div className="h-5 w-5/6 rounded-lg bg-black/5 dark:bg-white/5 animate-pulse" />
          </div>
          {/* Image gallery skeleton */}
          <div className="flex gap-4 overflow-hidden">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="flex-shrink-0 h-64 w-80 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 animate-pulse"
              />
            ))}
          </div>
          {/* Content blocks */}
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="h-7 w-40 rounded-lg bg-black/5 dark:bg-white/5 animate-pulse" />
              <div className="h-4 w-full rounded-lg bg-black/5 dark:bg-white/5 animate-pulse" />
              <div className="h-4 w-11/12 rounded-lg bg-black/5 dark:bg-white/5 animate-pulse" />
              <div className="h-4 w-4/5 rounded-lg bg-black/5 dark:bg-white/5 animate-pulse" />
            </div>
          ))}
        </div>

        {/* Right sidebar skeleton */}
        <div className="hidden xl:flex flex-col gap-3">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-16 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
