"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { githubAuthUrl } from "@/lib/config";
import { motion } from "framer-motion";

const navItems = [
  {
    label: "How it Works",
    href: "#how-it-works",
  },
  {
    label: "Features",
    href: "#features",
  },
  {
    label: "GitHub",
    href: "https://github.com/Tarun-saxena/Argus",
    external: true,
  },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.2, rootMargin: "-20% 0px -60% 0px" }
    );

    const sections = ["how-it-works", "features"];
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      sections.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.unobserve(el);
      });
    };
  }, []);

  return (
    <motion.div
      initial={{ y: -12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 120, damping: 18 }}
      className="fixed top-5 left-1/2 -translate-x-1/2 w-full max-w-[1200px] px-6 z-50"
    >
      <header
        className={`w-full border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.12)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] transition-all duration-500 ease-out backdrop-blur-[28px] ${open ? "rounded-[28px]" : "rounded-full"
          } ${scrolled
            ? "bg-[#0f0f14]/50 border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.18)]"
            : "bg-[#0f0f14]/35"
          }`}
      >
        <div className="flex h-14 items-center justify-between px-8">
          {/* Logo */}
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2 hover:opacity-85 transition-opacity duration-200"
          >
            <span className="text-sm font-semibold tracking-tight text-white">
              Argus
            </span>
          </Link>

          {/* Desktop Navigation Link Pills */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = activeSection === item.href.slice(1);
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noopener noreferrer" : undefined}
                  className={`text-xs font-semibold px-4 py-1.5 rounded-full transition-all duration-300 ${isActive
                    ? "bg-white/[0.08] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] text-white"
                    : "text-white/75 hover:bg-white/5 hover:text-white"
                    }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Theme Toggle + GitHub CTA */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-zinc-300 transition-all duration-250 hover:bg-white/10 hover:text-white"
              aria-label="Toggle theme"
            >
              {mounted ? (
                theme === "dark" ? <Sun size={14} /> : <Moon size={14} />
              ) : (
                <Sun size={14} className="opacity-50" />
              )}
            </button>
            <Link
              href={githubAuthUrl}
              className="group relative inline-flex items-center justify-center p-[2px] rounded-full overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(139,92,246,0.35)]"
            >
              {/* Animated 2px gradient outline border (Purple & Nearly Black) */}
              <span className="absolute inset-0 bg-gradient-to-r from-[#8B5CF6] via-[#1A1A1A] to-[#8B5CF6] animate-gradient-shift z-0" />

              {/* Button Interior (#0F0F12) */}
              <span className="relative flex items-center gap-3 pl-1.5 pr-5 py-1 rounded-full bg-[#0F0F12] transition-colors duration-300 group-hover:bg-[#0F0F12]/95 z-10">
                {/* White circular badge for solid black GitHub icon */}
                <span className="flex w-6 h-6 items-center justify-center rounded-full bg-white shrink-0 shadow-sm">
                  <svg
                    aria-hidden="true"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="#0F0F12"
                  >
                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                </span>
                <span className="text-xs font-semibold text-white tracking-wide">Continue with GitHub</span>
              </span>
            </Link>

            <button
              onClick={() => setOpen(!open)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-zinc-300 transition hover:bg-white/5 hover:text-white md:hidden"
            >
              {open ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {open && (
          <div className="border-t border-white/5 bg-[#0f0f14]/95 backdrop-blur-2xl rounded-b-[28px] overflow-hidden md:hidden">
            <nav className="flex flex-col px-6 py-4 gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noopener noreferrer" : undefined}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-4 py-3 text-sm text-zinc-300 transition-colors hover:bg-white/5 hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>
    </motion.div>
  );
}