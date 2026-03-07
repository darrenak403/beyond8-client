import { Header } from "@/components/layout/Header";
import { SubscriptionHero } from "./components/SubscriptionHero";
import { SubscriptionPricingCard } from "./components/SubscriptionPricingCards";
import { BenefitsSection } from "./components/BenefitsSection";
import { TestimonialsSection } from "./components/TestimonialsSection";
import { ComparisonTable } from "./components/ComparisonTable";
import { FAQSection } from "./components/FAQSection";
import { SubscriptionBackground } from "./components/SubscriptionBackground";
import { Footer } from "@/components/layout/Footer"; 

export default function SubscriptionPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 selection:bg-purple-500/30">
      <Header />
      
      <main className="relative overflow-hidden">
        <SubscriptionBackground />

        <SubscriptionHero />
        
        <div className="relative z-10">
            <div className="container mx-auto max-w-7xl px-4 pb-24">
                <SubscriptionPricingCard />
            </div>
            <ComparisonTable />
            
            <BenefitsSection />
            
            <TestimonialsSection />

            <FAQSection />
        </div>
      </main>

      <Footer />
    </div>
  );
}