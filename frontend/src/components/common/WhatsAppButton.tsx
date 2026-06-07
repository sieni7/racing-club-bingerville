const WhatsAppIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="34" 
    height="34" 
    viewBox="0 0 24 24" 
    fill="currentColor"
  >
    <path d="M12.031 0C5.385 0 0 5.386 0 12.031c0 2.12.553 4.195 1.602 6.01L.062 24l6.108-1.599A11.967 11.967 0 0012.031 24c6.645 0 12.031-5.385 12.031-12.03A12.037 12.037 0 0012.031 0zm7.135 17.15c-.297.834-1.722 1.579-2.392 1.688-.67.108-1.517.228-4.706-1.092-3.82-1.583-6.27-5.46-6.458-5.713-.188-.253-1.542-2.052-1.542-3.916 0-1.864.966-2.775 1.309-3.136.342-.361.745-.451.993-.451.248 0 .496.002.713.011.23.01.536-.089.839.64.31.746 1.054 2.585 1.147 2.775.093.189.155.41.031.662-.124.252-.186.41-.372.631-.186.221-.393.479-.558.64-.186.189-.383.398-.166.772.217.374.967 1.599 2.079 2.592 1.436 1.282 2.628 1.678 3.001 1.868.372.189.59.157.807-.095.217-.253.931-1.085 1.179-1.458.248-.374.496-.312.837-.189.341.124 2.156 1.016 2.528 1.205.372.189.62.284.713.442.093.158.093.915-.204 1.749z" />
  </svg>
);

export const WhatsAppButton = () => {
  const phoneNumber = '2250707070707'; // À configurer
  const message = 'Bonjour, je souhaite rejoindre le Racing Club de Bingerville';

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center justify-center">
      {/* Halo Effect */}
      <div className="absolute inset-0 bg-[#25D366] rounded-full animate-ping opacity-60"></div>
      
      {/* Main Button */}
      <a
        href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="relative z-10 w-16 h-16 bg-[#25D366] text-white rounded-full shadow-2xl hover:bg-[#1ebd57] transition-colors flex items-center justify-center hover:scale-110 duration-300"
        aria-label="Contactez-nous sur WhatsApp"
      >
        <WhatsAppIcon />
      </a>
    </div>
  );
};

