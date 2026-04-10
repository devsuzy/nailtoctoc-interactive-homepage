import IntroSection from '@/components/sections/IntroSection'
import FeaturesSection from '@/components/sections/FeaturesSection'
import FranchiseSection from "@/components/sections/FranchiseSection";
import FaqSection from "@/components/sections/FaqSection";

export default function Home() {
  return (
    <main>
      <IntroSection />
      <FeaturesSection />
      <FranchiseSection />
      <FaqSection />
    </main>
  )
}
