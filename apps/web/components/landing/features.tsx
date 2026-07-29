"use client";

import { motion } from "framer-motion";

const features = [
  {
    title: "AI Difficulty",
    tag: "AI",
    body: "Know how hard an issue is before opening GitHub.",
    icon: "✦",
    gradient: "from-indigo-500 to-violet-500",
  },
  {
    title: "Match Score",
    tag: "Match",
    body: "Every issue gets a personalized compatibility score.",
    icon: "◎",
    gradient: "from-emerald-500 to-lime-500",
  },
  {
    title: "Live Polling",
    tag: "Live",
    body: "Fresh issues appear within minutes of being opened.",
    icon: "⟳",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    title: "Smart Filters",
    tag: "Filter",
    body: "Search by language, framework and difficulty.",
    icon: "⊟",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    title: "AI Summary",
    tag: "Explain",
    body: "Understand every issue in seconds.",
    icon: "≡",
    gradient: "from-cyan-500 to-sky-500",
  },
  {
    title: "Track Repos",
    tag: "GitHub",
    body: "Monitor any public repository automatically.",
    icon: "⊕",
    gradient: "from-violet-500 to-fuchsia-500",
  },
];

export function Features() {
  return (
    <section
      id="features"
      className="relative overflow-hidden border-t border-[#e4e4e7] bg-white py-20"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#f7f7f7,transparent_60%)]" />

      <div className="relative mx-auto max-w-6xl px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: .5 }}
          className="mb-14"
        >
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-[#a1a1aa]">
            FEATURES
          </p>

          <h2 className="max-w-2xl text-4xl font-bold leading-tight text-[#09090b]">
            Everything you need to
            <span className="text-[#a1a1aa]">
              {" "}
              contribute faster.
            </span>
          </h2>

          <p className="mt-5 max-w-lg text-[#71717a] leading-7">
            AI-powered issue discovery designed for open source developers.
          </p>
        </motion.div>

        <div className="grid gap-5 md:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: .4,
                delay: index * .08,
              }}
              whileHover={{
                y: -6,
              }}
              className="group rounded-[26px] border border-[#e4e4e7] bg-white p-6 transition-all duration-300 hover:border-[#d4d4d8] hover:shadow-md"
            >
              <div className="mb-5 flex items-center justify-between">

                <span className="rounded-full border border-[#e4e4e7] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-[#71717a]">
                  {feature.tag}
                </span>

                <motion.div
                  whileHover={{
                    rotate: 10,
                    scale: 1.08,
                  }}
                  className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${feature.gradient} text-lg font-bold text-white`}
                >
                  {feature.icon}
                </motion.div>
              </div>

              <h3 className="text-xl font-semibold text-[#09090b]">
                {feature.title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-[#71717a]">
                {feature.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}