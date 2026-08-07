"use client";

import { motion } from "framer-motion";

const SYSTEM_CAPABILITIES = [
  {
    num: "01",
    title: "Continuous GitHub Background Polling",
    desc: "Background workers query GitHub APIs every few minutes to pull newly opened, unassigned issues before they get buried.",
  },
  {
    num: "02",
    title: "Custom Repository Tracking",
    desc: "Add any public GitHub repository to your personal watchlist to monitor issue feeds across your favorite open source ecosystems.",
  },
  {
    num: "03",
    title: "Deterministic Match Score Ranking",
    desc: "Recommendations are ranked deterministically by match percentage, creation time, and issue ID tiebreakers so your feed stays stable.",
  },
  {
    num: "04",
    title: "Untriaged Feed vs Explore Catalog",
    desc: "Triage incoming issues directly into Bookmarked or Claimed states, while keeping an unassigned flat search catalog in Explore.",
  },
];

export function Features() {
  return (
    <section id="features" className="relative border-t border-border/60 bg-muted/20 py-28 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="grid gap-12 lg:grid-cols-12 lg:items-end pb-16 border-b border-border/40">
          <div className="lg:col-span-7">
            <span className="text-xs font-mono font-semibold uppercase tracking-widest text-primary">
              04 / REPOSITORY RADAR & CAPABILITIES
            </span>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl leading-[1.1]">
              Architected for speed, <br className="hidden sm:inline" />
              <span className="text-muted-foreground font-normal">clarity, and control.</span>
            </h2>
          </div>
          <div className="lg:col-span-5 lg:pl-8">
            <p className="text-base text-muted-foreground leading-relaxed">
              Argus provides a complete workflow for open source contributors—from initial repository tracking to one-click issue triage.
            </p>
          </div>
        </div>

        {/* Minimal Editorial Capabilities List */}
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {SYSTEM_CAPABILITIES.map((item, idx) => (
            <motion.div
              key={item.num}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="p-8 rounded-2xl border border-white/10 bg-zinc-950 flex flex-col justify-between relative overflow-hidden group shadow-lg min-h-[240px] hover:border-white/20 transition-all duration-500"
            >
              {/* Noisy Gradient Background Container */}
              <div className="absolute inset-0 z-0 overflow-hidden rounded-2xl pointer-events-none">
                <div
                  className="absolute -inset-[20%] bg-cover opacity-85 group-hover:scale-105 transition-transform duration-[6000ms] ease-out select-none pointer-events-none"
                  style={{
                    backgroundImage: idx % 2 === 0 ? "url('/landing/noise-purple.jpg')" : "url('/landing/noise-gray.jpg')",
                    backgroundPosition: 
                      idx === 0 ? "0% 0%" :
                      idx === 1 ? "100% 100%" :
                      idx === 2 ? "20% 80%" :
                      "80% 20%"
                  }}
                />
                {/* Contrast overlay */}
                <div className={`absolute inset-0 ${idx % 2 === 0 ? 'bg-gradient-to-b from-black/45 via-purple-950/10 to-black/60' : 'bg-gradient-to-b from-black/45 via-zinc-950/10 to-black/60'}`} />
              </div>

              {/* Text Content */}
              <div className="relative z-10 flex flex-col justify-between h-full">
                <span className={`text-xs font-mono font-bold tracking-widest ${idx % 2 === 0 ? 'text-purple-300' : 'text-zinc-400'}`}>{item.num}</span>
                <div className="mt-6">
                  <h3 className="text-lg font-bold text-white tracking-tight leading-snug">{item.title}</h3>
                  <p className={`mt-2 text-xs leading-relaxed font-medium ${idx % 2 === 0 ? 'text-purple-100/75' : 'text-zinc-300/75'}`}>{item.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}