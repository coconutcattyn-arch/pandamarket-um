import { PageShell } from "@/components/ui";

function SkeletonBlock({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-[1.4rem] bg-panda-line/60 ${className}`} />;
}

export function PageSkeleton({
  variant = "list"
}: {
  variant?: "list" | "detail" | "form";
}) {
  return (
    <PageShell>
      <div className="sticky top-0 z-20 -mx-4 mb-4 border-b border-panda-line/70 glass px-4 py-3 sm:-mx-6 sm:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SkeletonBlock className="h-9 w-9 rounded-full" />
            <div className="space-y-2">
              <SkeletonBlock className="h-3 w-28" />
              <SkeletonBlock className="h-2.5 w-20" />
            </div>
          </div>
          <SkeletonBlock className="h-9 w-20 rounded-full" />
        </div>
      </div>

      {variant === "detail" ? (
        <div className="overflow-hidden rounded-[2rem] border border-panda-line bg-white shadow-soft">
          <SkeletonBlock className="aspect-[4/3] w-full rounded-none" />
          <div className="space-y-5 p-5">
            <SkeletonBlock className="h-8 w-3/4" />
            <SkeletonBlock className="h-7 w-28" />
            <div className="grid grid-cols-2 gap-3">
              <SkeletonBlock className="h-20" />
              <SkeletonBlock className="h-20" />
              <SkeletonBlock className="h-20" />
              <SkeletonBlock className="h-20" />
            </div>
            <SkeletonBlock className="h-28" />
          </div>
        </div>
      ) : null}

      {variant === "form" ? (
        <div className="space-y-5">
          <SkeletonBlock className="h-36 w-full" />
          <div className="rounded-[2rem] border border-panda-line bg-white p-5 shadow-soft">
            <div className="space-y-4">
              <SkeletonBlock className="h-28" />
              <SkeletonBlock className="h-12" />
              <SkeletonBlock className="h-12" />
              <SkeletonBlock className="h-32" />
              <SkeletonBlock className="h-12" />
            </div>
          </div>
        </div>
      ) : null}

      {variant === "list" ? (
        <div className="space-y-6">
          <div className="rounded-[1.8rem] border border-panda-line bg-white p-4 shadow-soft">
            <SkeletonBlock className="h-12 w-full rounded-full" />
            <div className="mt-4 flex gap-2 overflow-hidden">
              <SkeletonBlock className="h-11 w-24 rounded-full" />
              <SkeletonBlock className="h-11 w-28 rounded-full" />
              <SkeletonBlock className="h-11 w-24 rounded-full" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[0, 1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="overflow-hidden rounded-[1.6rem] border border-panda-line bg-white shadow-soft">
                <SkeletonBlock className="aspect-[4/3] w-full rounded-none" />
                <div className="space-y-3 p-4">
                  <SkeletonBlock className="h-5 w-4/5" />
                  <SkeletonBlock className="h-4 w-1/2" />
                  <SkeletonBlock className="h-4 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </PageShell>
  );
}
