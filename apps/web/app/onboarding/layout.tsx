import { AuthGuard } from "@/components/layout/auth-guard";

export default function OnboardingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-background text-foreground">{children}</div>
    </AuthGuard>
  );
}
