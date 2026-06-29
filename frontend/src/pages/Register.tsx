import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import api from '@/lib/axios';

const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/register', data);
      localStorage.setItem('access_token', response.data.access_token);
      toast.success('Account successfully initialized');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Initialization failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4 text-foreground selection:bg-accent selection:text-background font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-surface border border-border shadow-2xl overflow-hidden"
      >
        <div className="p-6 border-b border-border bg-background/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              MULTIPLY
            </h1>
            <span className="text-[10px] font-mono text-accent uppercase tracking-widest">/ Init</span>
          </div>
          <span className="text-[10px] font-mono text-muted uppercase tracking-widest">V.1.0</span>
        </div>
        
        <form className="p-8 space-y-8" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-muted uppercase tracking-widest block">Designation (Name)</label>
              <input
                {...register('name')}
                type="text"
                className="w-full bg-background border border-border px-4 py-3 text-foreground font-sans focus:border-accent focus:outline-none transition-colors"
                placeholder="John Doe"
              />
              {errors.name && <p className="text-xs text-red-500 font-mono">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-muted uppercase tracking-widest block">Identity (Email)</label>
              <input
                {...register('email')}
                type="email"
                className="w-full bg-background border border-border px-4 py-3 text-foreground font-sans focus:border-accent focus:outline-none transition-colors"
                placeholder="you@example.com"
              />
              {errors.email && <p className="text-xs text-red-500 font-mono">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-muted uppercase tracking-widest block">Passkey</label>
              <input
                {...register('password')}
                type="password"
                className="w-full bg-background border border-border px-4 py-3 text-foreground font-sans tracking-widest focus:border-accent focus:outline-none transition-colors"
                placeholder="••••••••"
              />
              {errors.password && <p className="text-xs text-red-500 font-mono">{errors.password.message}</p>}
            </div>
          </div>

          <div className="pt-4 border-t border-border mt-8">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-foreground text-background px-8 py-4 text-[10px] font-mono font-bold uppercase tracking-widest hover:bg-accent transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Processing...' : 'Initialize Account'}
            </button>
          </div>
        </form>
        
        <div className="p-6 bg-background/50 border-t border-border text-center">
          <p className="text-[10px] font-mono text-muted uppercase tracking-widest">
            Registered?{' '}
            <Link to="/login" className="text-foreground hover:text-accent transition-colors underline decoration-border underline-offset-4">
              Establish Connection
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
