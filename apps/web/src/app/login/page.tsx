'use client';

import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Shield, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';

export default function LoginPage() {
  const router = useRouter();
  const { login, token, user, initialize } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    // If already logged in, redirect accordingly
    if (token && user) {
      if (user.role === 'admin') {
        router.push('/dashboard/admin');
      } else {
        router.push('/dashboard');
      }
    }
  }, [token, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });

      const { accessToken, user: userData } = response.data;
      login(accessToken, userData);

      // Redirect based on role
      if (userData.role === 'admin') {
        router.push('/dashboard/admin');
      } else {
        router.push('/dashboard');
      }
    } catch (err: unknown) {
      console.error(err);
      const errorResponse = err as { response?: { data?: { message?: string } } };
      if (errorResponse.response?.data?.message) {
        setError(errorResponse.response.data.message);
      } else {
        setError('Ocorreu um erro ao tentar realizar o login. Tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FFFFF9] flex flex-col justify-between py-12 px-6">
      {/* Header Logo */}
      <header className="max-w-7xl mx-auto w-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-[#61401E] rounded-xl flex items-center justify-center shadow-lg">
            <div className="w-5 h-5 bg-[#FFFFF9] rounded-full opacity-80" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-[#61401E]">Mindora</span>
        </Link>
      </header>

      {/* Main Login Form Container */}
      <div className="flex-1 flex items-center justify-center my-12">
        <div className="w-full max-w-md bg-white border border-[#d4c7b5]/30 rounded-2xl p-8 md:p-10 shadow-[0_8px_30px_rgb(97,64,30,0.03)] transition-all">
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-[#61401E] mb-2">Entrar na plataforma</h1>
            <p className="text-[#8c7661] text-sm md:text-base">Bem-vindo(a) de volta! Insira suas credenciais.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-[#61401E] mb-2">
                E-mail profissional
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8c7661]">
                  <Mail size={18} />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="exemplo@mindora.com.br"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3 border border-[#d4c7b5]/40 rounded-xl bg-[#FFFFF9]/40 focus:outline-none focus:border-[#61401E] text-[#61401E] transition-all text-sm"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="password" className="text-sm font-bold text-[#61401E]">
                  Senha
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8c7661]">
                  <Lock size={18} />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Sua senha secreta"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-3 border border-[#d4c7b5]/40 rounded-xl bg-[#FFFFF9]/40 focus:outline-none focus:border-[#61401E] text-[#61401E] transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#8c7661] hover:text-[#61401E]"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary py-3.5 flex items-center justify-center gap-2 cursor-pointer font-bold disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Carregando...
                </>
              ) : (
                'Entrar'
              )}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-[#d4c7b5]/20 pt-6">
            <p className="text-sm text-[#8c7661]">
              Ainda não possui uma conta?{' '}
              <Link href="/contratar" className="font-bold text-[#61401E] hover:underline">
                Contrate agora
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <footer className="max-w-7xl mx-auto w-full text-center text-xs text-[#8c7661] flex items-center justify-center gap-2">
        <Shield size={14} />
        <span>Acesso protegido com criptografia SSL militar de ponta</span>
      </footer>
    </main>
  );
}
