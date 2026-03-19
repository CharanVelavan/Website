export default function AchievementLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-24 pb-16 lg:py-24">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr] xl:gap-12">
        {/* Left sidebar skeleton */}
        <div className="hidden lg:flex flex-col gap-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-10 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 animate-pulse"
            />
          ))}
        </div>

        {/* Main content skeleton */}
        <div className="w-full space-y-8">
          {/* Breadcrumb */}
          <div className="h-5 w-32 rounded-lg bg-black/5 dark:bg-white/5 animate-pulse" />
          {/* Category + year pills */}
          <div className="flex gap-3">
            <div className="h-8 w-24 rounded-full bg-black/5 dark:bg-white/5 animate-pulse" />
            <div className="h-8 w-16 rounded-full bg-black/5 dark:bg-white/5 animate-pulse" />
          </div>
          {/* Title */}
          <div className="space-y-3">
            <div className="h-12 w-3/4 rounded-xl bg-black/5 dark:bg-white/5 animate-pulse" />
            <div className="h-5 w-full rounded-lg bg-black/5 dark:bg-white/5 animate-pulse" />
            <div className="h-5 w-5/6 rounded-lg bg-black/5 dark:bg-white/5 animate-pulse" />
          </div>
          {/* Tags row */}
          <div className="flex gap-2 flex-wrap">
            {[80, 64, 96, 72, 56].map((w, i) => (
              <div
                key={i}
                className="h-7 rounded-full bg-black/5 dark:bg-white/5 animate-pulse"
                style={{ width: `${w}px` }}
              />
            ))}
          </div>
          {/* Image gallery placeholder */}
          <div className="flex gap-4 overflow-hidden">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="flex-shrink-0 h-64 w-80 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 animate-pulse"
              />
            ))}
          </div>
          {/* Content blocks */}
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="h-8 w-44 rounded-lg bg-black/5 dark:bg-white/5 animate-pulse" />
              <div className="h-4 w-full rounded-lg bg-black/5 dark:bg-white/5 animate-pulse" />
              <div className="h-4 w-11/12 rounded-lg bg-black/5 dark:bg-white/5 animate-pulse" />
              <div className="h-4 w-4/5 rounded-lg bg-black/5 dark:bg-white/5 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
