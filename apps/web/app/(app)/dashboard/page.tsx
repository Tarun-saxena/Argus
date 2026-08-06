import { RecommendationsView } from "@/components/issues/recommendations-view";
import { PageHeader } from "@/components/shared/page-header";

export default function DashboardPage() {
  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow="Feed"
        title="Your recommendations"
        description="Issues ranked and matched to your profile across all tracked repositories."
      />
      <RecommendationsView />
    </section>
  );
}
