"use client"

import * as React from "react"
import { motion, useReducedMotion } from "framer-motion"
import { Inbox, FileQuestion, AlertTriangle } from "lucide-react"

export function Problem() {
  const shouldReduceMotion = useReducedMotion()

  const problems = [
    {
      icon: Inbox,
      title: "Extremely high noise ratio",
      description:
        "GitHub has millions of open issues. Sifting through stale issues, duplicates, and poorly specified request logs to find one you can actually resolve takes hours of tedious manual digging.",
    },
    {
      icon: FileQuestion,
      title: "Opaque setup & environment friction",
      description:
        "Standard issues rarely detail where to start, what files are relevant, or how long setup takes. You often fork and set up a repository only to find out you lack the specific context to proceed.",
    },
    {
      icon: AlertTriangle,
      title: "Broken and subjective labels",
      description:
        "Labels like 'good first issue' or 'help wanted' are entirely subjective and frequently out of date. An issue labeled 'easy' might require complex legacy database refactoring.",
    },
  ]

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.08,
      },
    },
  }

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 12,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.25,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  }

  return (
    <section id="problem" className="py-16 md:py-24 border-t border-border/40 bg-muted/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl text-left">
          <h2 className="text-2xs font-semibold uppercase tracking-wider text-accent-bright">
            The Contribution Friction
          </h2>
          <p className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Finding open-source issues is a broken experience.
          </p>
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-2xl">
            Contributing to open-source should be about writing great code, not spending days searching for a starting point. Argus resolves the primary friction points developers face.
          </p>
        </div>

        {/* Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {problems.map((prob, idx) => {
            const Icon = prob.icon
            return (
              <motion.div
                key={idx}
                variants={cardVariants}
                className="flex flex-col rounded-lg border border-border bg-card/45 p-6 hover:border-border-strong hover:bg-card hover:shadow-md transition-all duration-200"
              >
                <div className="flex size-9 items-center justify-center rounded-md bg-accent-dim border border-accent/15 text-accent-bright">
                  <Icon className="size-4.5" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-foreground">
                  {prob.title}
                </h3>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed flex-1">
                  {prob.description}
                </p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
