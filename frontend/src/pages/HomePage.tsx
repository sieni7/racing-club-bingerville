import { HeroSection } from '../components/landing/HeroSection';
import { SponsorsSection } from '../components/landing/SponsorsSection';
import { ClubKPIs } from '../components/landing/ClubKPIs';
import { NextMatchCard } from '../components/landing/NextMatchCard';
import { RecentResults } from '../components/landing/RecentResults';
import { TopScorersSection } from '../components/landing/TopScorersSection';
import { ClubSection } from '../components/landing/ClubSection';
import { NewsPreview } from '../components/landing/NewsPreview';
import { PhotoGallery } from '../components/landing/PhotoGallery';
import { Testimonials } from '../components/landing/Testimonials';
import { JoinClubCTA } from '../components/landing/JoinClubCTA';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background dark:bg-gray-900 overflow-x-hidden">
      {/* 1. Hero */}
      <HeroSection />
      
      {/* 2. Sponsors */}
      <SponsorsSection />
      
      {/* 3. Club KPIs */}
      <ClubKPIs />
      
      {/* 4. Matchs & Résultats */}
      <NextMatchCard />
      <RecentResults />
      
      {/* 5. Élite (Meilleurs Buteurs) */}
      <TopScorersSection />
      
      {/* 6. Le Club (Histoire, Palmarès, Valeurs) */}
      <ClubSection />
      
      {/* 7. Actualités */}
      <NewsPreview />
      
      {/* 8. Galerie */}
      <PhotoGallery />
      
      {/* 9. Témoignages */}
      <Testimonials />
      
      {/* 10. CTA */}
      <JoinClubCTA />
    </div>
  );
}
