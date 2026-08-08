import { TopNav } from "@/components/layout/top-nav";
import { AuthGuard } from "@/components/layout/auth-guard";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-background text-foreground">
        <TopNav />
        <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}
