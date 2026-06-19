import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Heart, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Falha no login. Verifique as suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-zinc-800 rounded-md flex items-center justify-center text-white mx-auto mb-6">
            <Heart size={32} fill="currentColor" />
          </div>
          <h1 className="text-3xl font-black text-slate-800 mb-2">Bem-vindo ao Sentia</h1>
          <p className="text-slate-500">O seu diário pessoal e inteligente.</p>
        </div>

        <div className="bg-white p-8 rounded-md  border border-slate-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-md flex items-center gap-3 text-sm font-medium border border-red-100 animate-shake">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Email</label>
              <div className="relative mt-3">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-md py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                  placeholder="exemplo@email.com"
                />
              </div>
            </div>

            <div className="space-y-2 ">
              <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
              <div className="relative mt-3">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-md py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-zinc-800 hover:bg-zinc-900 text-white font-bold py-3 rounded-md shadow-primary-200 transition-all flex items-center justify-center gap-2 group"
            >
              {loading ? 'A entrar...' : (
                <>
                  Entrar na Conta
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-50 text-center">
            <p className="text-slate-500 text-sm">
              Ainda não tem conta? {' '}
              <Link to="/register" className="text-primary-600 font-bold hover:underline">Criar agora</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
