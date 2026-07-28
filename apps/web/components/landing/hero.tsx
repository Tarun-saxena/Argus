"use client"

import * as React from "react"
import { motion, useReducedMotion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { githubAuthUrl } from "@/lib/config"

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
    </svg>
  )
}

export function Hero() {
  const shouldReduceMotion = useReducedMotion()

  const handleGetStarted = () => {
    window.location.href = githubAuthUrl
  }

  const handleExplore = () => {
    const el = document.getElementById("preview")
    el?.scrollIntoView({ behavior: "smooth" })
  }

  // Animation variants
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.08,
      },
    },
  }

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 12,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.25,
        ease: [0.16, 1, 0.3, 1] as const, // ease-out
      },
    },
  }

  return (
    <section className="relative overflow-hidden pt-20 pb-16 md:pt-28 md:pb-20">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,oklch(0.65_0.16_250_/_6%),transparent_50%)]" />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center"
        >
          {/* Announcement Badge */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-1.5 rounded-full border border-accent/20 bg-accent-dim px-3 py-1 text-2xs font-medium text-accent-bright"
          >
            <span>✨ Argus Public Preview</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={itemVariants}
            className="mt-6 max-w-4xl text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl"
          >
            Find your next
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-bright to-accent-base">
              open-source contribution
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="mt-6 max-w-2xl text-base text-muted-foreground md:text-md leading-relaxed"
          >
            Argus discovers, analyzes, and recommends the best open-source issues on GitHub matching your developer profile and skill set. Powered by AI.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={itemVariants}
            className="mt-10 flex flex-col sm:flex-row gap-3 items-center justify-center w-full max-w-sm sm:max-w-none"
          >
            <Button
              variant="default"
              size="lg"
              onClick={handleGetStarted}
              className="w-full sm:w-auto h-10 gap-2 font-medium bg-primary text-primary-foreground hover:bg-primary/95 transition-all hover:shadow-[0_0_20px_oklch(0.75_0.15_250_/_15%)]"
            >
              <GitHubIcon className="size-4" />
              <span>Get Started with GitHub</span>
              <ArrowRight className="size-3.5 group-hover/button:translate-x-0.5 transition-transform" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={handleExplore}
              className="w-full sm:w-auto h-10 border-border hover:bg-muted/40 transition-colors"
            >
              Explore Live Issues
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
