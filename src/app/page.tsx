import IntroSection from '@/components/sections/IntroSection'
import FeaturesSection from '@/components/sections/FeaturesSection'
import FranchiseSection from "@/components/sections/FranchiseSection";
import FaqSection from "@/components/sections/FaqSection";
import SocialSection from "@/components/sections/SocialSection";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <main>
      <IntroSection />
      <FeaturesSection />
      <FranchiseSection />
      <FaqSection />
      <SocialSection />
      <Footer />
    </main>
  )
}
