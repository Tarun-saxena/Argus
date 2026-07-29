import Link from "next/link";
import { EyeMascot } from "@/components/landing/eye-mascot";
import Image from "next/image";

import { githubAuthUrl } from "@/lib/config";

const footerLinks = [
  {
    heading: "Product",
    links: [
      { name: "Features", href: "#features" },
      { name: "How it works", href: "#how-it-works" },
      { name: "Get Started", href: githubAuthUrl },
    ],
  },
  {
    heading: "Resources",
    links: [
      { name: "GitHub", href: "https://github.com/Tarun-saxena/Argus" },
      { name: "Contact", href: "https://x.com/Tarun__Saxena" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-[#e4e4e7] bg-white">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <div className="mb-4 flex items-center gap-3">

              <Image
                src="/logo.png"
                alt="Argus Logo"
                width={32}
                height={32}
                className="rounded-sm object-contain"
                priority
              />

              <span className="text-lg font-semibold text-[#09090b]">
                Argus
              </span>
            </div>

            <p className="max-w-sm text-sm leading-7 text-[#71717a]">
              Discover open-source issues that match your skills with AI-powered
              recommendations.
            </p>
          </div>

          {footerLinks.map((section) => (
            <div key={section.heading}>
              <h3 className="mb-4 text-sm font-semibold text-[#09090b]">
                {section.heading}
              </h3>

              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-[#71717a] transition-colors hover:text-[#09090b]"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-12 border-t border-[#e4e4e7] pt-8">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">

            {/* Left */}
            <div className="flex items-center gap-5">

              <EyeMascot />

              <div>
                <p className="text-sm text-[#71717a]">
                  © 2026 Argus. Built for developers.
                </p>

                <p className="mt-1 text-sm text-[#09090b]"><b>
                  Watching GitHub so you don't have to.</b>
                </p>
              </div>

            </div>

            {/* Right */}
            <div className="flex items-center gap-6 text-sm text-[#71717a]">
              <Link href="#">Terms</Link>

              <Link href="#">Privacy</Link>

            </div>

          </div>
        </div>
      </div>

    </footer>
  );
}