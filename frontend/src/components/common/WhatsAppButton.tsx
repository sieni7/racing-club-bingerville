import { MessageCircle } from 'lucide-react';

export const WhatsAppButton = () => {
  const phoneNumber = '2250707070707'; // À configurer
  const message = 'Bonjour, je souhaite rejoindre le Racing Club de Bingerville';

  return (
    <a
      href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-colors flex items-center justify-center animate-bounce-slow"
      aria-label="Contactez-nous sur WhatsApp"
    >
      <MessageCircle size={28} />
    </a>
  );
};
