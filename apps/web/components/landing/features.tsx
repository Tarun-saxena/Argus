"use client"

import * as React from "react"
import { motion, useReducedMotion } from "framer-motion"
import {
  SparklesIcon,
  GaugeIcon,
  CheckCircle2Icon,
  GitForkIcon,
  TrendingUpIcon,
  BookmarkIcon,
} from "lucide-react"

export function Features() {
  const shouldReduceMotion = useReducedMotion()

  const features = [
    {
      icon: SparklesIcon,
      title: "AI Summarization",
      description: "Get a concise, objective summary of the issue body without reading hundreds of comment logs.",
      gridClass: "md:col-span-2",
    },
    {
      icon: GaugeIcon,
      title: "Complexity Estimation",
      description: "AI analyzes the issue requirements and assigns Beginner, Intermediate, or Advanced ratings.",
      gridClass: "md:col-span-1",
    },
    {
      icon: CheckCircle2Icon,
      title: "Dynamic Skill Matching",
      description: "Direct mapping of technologies needed (e.g. React, Rust, Go) vs your specified profile skills.",
      gridClass: "md:col-span-1",
    },
    {
      icon: GitForkIcon,
      title: "Repository Discovery",
      description: "Add any repository to start polling and analyzing issues on a recurring 5-minute interval.",
      gridClass: "md:col-span-1",
    },
    {
      icon: TrendingUpIcon,
      title: "Personalized Match Scores",
      description: "Scores from 0 to 100% computed to rank issues based on your language preferences and history.",
      gridClass: "md:col-span-1",
    },
    {
      icon: BookmarkIcon,
      title: "Smart Bookmarks",
      description: "Save issues directly from your feed to reference later, keeping your current active tasks organized.",
      gridClass: "md:col-span-1",
    },
  ]

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.05,
      },
    },
  }

  const cardVariants = {
    hidden: {
      opacity: 0,
      scale: shouldReduceMotion ? 1 : 0.98,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.25,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  }

  return (
    <section id="features" className="py-16 md:py-24 border-t border-border/40 bg-muted/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl text-left">
          <h2 className="text-2xs font-semibold uppercase tracking-wider text-accent-bright">
            Features
          </h2>
          <p className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Everything you need to find code to write.
          </p>
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-2xl">
            Argus parses issues to deliver the essential data points you need to skip discovery friction and focus on coding.
          </p>
        </div>

        {/* Bento Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-5"
        >
          {features.map((feat, idx) => {
            const Icon = feat.icon
            return (
              <motion.div
                key={idx}
                variants={cardVariants}
                className={`${feat.gridClass} flex flex-col p-6 rounded-lg bg-card border border-border hover:border-border-strong hover:shadow-md transition-all duration-200`}
              >
                <div className="flex size-9 items-center justify-center rounded-md bg-accent-dim border border-accent/15 text-accent-bright">
                  <Icon className="size-4.5" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-foreground">
                  {feat.title}
                </h3>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  {feat.description}
                </p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
