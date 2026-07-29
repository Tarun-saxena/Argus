"use client";

import { motion } from "framer-motion";

export function HowItWorks() {
  const steps = [
    {
      number: "01",
      label: "Connect",
      title: "Sign in with GitHub",
      body:
        "One click. We read your public profile, repositories and activity to understand what technologies you actually use.",
      icon: (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="text-[#09090b]"
        >
          <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
        </svg>
      ),
    },

    {
      number: "02",
      label: "Personalise",
      title: "Choose your stack",
      body:
        "Select your languages and frameworks. Argus combines them with your GitHub history to build your developer profile.",
      icon: (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M12 20h9M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4 12.5-12.5z" />
        </svg>
      ),
    },

    {
      number: "03",
      label: "Discover",
      title: "AI ranks every issue",
      body:
        "Every few minutes Argus scans thousands of repositories, analyzes new issues and scores them based on your experience.",
      icon: (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      ),
    },

    {
      number: "04",
      label: "Ship",
      title: "Open your first PR",
      body:
        "Every recommendation includes files to read, required skills, difficulty and an AI explanation so you can start immediately.",
      icon: (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      ),
    },
  ];

  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden border-t border-[#e4e4e7] bg-[#fafafa] py-28"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#ffffff,transparent_60%)]" />

      <div className="relative mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: .6 }}
          className="text-center"
        >
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-[#a1a1aa]">
            HOW IT WORKS
          </p>

          <h2 className="mx-auto max-w-2xl text-4xl font-bold leading-tight text-[#09090b] md:text-5xl">
            From GitHub login
            <span className="text-[#a1a1aa]">
              {" "}
              to your first merged pull request.
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-[#71717a]">
            Argus removes hours of searching by finding issues you can actually
            solve and explaining exactly why they're a good match.
          </p>
        </motion.div>

        <div className="relative mt-24">
          <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-[#d4d4d8] to-transparent md:block" />

          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: .6,
                delay: index * .15,
              }}
              className={`relative mb-20 flex items-center ${index % 2 === 0
                ? "md:flex-row"
                : "md:flex-row-reverse"
                }`}
            >
              <>
                {/* Content Card */}
                <div
                  className={`w-full md:w-[calc(50%-56px)] ${index % 2 === 0 ? "md:pr-16" : "md:pl-16"
                    }`}
                >
                  <motion.div
                    whileHover={{
                      y: -6,
                      borderColor: "#d4d4d8",
                    }}
                    transition={{ duration: 0.25 }}
                    className="group rounded-[32px] border border-[#e4e4e7] bg-white p-8 shadow-[0_1px_0_rgba(0,0,0,0.02)] transition-all"
                  >
                    <div className="mb-5 flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#e4e4e7] bg-[#fafafa] transition-transform duration-300 group-hover:scale-110">
                        {step.icon}
                      </div>

                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#a1a1aa]">
                          {step.label}
                        </p>

                        <h3 className="mt-1 text-2xl font-semibold text-[#09090b]">
                          {step.title}
                        </h3>
                      </div>
                    </div>

                    <p className="leading-8 text-[#71717a]">
                      {step.body}
                    </p>


                  </motion.div>
                </div>

                {/* Timeline Node */}
                <div className="absolute left-1/2 hidden -translate-x-1/2 md:block">
                  <motion.div
                    animate={{
                      scale: [1, 1.08, 1],
                    }}
                    transition={{
                      duration: 2.8,
                      repeat: Infinity,
                      delay: index * 0.3,
                    }}
                    className="relative"
                  >
                    <div className="absolute inset-0 rounded-full bg-[#09090b]/10 blur-xl" />

                    <div className="relative flex h-14 w-14 items-center justify-center rounded-full border border-[#e4e4e7] bg-white font-bold text-[#64539c] shadow-lg">
                      {step.number}
                    </div>
                  </motion.div>
                </div>
              </>
            </motion.div>
          ))}
        </div>


      </div>
    </section>
  );
}