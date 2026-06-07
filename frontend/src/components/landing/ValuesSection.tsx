import { motion } from 'framer-motion';

const valeurs = [
  {
    title: 'Discipline',
    description: 'Respect des règles et de l\'institution',
    icon: '📋',
    color: 'from-blue-500 to-cyan-500',
    delay: 0,
  },
  {
    title: 'Respect',
    description: 'Des adversaires, arbitres et partenaires',
    icon: '🤝',
    color: 'from-green-500 to-emerald-500',
    delay: 0.1,
  },
  {
    title: 'Travail',
    description: 'L\'excellence par l\'effort quotidien',
    icon: '💪',
    color: 'from-orange-500 to-red-500',
    delay: 0.2,
  },
  {
    title: 'Excellence',
    description: 'La performance au service du collectif',
    icon: '⭐',
    color: 'from-yellow-500 to-amber-500',
    delay: 0.3,
  },
];

export const ValuesSection = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Notre ADN</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">Nos valeurs fondamentales</p>
          <div className="w-20 h-1 bg-primary mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {valeurs.map((valeur, idx) => (
            <motion.div
              key={valeur.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: valeur.delay, duration: 0.5 }}
              viewport={{ once: true }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -m-0.5 blur-lg" />
              <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-soft hover:shadow-soft-lg transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                {/* Background gradient overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${valeur.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                
                {/* Icon */}
                <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  {valeur.icon}
                </div>
                
                {/* Title */}
                <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">
                  {valeur.title}
                </h3>
                
                {/* Description */}
                <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                  {valeur.description}
                </p>
                
                {/* Decorative line */}
                <div className={`w-12 h-1 bg-gradient-to-r ${valeur.color} rounded-full mt-4 transition-all duration-300 group-hover:w-16`} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
