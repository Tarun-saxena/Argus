"use client";

import Link from "next/link";
import { githubAuthUrl } from "@/lib/config";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background text-foreground pt-24 pb-32 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-5 pb-16">
          {/* Brand Column */}
          <div className="lg:col-span-3 space-y-4">
            <Link href="/" className="flex items-center gap-2 select-none">
              <span className="text-lg font-bold tracking-tight text-foreground">Argus</span>
            </Link>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground leading-relaxed max-w-sm font-medium">
                Watching GitHub so you don't have to.
              </p>
              <p className="text-xs text-muted-foreground/60 font-mono">
                Handcrafted for open source contributors.
              </p>
            </div>
          </div>

          {/* Product Column */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Product</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="#problem" className="hover:text-foreground transition-colors">Discovery</Link></li>
              <li><Link href="#how-it-works" className="hover:text-foreground transition-colors">AI Analysis</Link></li>
              <li><Link href="#features" className="hover:text-foreground transition-colors">Capabilities</Link></li>
              <li><Link href={githubAuthUrl} className="hover:text-foreground transition-colors font-medium text-foreground">Continue with GitHub</Link></li>
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Resources</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><a href="https://github.com/Tarun-saxena/Argus" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">GitHub Repository</a></li>
              <li><a href="https://x.com/Tarun__Saxena" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Contact (X)</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 text-xs text-muted-foreground font-mono">
          <p>© {new Date().getFullYear()} Argus. All rights reserved.</p>
        </div>
      </div>

      {/* Giant Cropped Branding Text at bottom right */}
      <div
        className="absolute bottom-[-3.5rem] sm:bottom-[-5rem] md:bottom-[-6.5rem] lg:bottom-[-8rem] right-4 sm:right-8 md:right-12 text-right select-none pointer-events-none tracking-tighter font-extrabold leading-none text-foreground/[0.07] dark:text-foreground/[0.03]"
        style={{ fontSize: "clamp(12rem, 26vw, 32rem)" }}
      >
        Argus
      </div>
    </footer>
  );
}