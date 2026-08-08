"use client";

import { githubAuthUrl } from "@/lib/config";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const CYCLING_WORDS = [
  "you",
  "your level",
  "your skills"
];

export function Hero() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    const interval = setInterval(() => {
      setVisible(false);

      timeout = setTimeout(() => {
        setIndex((prev) => (prev + 1) % CYCLING_WORDS.length);
        setVisible(true);
      }, 180);
    }, 2200);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <section className="relative w-full bg-white dark:bg-zinc-950 overflow-hidden min-h-[115vh] flex flex-col justify-center pt-32 pb-24">
      {/* Evervault style dithered gradient background with premium linear fade-out mask (expanded purple visibility) */}
      <div
        className="absolute inset-0 bg-no-repeat z-0 select-none pointer-events-none opacity-90"
        style={{
          backgroundImage: "url('/landing/hero-transition.png')",
          backgroundSize: "100% 100%",
          maskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 68%, rgba(0,0,0,0.6) 90%, rgba(0,0,0,0) 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 68%, rgba(0,0,0,0.6) 90%, rgba(0,0,0,0) 100%)"
        }}
      />

      {/* Dark overlay to push the purple glow down and keep top 50% solid black */}
      <div className="absolute top-0 left-0 right-0 h-[72%] bg-gradient-to-b from-black via-black via-black/85 to-transparent z-1 pointer-events-none" />

      {/* Atmospheric lighting depth - expanded sizes */}
      <div className="absolute top-[-10%] left-[5%] w-[1000px] h-[1000px] rounded-full bg-indigo-600/35 blur-[160px] pointer-events-none z-0" />
      <div className="absolute top-[8%] right-[1%] w-[900px] h-[900px] rounded-full bg-purple-600/30 blur-[160px] pointer-events-none z-0" />
      <div className="absolute bottom-[10%] left-[15%] w-[850px] h-[850px] rounded-full bg-blue-500/5 blur-[180px] pointer-events-none z-0" />

      {/* Floating glow blobs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-indigo-500/10 blur-[100px] animate-blob-float-1 z-0 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 rounded-full bg-purple-500/10 blur-[100px] animate-blob-float-2 z-0 pointer-events-none" />

      {/* Subtle dark radial overlay behind content to maximize readability */}
      <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-4xl h-[75%] bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.65)_0%,rgba(0,0,0,0)_70%)] blur-2xl pointer-events-none z-0" />

      {/* Bottom haze and blur overlay - blends hero background seamlessly into Problem section */}
      <div
        className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-white dark:from-zinc-950 via-white/80 dark:via-zinc-950/80 to-transparent backdrop-blur-[2px] z-10 pointer-events-none"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 flex flex-col items-center text-center -mt-16">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm font-medium text-zinc-300 backdrop-blur-md"
        >
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          AI-powered issue matching
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-5xl text-5xl font-bold tracking-[-0.05em] leading-[0.92] text-white md:text-7xl lg:text-[88px]"
        >
          Find GitHub issues
          <br />
          <span className="inline-flex items-center justify-center">
            matched to{" "}
            <span className="inline sm:hidden ml-2 text-white font-extrabold">
              you
            </span>
            <span
              className="hidden sm:inline-block ml-3 text-left text-white font-extrabold transition-all duration-200 min-w-[190px] md:min-w-[270px] lg:min-w-[340px]"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0px)" : "translateY(-8px)",
              }}
            >
              {CYCLING_WORDS[index]}
            </span>
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 max-w-3xl text-[20px] leading-8 text-white/80"
        >
          Argus analyzes open-source repositories and recommends issues
          based on your experience, preferred languages, and the projects
          you want to contribute to.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 flex flex-wrap items-center justify-center gap-4 animate-stagger"
        >
          <Link
            href={githubAuthUrl}
            className="group inline-flex h-12 items-center gap-3 rounded-full bg-white px-8 text-sm font-bold text-zinc-950 shadow-[0_10px_25px_rgba(255,255,255,0.12)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-zinc-100 hover:shadow-[0_15px_30px_rgba(255,255,255,0.22)]"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            Continue with GitHub
          </Link>

          <Link
            href="#how-it-works"
            className="inline-flex h-12 items-center justify-center rounded-full border border-white/10 bg-black/40 backdrop-blur-md px-8 text-sm font-semibold text-white transition-all duration-300 hover:bg-black/60 hover:border-white/20 hover:scale-[1.01] hover:shadow-[0_0_15px_rgba(255,255,255,0.08)]"
          >
            See how it works
          </Link>
        </motion.div>
      </div>
    </section>
  );
}