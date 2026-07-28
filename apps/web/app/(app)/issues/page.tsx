import { RecommendationsView } from "@/components/issues/recommendations-view";

export default function IssuesPage() {
  return (
    <section className="space-y-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Issues</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">Explore recommendations</h1>
        <p className="mt-2 text-sm text-muted-foreground">Filter the issues Argus has matched to your profile.</p>
      </div>
      <RecommendationsView />
    </section>
  );
}
