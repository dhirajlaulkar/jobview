
import { HeroSection } from "@/components/home/hero-section"
import { PopularCategories } from "@/components/home/popular-categories"

export default function HomePage() {
  return (
    <div className="flex flex-col">
      
      <HeroSection />

     
      <PopularCategories />
    </div>
  )
}
