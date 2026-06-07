export const SponsorsSection = () => {
  const sponsors = [
    { name: 'Sponsor 1', logo: 'https://placehold.co/150x80/2a2a2a/FFFFFF?text=Sponsor+1' },
    { name: 'Sponsor 2', logo: 'https://placehold.co/150x80/2a2a2a/FFFFFF?text=Sponsor+2' },
    { name: 'Sponsor 3', logo: 'https://placehold.co/150x80/2a2a2a/FFFFFF?text=Sponsor+3' },
    { name: 'Sponsor 4', logo: 'https://placehold.co/150x80/2a2a2a/FFFFFF?text=Sponsor+4' },
    { name: 'Sponsor 5', logo: 'https://placehold.co/150x80/2a2a2a/FFFFFF?text=Sponsor+5' },
  ];

  return (
    <section className="py-10 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
      <div className="container mx-auto px-4 max-w-6xl">
        <p className="text-center text-sm font-semibold text-gray-400 uppercase tracking-widest mb-6">Nos Partenaires Officiels</p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
          {sponsors.map((sponsor) => (
            <img 
              key={sponsor.name} 
              src={sponsor.logo} 
              alt={sponsor.name} 
              className="h-12 md:h-16 object-contain"
              loading="lazy"
            />
          ))}
        </div>
      </div>
    </section>
  );
};
