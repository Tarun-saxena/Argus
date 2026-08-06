export function Problem() {
  const cards = [
    {
      title: '"Good first issue" is a lie',
      body:
        "Most repositories use the label differently. Many issues are already claimed, stale, or require much more project knowledge than the label suggests.",

      preview: (
        <div className="mt-6 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
          <div className="space-y-3">
            {[
              {
                repo: "facebook/react",
                status: "Already taken",
                color: "text-red-500",
              },
              {
                repo: "vercel/next.js",
                status: "Already taken",
                color: "text-red-500",
              },
              {
                repo: "prisma/prisma",
                status: "Available",
                color: "text-green-600",
              },
            ].map((item) => (
              <div
                key={item.repo}
                className="flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-green-100 px-2 py-1 font-medium text-green-700">
                    good first issue
                  </span>

                  <span className="text-zinc-500">{item.repo}</span>
                </div>

                <span className={`font-medium ${item.color}`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      ),
    },

    {
      title: "Searching is a full-time job",
      body:
        "Finding one issue means opening dozens of repositories and reading countless issues before discovering something you can actually solve.",

      preview: (
        <div className="mt-6 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
          <div className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-400">
            label:good-first-issue language:typescript
          </div>

          <div className="mt-4 space-y-2">
            {[
              "3,847 matching issues",
              "257 pages",
              "Sorted by relevance",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 text-xs text-zinc-500"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-zinc-300" />
                {item}
              </div>
            ))}
          </div>

          <div className="mt-1 rounded-xl border border-dashed border-zinc-300 bg-white py-3 text-center text-xs text-zinc-400">
            Which one actually fits you?
          </div>
        </div>
      ),
    },

    {
      title: "No signal, no ranking",
      body:
        "GitHub shows every issue equally. There's no indication of which issues match your experience, technologies or contribution history.",

      preview: (
        <div className="mt-6 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
          <div className="space-y-3">
            {[
              {
                title: "Refactor authentication",
                badge: "Advanced",
                color: "bg-red-100 text-red-700",
              },
              {
                title: "Fix CSS variable",
                badge: "Beginner",
                color: "bg-green-100 text-green-700",
              },
              {
                title: "Add WebSocket support",
                badge: "Advanced",
                color: "bg-red-100 text-red-700",
              },
            ].map((issue) => (
              <div
                key={issue.title}
                className="flex items-center justify-between gap-3 text-xs"
              >
                <span className="truncate text-zinc-900">
                  {issue.title}
                </span>

                <span
                  className={`rounded-md px-2 py-1 font-medium ${issue.color}`}
                >
                  {issue.badge}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-xl border border-dashed border-zinc-300 bg-white py-3 text-center text-xs text-zinc-400">
            No ranking. Just guess.
          </div>
        </div>
      ),
    },

    {
      title: "No one tells you where to start",
      body:
        "Even after picking an issue, you still have to figure out which files matter, what knowledge is required and how much work you're signing up for.",

      preview: (
        <div className="mt-6 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
          <div className="rounded-xl border border-zinc-200 bg-white p-3">
            <p className="text-xs font-semibold text-zinc-900">
              Issue #4821
            </p>

            <p className="mt-2 text-xs leading-5 text-zinc-500">
              Fix hydration mismatch in dashboard layout.
            </p>
          </div>

          <div className="mt-1 rounded-xl border border-dashed border-zinc-300 bg-white p-4 text-center">
            <p className="text-xs text-zinc-400">
              Which files should I edit?
            </p>

            <p className="mt-1 text-xs text-zinc-400">
              What skills are required?
            </p>

            <p className="mt-1 text-xs text-zinc-400">
              How long will it take?
            </p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section className="border-t border-zinc-200 bg-white py-20">
      <div className="mx-auto max-w-7xl px-6">

        <div className="mb-10 grid gap-12 border-b border-zinc-200 pb-16 lg:grid-cols-2">

          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-zinc-400">
              The problem
            </p>

            <h2 className="max-w-xl text-4xl font-bold leading-tight tracking-[-0.04em] text-zinc-900 md:text-5xl">
              Open source shouldn't feel
              <span className="block text-zinc-400">
                impossible to get into.
              </span>
            </h2>
          </div>

          <div className="flex items-center lg:border-l lg:border-zinc-200 lg:pl-10">
            <p className="max-w-md text-lg leading-8 text-zinc-500">
              Developers waste hours searching GitHub, opening random repositories,
              and reading stale issues before finding something they can actually
              contribute to.
            </p>
          </div>

        </div>
        <div className="grid gap-6 lg:grid-cols-5">

          {/* Left Column */}
          <div className="flex flex-col gap-6 lg:col-span-3">
            {[cards[0], cards[2]].filter((card): card is NonNullable<typeof card> => card !== undefined).map((card) => (
              <article
                key={card.title}
                className="flex h-[380px] flex-col rounded-[32px] border border-zinc-200 bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:border-zinc-300 hover:shadow-lg"
              >
                <div>
                  {/* Left */}
                  <h3 className="text-[30px] font-bold tracking-[-0.03em] text-zinc-900"> {card.title}
                  </h3>

                  <p className="mt-3 text-[14px] leading-6 text-zinc-500"> {card.body}
                  </p>
                </div>

                <div className="mt-auto">
                  {card.preview}
                </div>
              </article>
            ))}
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-4 lg:col-span-2">
            {[cards[1], cards[3]].filter((card): card is NonNullable<typeof card> => card !== undefined).map((card) => (
              <article
                key={card.title}
                className="flex h-[380px] flex-col rounded-[32px] border border-zinc-200 bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:border-zinc-300 hover:shadow-lg"
              >
                <div>
                  {/* Right */}
                  <h3 className="text-2xl font-bold tracking-[-0.03em] text-zinc-900"> {card.title}
                  </h3>

                  <p className="mt-3 text-[14px] leading-6 text-zinc-500"> {card.body}
                  </p>
                </div>

                <div className="mt-auto">
                  {card.preview}
                </div>
              </article>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}