import { motion } from 'framer-motion';

export const ClubSection = () => {
  return (
    <section className="py-24 bg-white dark:bg-gray-900 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2 pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center mb-16"
        >
          <span className="text-secondary font-semibold tracking-wider uppercase text-sm">Héritage</span>
          <h2 className="text-4xl md:text-5xl font-black mb-4 mt-2">Notre Histoire</h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-primary to-blue-400 mx-auto rounded-full" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Texte histoire */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">L'Âme du <span className="text-primary">Racing Club</span></h3>
            
            <div className="space-y-4 border-l-4 border-primary/20 pl-6">
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                Fondé en <span className="font-bold text-gray-900 dark:text-white">1998</span>, le Racing Club de Bingerville est plus qu'un club de football amateur : c'est une institution qui forme les jeunes talents de la région depuis plus de 25 ans.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                Notre mission : promouvoir les valeurs du sport, de l'intégrité et du dépassement de soi, tout en offrant un cadre d'excellence pour l'épanouissement sportif et humain de nos jeunes joueurs.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                De nombreux professionnels sont passés par notre centre de formation et portent aujourd'hui fièrement les couleurs du Racing sur les grands terrains d'Abidjan et à l'international.
              </p>
            </div>
            
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-8 px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              Découvrir le Palmarès
            </motion.button>
          </motion.div>

          {/* Image d'illustration */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-primary to-secondary rounded-[2rem] transform rotate-3 scale-[1.02] opacity-20 dark:opacity-40 blur-lg" />
            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white dark:border-gray-800">
              <img 
                src="https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=1000&auto=format&fit=crop" 
                alt="Histoire du Racing Club" 
                className="w-full h-[400px] md:h-[500px] object-cover hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
              {/* Overlay Badge */}
              <div className="absolute bottom-6 left-6 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-6 py-4 rounded-2xl shadow-xl flex items-center gap-4">
                <span className="text-4xl font-black text-primary">25+</span>
                <span className="text-sm font-bold text-gray-600 dark:text-gray-300 uppercase tracking-widest leading-tight">Années<br/>d'Histoire</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

