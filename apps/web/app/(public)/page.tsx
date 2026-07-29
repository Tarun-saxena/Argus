import { Header } from "@/components/landing/header"
import { Hero } from "@/components/landing/hero"
import { Problem } from "@/components/landing/problem"
import { HowItWorks } from "@/components/landing/how-it-works"
import { Features } from "@/components/landing/features"
import { ProductPreview } from "@/components/landing/product-preview"

import { Footer } from "@/components/landing/footer"

export default async function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa] text-foreground font-sans antialiased ">
      {/* Sticky Public Header */}
      <Header />

      {/* Main Contents */}
      <main className="flex-1">
        <Hero />
        <Problem />
        <HowItWorks />
        <Features />
        <ProductPreview />

      </main>

      {/* Public Footer */}
      <Footer />
    </div>
  )
}
