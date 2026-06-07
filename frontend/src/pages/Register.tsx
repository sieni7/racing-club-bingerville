import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Input } from '../components/common/Input';
import { Button } from '../components/ui/Button';
import { motion } from 'framer-motion';
import { UserPlus, ShieldCheck, ArrowRight } from 'lucide-react';

const registerSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function Register() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      await signUp(data.email, data.password, {});
      navigate('/dashboard');
    } catch (error: any) {
      setError('root', { message: error.message || 'Erreur d\'inscription' });
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Right side - Image (Swapped for Register to differ from Login) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gray-900 overflow-hidden order-2">
        <div className="absolute inset-0 bg-gradient-to-tr from-secondary/80 to-gray-900/90 z-10 mix-blend-multiply" />
        <img
          src="https://images.unsplash.com/photo-mY2ZHBU6GRk?q=80&w=2000&auto=format&fit=crop"
          alt="Racing Club Bingerville Training"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 flex flex-col justify-between h-full p-12 text-white w-full">
          <div className="flex justify-end">
            <Link to="/" className="flex items-center gap-3 w-fit">
              <span className="font-bold text-xl tracking-wide">Racing Club</span>
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-secondary font-black text-xl">
                R
              </div>
            </Link>
          </div>

          <div className="max-w-md ml-auto text-right">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl font-black mb-6 leading-tight"
            >
              Rejoignez l'élite
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-lg text-gray-300"
            >
              Faites partie de notre aventure. Créez un compte pour accéder à des contenus exclusifs et interagir avec la communauté.
            </motion.p>
          </div>

          <div className="flex justify-end items-center gap-4 text-sm text-gray-400">
            <span>Données cryptées et protection de la vie privée.</span>
            <ShieldCheck size={20} className="text-secondary-light" />
          </div>
        </div>
      </div>

      {/* Left side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 order-1">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="max-w-md w-full"
        >
          <div className="lg:hidden flex justify-center mb-8">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-glow">
                R
              </div>
            </Link>
          </div>

          <div className="text-center lg:text-left mb-10">
            <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-3">Créer un compte</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Remplissez le formulaire ci-dessous pour rejoindre le Racing Club.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <Input 
                label="Adresse email" 
                type="email" 
                placeholder="vous@exemple.com"
                {...register('email')} 
                error={errors.email?.message} 
              />
              
              <Input 
                label="Mot de passe" 
                type="password" 
                placeholder="••••••••"
                {...register('password')} 
                error={errors.password?.message} 
              />

              <Input 
                label="Confirmer le mot de passe" 
                type="password" 
                placeholder="••••••••"
                {...register('confirmPassword')} 
                error={errors.confirmPassword?.message} 
              />
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
              <UserPlus size={18} />
              <span>S'inscrire maintenant</span>
            </Button>
          </form>

          <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-800 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Vous avez déjà un compte ?{' '}
              <Link to="/login" className="text-secondary font-bold hover:underline transition-all">
                Se connecter
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

