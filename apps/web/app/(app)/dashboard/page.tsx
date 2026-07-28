import { RecommendationsView } from "@/components/issues/recommendations-view";

export default function DashboardPage() {
  return (
    <section className="space-y-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Dashboard</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">Your recommendations</h1>
        <p className="mt-2 text-sm text-muted-foreground">Issues ranked for your profile and tracked repositories.</p>
      </div>
      <RecommendationsView />
    </section>
  );
}
