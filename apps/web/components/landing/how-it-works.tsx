"use client"

import * as React from "react"
import { motion, useReducedMotion } from "framer-motion"
import { SearchIcon, BrainCircuitIcon, CodeIcon } from "lucide-react"

export function HowItWorks() {
  const shouldReduceMotion = useReducedMotion()

  const steps = [
    {
      step: "01",
      icon: SearchIcon,
      title: "Discover Repositories",
      description:
        "Argus continuously polls tracked open-source repositories on GitHub, indexing open issues instantly. Add any public repo to starting indexing issues automatically.",
    },
    {
      step: "02",
      icon: BrainCircuitIcon,
      title: "Understand instantly via AI",
      description:
        "Our custom LLM analyzes each issue body. It generates a clear summary, identifies required skills, estimates setup time, and maps out the exact relevant source files.",
    },
    {
      step: "03",
      icon: CodeIcon,
      title: "Match & Contribute",
      description:
        "Argus computes a personalized match score based on your developer profile. Find issues that fit your language experience, difficulty comfort, and interests.",
    },
  ]

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.1,
      },
    },
  }

  const stepVariants = {
    hidden: {
      opacity: 0,
      x: shouldReduceMotion ? 0 : -10,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  }

  return (
    <section id="how-it-works" className="py-16 md:py-24 border-t border-border/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl text-left">
          <h2 className="text-2xs font-semibold uppercase tracking-wider text-accent-bright">
            Workflow
          </h2>
          <p className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            From issue discovery to pull request in minutes.
          </p>
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-2xl">
            Argus abstracts the tedious parts of contribution exploration, placing actionable information directly in front of you.
          </p>
        </div>

        {/* Steps Column/Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3 relative"
        >
          {steps.map((step, idx) => {
            const Icon = step.icon
            return (
              <motion.div
                key={idx}
                variants={stepVariants}
                className="relative flex flex-col p-6 rounded-lg bg-card/10 border border-border/40"
              >
                <div className="flex items-center justify-between">
                  <div className="flex size-9 items-center justify-center rounded-md bg-muted/40 text-muted-foreground">
                    <Icon className="size-4.5" />
                  </div>
                  <span className="font-mono text-xs font-semibold text-muted-foreground/40">
                    {step.step}
                  </span>
                </div>
                <h3 className="mt-6 text-base font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2.5 text-xs text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
