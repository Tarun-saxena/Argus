export function ProductPreview() {
  const mockIssues = [
    {
      repo: "vercel/next.js",
      lang: "TypeScript",
      stars: "124k",
      title: "Add `useSearchParams` fallback for static rendering without Suspense",
      difficulty: "INTERMEDIATE",
      diffColor: "bg-yellow-100 text-yellow-800",
      score: 91,
      summary: "Improve the error message shown when useSearchParams is used outside a Suspense boundary in static rendering mode.",
      skills: ["TypeScript", "React", "Next.js"],
      time: "3–5 hours",
    },
    {
      repo: "prisma/prisma",
      lang: "TypeScript",
      stars: "39k",
      title: "Support `findMany` cursor pagination with composite unique fields",
      difficulty: "ADVANCED",
      diffColor: "bg-red-100 text-red-800",
      score: 78,
      summary: "Extend the cursor-based pagination API to support composite unique fields as cursor values, not just single-field primaries.",
      skills: ["TypeScript", "PostgreSQL", "Prisma"],
      time: "6–10 hours",
    },
    {
      repo: "shadcn-ui/ui",
      lang: "TypeScript",
      stars: "78k",
      title: "Add keyboard shortcut support to Command component",
      difficulty: "BEGINNER",
      diffColor: "bg-green-100 text-green-800",
      score: 85,
      summary: "Add a keyboard shortcut display slot to the Command menu items, similar to how macOS app menus show shortcuts.",
      skills: ["React", "TypeScript", "CSS"],
      time: "1–2 hours",
    },
  ];

  return (
    <section className="py-24 bg-[#fafafa] border-t border-[#e4e4e7]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#a1a1aa] mb-4">
            Product preview
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-[#09090b] mb-4">
            Your personalised feed, live.
          </h2>
          <p className="text-[#71717a] max-w-md mx-auto">
            This is what Argus surfaces for a TypeScript developer with React and Node.js skills.
          </p>
        </div>

        {/* Mock browser shell */}
        <div className="rounded-2xl border border-[#e4e4e7] bg-white shadow-xl overflow-hidden">
          {/* Browser chrome */}
          <div className="border-b border-[#e4e4e7] bg-[#f4f4f5] px-4 py-3 flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#ef4444]" />
              <div className="w-3 h-3 rounded-full bg-[#f59e0b]" />
              <div className="w-3 h-3 rounded-full bg-[#22c55e]" />
            </div>
            <div className="flex-1 bg-white border border-[#e4e4e7] rounded-md px-3 py-1 text-xs text-[#71717a] max-w-xs mx-auto text-center">
              argus/dashboard
            </div>
          </div>

          {/* Dashboard content */}
          <div className="p-6">
            {/* Dashboard header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-semibold text-[#09090b]">Your feed</h3>
                <p className="text-xs text-[#71717a]">3 issues matched your profile</p>
              </div>
              {/* Difficulty filter pills */}
              <div className="flex gap-2">
                {["All", "Beginner", "Intermediate", "Advanced"].map((d, i) => (
                  <span
                    key={d}
                    className={`text-xs px-3 py-1 rounded-full border ${i === 0
                      ? "bg-[#64539c] text-white border-[#64539c]"
                      : "border-[#e4e4e7] text-[#71717a] bg-white"
                      }`}
                  >
                    {d}
                  </span>
                ))}
              </div>
            </div>

            {/* Issue cards */}
            <div className="space-y-3">
              {mockIssues.map((issue) => (
                <div
                  key={issue.title}
                  className="border border-[#e4e4e7] rounded-xl p-4 bg-white hover:border-[#d4d4d8] transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-[#a1a1aa] mb-1">
                        {issue.repo}
                        <span className="ml-2 text-[#09090b] font-medium">{issue.lang}</span>
                        <span className="ml-2">⭐ {issue.stars}</span>
                      </p>
                      <p className="font-medium text-sm text-[#09090b] leading-snug mb-2">
                        {issue.title}
                      </p>
                      <p className="text-xs text-[#71717a] leading-relaxed mb-3">
                        {issue.summary}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${issue.diffColor}`}>
                          {issue.difficulty.charAt(0) + issue.difficulty.slice(1).toLowerCase()}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full border border-[#e4e4e7] text-[#71717a]">
                          ⏱ {issue.time}
                        </span>
                        {issue.skills.map((s) => (
                          <span key={s} className="text-xs px-2 py-0.5 rounded bg-[#f4f4f5] text-[#71717a]">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-2xl font-bold text-[#09090b]">{issue.score}%</p>
                      <p className="text-xs text-[#a1a1aa]">match</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}