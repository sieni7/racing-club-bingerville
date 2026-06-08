import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Input } from '../components/common/Input';
import { Button } from '../components/ui/Button';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Mail, Lock } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      await signIn(data.email, data.password);
      navigate('/dashboard');
    } catch (error: any) {
      setError('root', { message: error.message || 'Email ou mot de passe incorrect' });
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-gray-900/90 z-10 mix-blend-multiply" />
        <img
          src="https://images.unsplash.com/photo-1518605368461-1ed107b34e40?q=80&w=2000&auto=format&fit=crop"
          alt="Racing Club Bingerville Stadium"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 flex flex-col justify-between h-full p-12 text-white">
          <Link to="/" className="flex items-center gap-3 w-fit">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary font-black text-xl">
              R
            </div>
            <span className="font-bold text-xl tracking-wide">Racing Club</span>
          </Link>

          <div className="max-w-md">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl font-black mb-6 leading-tight"
            >
              Bienvenue dans l'espace membre
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-lg text-gray-300"
            >
              Accédez à vos statistiques, gérez vos équipes et suivez les performances de notre club en temps réel.
            </motion.p>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-400">
            <ShieldCheck size={20} className="text-primary-light" />
            <span>Accès sécurisé réservé aux membres et au staff.</span>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="max-w-md w-full"
        >
          <div className="lg:hidden flex justify-center mb-8">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-glow">
                R
              </div>
            </Link>
          </div>

          <div className="text-center lg:text-left mb-10">
            <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-3">Connexion</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Entrez vos identifiants pour accéder à votre espace.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Input 
                  label="Adresse email" 
                  type="email" 
                  placeholder="vous@exemple.com"
                  {...register('email')} 
                  error={errors.email?.message} 
                />
              </div>
              
              <div>
                <Input 
                  label="Mot de passe" 
                  type="password" 
                  placeholder="••••••••"
                  {...register('password')} 
                  error={errors.password?.message} 
                />
                <div className="flex justify-end mt-1">
                  <a href="#" className="text-sm text-primary hover:text-primary-dark font-medium transition-colors">
                    Mot de passe oublié ?
                  </a>
                </div>
              </div>
            </div>

            {errors.root && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 flex items-start gap-3"
              >
                <div className="text-red-600 dark:text-red-400 font-medium text-sm">
                  {errors.root.message}
                </div>
              </motion.div>
            )}

            <Button 
              type="submit" 
              isLoading={isSubmitting} 
              className="w-full py-3.5 text-base shadow-glow flex items-center justify-center gap-2"
            >
              <span>Se connecter</span>
              {!isSubmitting && <ArrowRight size={18} />}
            </Button>
          </form>

          <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-800 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Vous n'avez pas encore de compte ?{' '}
              <Link to="/register" className="text-primary font-bold hover:underline transition-all">
                Demander un accès
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

