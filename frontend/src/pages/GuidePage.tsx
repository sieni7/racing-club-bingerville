import { Card } from '../components/ui/Card';
import { BookOpen, Users, Play, Calendar, Star } from 'lucide-react';
import { motion } from 'framer-motion';

export default function GuidePage() {
  const guides = [
    {
      title: "Guide Administrateur",
      icon: <Star className="w-6 h-6 text-primary" />,
      description: "Apprenez à gérer les rôles, superviser la plateforme et sécuriser les données.",
      link: "https://github.com/sieni7/racing-club-bingerville/blob/master/docs/admin-guide.md"
    },
    {
      title: "Guide Staff (Entraîneurs)",
      icon: <Users className="w-6 h-6 text-accent-success" />,
      description: "Gérez l'effectif, planifiez les matchs et gérez les compositions d'équipe.",
      link: "https://github.com/sieni7/racing-club-bingerville/blob/master/docs/staff-guide.md"
    },
    {
      title: "Guide Joueurs",
      icon: <Play className="w-6 h-6 text-secondary" />,
      description: "Consultez vos statistiques personnelles et suivez l'actualité de votre équipe.",
      link: "https://github.com/sieni7/racing-club-bingerville/blob/master/docs/player-guide.md"
    },
    {
      title: "Guide Parents",
      icon: <Calendar className="w-6 h-6 text-accent-info" />,
      description: "Suivez l'évolution et l'agenda des matchs de vos enfants.",
      link: "https://github.com/sieni7/racing-club-bingerville/blob/master/docs/parent-guide.md"
    },
    {
      title: "Foire Aux Questions (FAQ)",
      icon: <BookOpen className="w-6 h-6 text-accent-warning" />,
      description: "Trouvez des réponses immédiates aux questions les plus fréquentes.",
      link: "https://github.com/sieni7/racing-club-bingerville/blob/master/docs/FAQ.md"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0A0E17]">
      {/* Hero Header */}
      <div className="relative pt-20 pb-16 bg-white dark:bg-gray-900 overflow-hidden border-b border-gray-200 dark:border-white/5">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2" />
        
        <div className="container mx-auto px-4 max-w-5xl relative z-10 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-primary font-bold tracking-wider uppercase text-sm mb-2 block">Support & Aide</span>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight mb-3">Centre de Documentation</h1>
            <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl mx-auto">
              Tout ce dont vous avez besoin pour maîtriser le Sport Intelligence Dashboard du Racing Club de Bingerville.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-5xl">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {guides.map((guide, i) => (
          <motion.a 
            href={guide.link}
            target="_blank"
            rel="noopener noreferrer"
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="block group"
          >
            <Card className="p-6 h-full border border-white/5 hover:border-primary/50 transition-all duration-300 bg-background-card hover:bg-white/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform duration-500">
                {guide.icon}
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/5 rounded-xl group-hover:bg-primary/10 transition-colors">
                  {guide.icon}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-light transition-colors">{guide.title}</h2>
                  <p className="text-content-muted leading-relaxed">{guide.description}</p>
                </div>
              </div>
            </Card>
          </motion.a>
        ))}
      </div>
      
      <div className="mt-12 text-center">
        <p className="text-content-muted">
          Besoin d'aide supplémentaire ? Contactez l'administrateur du club ou consultez notre <a href="https://github.com/sieni7/racing-club-bingerville/blob/master/docs/tutorial-script.md" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">Tutoriel Vidéo</a>.
        </p>
      </div>
      </div>
    </div>
  );
}

