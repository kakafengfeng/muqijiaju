import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContent } from '../context/ContentContext';
import { Lock, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export const LoginPage: React.FC = () => {
  const { login, user } = useContent();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Demo 凭据提示仅在本地开发环境可见
  const showDemoHint = import.meta.env.DEV;

  // If already logged in, redirect to admin (or home with admin panel open)
  React.useEffect(() => {
    if (user) {
        navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      await login(email, password);
      // Navigation happens via useEffect above
    } catch (err: any) {
      console.error(err);
      setError('Login failed. Please check your credentials or Firebase config.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 flex items-center justify-center p-6">
      <motion.div 
        {...({
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 }
        } as any)}
        className="bg-white p-8 md:p-12 rounded-lg shadow-xl w-full max-w-md"
      >
        <div className="mb-8 text-center">
            <h1 className="text-2xl font-light tracking-widest uppercase text-stone-900 mb-2">Muqi Admin</h1>
            <p className="text-xs text-stone-500">System Access</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-xs font-bold text-stone-500 uppercase mb-2">Email</label>
                <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 border border-stone-200 rounded focus:border-stone-900 outline-none transition-colors"
                    placeholder="name@example.com"
                />
            </div>
            
            <div>
                <label className="block text-xs font-bold text-stone-500 uppercase mb-2">Password</label>
                <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 border border-stone-200 rounded focus:border-stone-900 outline-none transition-colors"
                    placeholder="••••••••"
                />
            </div>

            {error && (
                <div className="text-red-500 text-xs bg-red-50 p-3 rounded">
                    {error}
                </div>
            )}

            <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full py-4 bg-stone-900 text-white text-sm font-bold tracking-widest uppercase hover:bg-stone-700 transition-colors disabled:opacity-50"
            >
                {isSubmitting ? 'Authenticating...' : 'Login'}
            </button>
        </form>

        <div className="mt-8 text-center">
            {showDemoHint && (
                <p className="text-[11px] text-stone-400 mb-3">
                    Dev only — demo account: admin@muqi.com / 123456
                </p>
            )}
            <button onClick={() => navigate('/')} className="text-xs text-stone-400 hover:text-stone-900 flex items-center justify-center gap-2 mx-auto">
                <ArrowLeft size={14} /> Back to Website
            </button>
        </div>
      </motion.div>
    </div>
  );
};