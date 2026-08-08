"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Loader2Icon } from "lucide-react";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const [shouldRender, setShouldRender] = React.useState(false);

  React.useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/");
      return;
    }

    const hasOnboarded = user.skills.length > 0 || user.preferredLanguages.length > 0;

    if (!hasOnboarded && pathname !== "/onboarding") {
      router.replace("/onboarding");
    } else if (hasOnboarded && pathname === "/onboarding") {
      router.replace("/dashboard");
    } else {
      setShouldRender(true);
    }
  }, [user, loading, pathname, router]);

  if (loading || !shouldRender) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-primary/10 blur-[90px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[350px] h-[350px] rounded-full bg-accent/5 blur-[90px] pointer-events-none" />

        <div className="z-10 flex flex-col items-center gap-3">
          <div className="relative flex items-center justify-center">
            <Loader2Icon className="size-8 animate-spin text-primary relative z-10" />
            <div className="absolute size-10 rounded-full border-2 border-primary/20 animate-ping duration-1000" />
          </div>
          <p className="text-xs font-mono tracking-wider text-muted-foreground uppercase animate-pulse">
            Verifying Session
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
