import SearchSection from '@/components/home/SearchSection';
import FeaturedChampions from '@/components/home/FeaturedChampions';
import RecentMatches from '@/components/home/RecentMatches';

export default function Home() {
  return (
    <div className="animate-fade-in">
      <SearchSection />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        <FeaturedChampions />
        <RecentMatches />
      </div>
    </div>
  );
}
