import { motion } from 'framer-motion';

const testimonials = [
  {
    name: 'Didier Yao',
    role: 'Entraîneur Principal',
    content: 'Notre ambition est de former les meilleurs talents de Bingerville. Le sérieux et l\'implication des joueurs sont notre plus grande fierté.',
    image: 'https://i.pravatar.cc/150?u=coach',
  },
  {
    name: 'Franck Kouassi',
    role: 'Capitaine',
    content: 'Chaque match est une occasion de représenter notre ville avec fierté. L\'esprit d\'équipe qui règne ici est exceptionnel.',
    image: 'https://i.pravatar.cc/150?u=capitaine',
  },
  {
    name: 'Mme Konan',
    role: 'Parent de joueur',
    content: 'Le club a permis à mon fils de progresser tant sportivement qu\'humainement. L\'encadrement est très professionnel.',
    image: 'https://i.pravatar.cc/150?u=parent',
  },
];

export const Testimonials = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-background to-background-card dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <span className="text-primary font-semibold tracking-wider uppercase text-sm">Communauté</span>
          <h2 className="text-4xl font-black text-gray-900 dark:text-white mt-2">Ils parlent de nous</h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15, duration: 0.5 }}
              className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-soft border border-gray-100 dark:border-gray-800 relative"
            >
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full overflow-hidden border-4 border-white dark:border-gray-900 shadow-sm">
                <img src={t.image} alt={t.name} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="pt-8 text-center">
                <div className="mb-6">
                  <span className="text-4xl text-primary/20 absolute top-8 left-6 font-serif">"</span>
                  <p className="text-gray-700 dark:text-gray-300 italic relative z-10">
                    {t.content}
                  </p>
                  <span className="text-4xl text-primary/20 absolute bottom-16 right-6 font-serif">"</span>
                </div>
                <h4 className="text-lg font-bold text-gray-900 dark:text-white">{t.name}</h4>
                <p className="text-sm text-primary font-medium">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
