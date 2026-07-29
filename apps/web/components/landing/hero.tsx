"use client";

import { githubAuthUrl } from "@/lib/config";
import { useEffect, useState } from "react";
import Link from "next/link";

const CYCLING_WORDS = [
  "your level",
  "your skills",
  "you",
];

function CornerArc({
  className,
  transform,
}: {
  className: string;
  transform?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      width="92"
      height="92"
      viewBox="0 0 110 110"
      fill="none"
      style={transform ? { transform } : undefined}
    >
      <path
        d="M109.5 0.5C95.1859 0.5 81.012 3.31937 67.7875 8.79713C54.563 14.2749 42.5469 22.3038 32.4254 32.4254C22.3038 42.5469 14.2749 54.563 8.79713 67.7875C3.31936 81.012 0.499998 95.1859 0.5 109.5"
        stroke="#e4e4e7"
      />
    </svg>
  );
}

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
    <section className="bg-[#fafafa] pt-6 pb-10">
      <div className="mx-auto max-w-[1680px] px-6 lg:px-10">
        <div className="relative overflow-hidden rounded-[56px] border border-zinc-200 bg-white min-h-[520px]">

          {/* Corner Decorations */}
          <CornerArc className="pointer-events-none absolute left-0 top-0 hidden md:block" />
          <CornerArc
            className="pointer-events-none absolute right-0 top-0 hidden md:block"
            transform="scaleX(-1)"
          />
          <CornerArc
            className="pointer-events-none absolute bottom-0 left-0 hidden md:block"
            transform="scaleY(-1)"
          />
          <CornerArc
            className="pointer-events-none absolute bottom-0 right-0 hidden md:block"
            transform="scale(-1,-1)"
          />

          <div className="relative z-10 flex flex-col items-center px-6 pt-16 text-center">

            {/* Badge */}
            <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-[#64539c] px-5 py-2 text-sm font-medium text-white">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              AI-powered issue matching
            </div>

            {/* Heading */}
            <h1 className="max-w-5xl text-5xl font-bold tracking-[-0.05em] leading-[0.92] text-zinc-900 md:text-7xl lg:text-[88px]">
              Find GitHub issues
              <br />

              <span className="inline-flex items-center justify-center">
                matched to{" "}
                <span
                  className="ml-3 text-zinc-500 transition-all duration-200"
                  style={{
                    opacity: visible ? 1 : 0,
                    transform: visible
                      ? "translateY(0px)"
                      : "translateY(-8px)",
                  }}
                >
                  {CYCLING_WORDS[index]}
                </span>
              </span>
            </h1>

            {/* Description */}
            <p className="mt-7 max-w-3xl text-[20px] leading-8 text-zinc-500">
              Argus analyzes open-source repositories and recommends issues
              based on your experience, preferred languages, and the projects
              you want to contribute to.
            </p>

            {/* Buttons */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">

              <Link
                href={githubAuthUrl}
                className="group inline-flex h-10 items-center gap-3 rounded-xl bg-black px-7 text-base font-semibold text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-zinc-900"
              >
                <svg
                  width="18"
                  height="18"
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
                className="inline-flex h-10 items-center rounded-xl border border-zinc-300 bg-white px-8 text-base font-medium text-zinc-900 transition hover:bg-zinc-50"
              >
                See how it works
              </Link>
            </div>


          </div>
        </div>
      </div>
    </section>
  );
}