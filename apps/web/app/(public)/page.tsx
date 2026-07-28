import { Header } from "@/components/landing/header"
import { Hero } from "@/components/landing/hero"
import { Problem } from "@/components/landing/problem"
import { HowItWorks } from "@/components/landing/how-it-works"
import { Features } from "@/components/landing/features"
import { ProductPreview } from "@/components/landing/product-preview"
import { CTA } from "@/components/landing/cta"
import { Footer } from "@/components/landing/footer"

export default async function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#09090b] text-foreground font-sans antialiased overflow-x-hidden">
      {/* Sticky Public Header */}
      <Header />

      {/* Main Contents */}
      <main className="flex-1">
        <Hero />
        <Problem />
        <HowItWorks />
        <Features />
        <ProductPreview />
        <CTA />
      </main>

      {/* Public Footer */}
      <Footer />
    </div>
  )
}
