import CTASection from '@/components/CTASectionb'
import FeaturesSection from '@/components/FeaturesSection'
import Footer from '@/components/Footer'
import HeroSection from '@/components/HeroSection'
import Navbar from '@/components/Navbar'
import PlaygroundSection from '@/components/PlaygroundSection'

const Page = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center mx-auto">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <PlaygroundSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}

export default Page