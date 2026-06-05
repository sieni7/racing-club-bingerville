import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white p-4 text-center mt-auto">
      <p>&copy; {new Date().getFullYear()} Racing Club Bingerville. Tous droits réservés.</p>
    </footer>
  );
};
