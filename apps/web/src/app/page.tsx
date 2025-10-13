import { Hero } from '@/components/home/hero';
import { TrendingSection } from '@/components/home/trending-section';
import { GenreRows } from '@/components/home/genre-rows';
import { PersonalizedSection } from '@/components/home/personalized-section';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      <Hero />
      <TrendingSection />
      <GenreRows />
      <PersonalizedSection />
    </div>
  );
}

