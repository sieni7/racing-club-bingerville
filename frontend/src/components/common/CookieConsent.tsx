import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CookieConsent = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('cookie-consent')) {
      setShow(true);
    }
  }, []);

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 z-50 shadow-2xl border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="text-sm text-gray-300">
        En poursuivant votre navigation sur ce site, vous acceptez l'utilisation de cookies pour vous proposer des contenus personnalisés et réaliser des statistiques de visites. 
        <Link to="/confidentialite" className="ml-2 text-primary hover:underline font-medium">En savoir plus</Link>
      </div>
      <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
        <button 
          onClick={() => { localStorage.setItem('cookie-consent', 'true'); setShow(false); }} 
          className="bg-primary hover:bg-primary-light text-gray-900 px-6 py-2 rounded-lg font-bold text-sm transition-colors w-full md:w-auto"
        >
          Accepter
        </button>
        <button onClick={() => setShow(false)} className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors absolute top-2 right-2 md:static">
          <X size={20} />
        </button>
      </div>
    </div>
  );
};
