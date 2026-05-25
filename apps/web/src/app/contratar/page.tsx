'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { Shield, User, Mail, Lock, BookOpen, Phone, DollarSign, Calendar, Loader2, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';

export default function ContratarPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    gender: 'Masculino',
    birthDate: '',
    crp: '',
    phone: '',
    consultationPrice: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCrpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers
    const val = e.target.value;
    const numericVal = val.replace(/[^0-9]/g, ''); // strip out any non-numeric characters
    setFormData((prev) => ({ ...prev, crp: numericVal }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Basic phone formatter
    const val = e.target.value;
    const numericVal = val.replace(/[^0-9]/g, '');
    setFormData((prev) => ({ ...prev, phone: numericVal }));
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // Allow digits and single decimal dot/comma
    const numericVal = val.replace(/[^0-9.,]/g, '').replace(',', '.');
    setFormData((prev) => ({ ...prev, consultationPrice: numericVal }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Validate CRP: standard main CRP number length is between 4 and 6 digits
    if (formData.crp.length < 4 || formData.crp.length > 6) {
      setError('Número de CRP inválido. O CRP deve conter exatamente de 4 a 6 dígitos numéricos.');
      setIsLoading(false);
      return;
    }

    try {
      const payload = {
        ...formData,
        consultationPrice: formData.consultationPrice ? parseFloat(formData.consultationPrice) : null,
      };

      await axios.post(`${API_URL}/auth/contract`, payload);
      setIsSuccess(true);
    } catch (err: unknown) {
      console.error(err);
      const errorResponse = err as { response?: { data?: { message?: string } } };
      if (errorResponse.response?.data?.message) {
        setError(errorResponse.response.data.message);
      } else {
        setError('Erro ao enviar o cadastro. Por favor, tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <main className="min-h-screen bg-[#FFFFF9] flex flex-col justify-between py-12 px-6">
        <div className="max-w-7xl mx-auto w-full">
          <Link href="/" className="flex items-center gap-2 mb-16">
            <div className="w-10 h-10 bg-[#61401E] rounded-xl flex items-center justify-center shadow-lg">
              <div className="w-5 h-5 bg-[#FFFFF9] rounded-full opacity-80" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-[#61401E]">Mindora</span>
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center my-12">
          <div className="w-full max-w-lg bg-white border border-[#d4c7b5]/30 rounded-2xl p-8 md:p-12 text-center shadow-[0_8px_30px_rgb(97,64,30,0.03)]">
            <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6 text-green-600">
              <CheckCircle2 size={48} />
            </div>
            <h1 className="text-3xl font-bold text-[#61401E] mb-4">Cadastro Recebido!</h1>
            <p className="text-[#8c7661] text-lg mb-8 leading-relaxed">
              Obrigado pelo seu interesse, <strong>{formData.name}</strong>. Seus dados de contratação foram salvos com sucesso em nosso banco de dados.
            </p>
            <div className="p-6 bg-[#FFFFF9] rounded-xl text-left border border-[#d4c7b5]/20 text-sm text-[#8c7661] mb-8 space-y-2">
              <p><strong>CRP:</strong> {formData.crp}</p>
              <p><strong>Status:</strong> Pendente de Liberação</p>
              <p className="pt-2 border-t border-[#d4c7b5]/10 mt-2 text-xs italic">
                O usuário master (administrador) irá analisar sua credencial de CRP e liberar seu login.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/" className="btn-secondary py-3 px-8 text-center text-sm font-bold">
                Voltar ao Início
              </Link>
              <Link href="/login" className="btn-primary py-3 px-8 text-center text-sm font-bold">
                Ir para Login
              </Link>
            </div>
          </div>
        </div>

        <footer className="max-w-7xl mx-auto w-full text-center text-xs text-[#8c7661] flex items-center justify-center gap-2">
          <Shield size={14} />
          <span>Dados de inscrição protegidos conforme as normas da LGPD</span>
        </footer>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FFFFF9] flex flex-col justify-between py-12 px-6">
      <header className="max-w-7xl mx-auto w-full">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-[#61401E] rounded-xl flex items-center justify-center shadow-lg">
            <div className="w-5 h-5 bg-[#FFFFF9] rounded-full opacity-80" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-[#61401E]">Mindora</span>
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center my-12">
        <div className="w-full max-w-2xl bg-white border border-[#d4c7b5]/30 rounded-2xl p-8 md:p-10 shadow-[0_8px_30px_rgb(97,64,30,0.03)]">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#61401E] mb-2">Solicitar Contratação</h1>
            <p className="text-[#8c7661]">Preencha os dados abaixo para criar seu perfil clínico.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-bold text-[#61401E] mb-2">Nome Completo</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8c7661]">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Seu nome completo"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    className="block w-full pl-10 pr-4 py-3 border border-[#d4c7b5]/40 rounded-xl bg-[#FFFFF9]/40 focus:outline-none focus:border-[#61401E] text-[#61401E] transition-all text-sm"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-bold text-[#61401E] mb-2">E-mail</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8c7661]">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    required
                    placeholder="voce@exemplo.com"
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    className="block w-full pl-10 pr-4 py-3 border border-[#d4c7b5]/40 rounded-xl bg-[#FFFFF9]/40 focus:outline-none focus:border-[#61401E] text-[#61401E] transition-all text-sm"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-bold text-[#61401E] mb-2">Crie sua Senha</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8c7661]">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    required
                    placeholder="Mínimo 6 caracteres"
                    value={formData.password}
                    onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                    className="block w-full pl-10 pr-4 py-3 border border-[#d4c7b5]/40 rounded-xl bg-[#FFFFF9]/40 focus:outline-none focus:border-[#61401E] text-[#61401E] transition-all text-sm"
                  />
                </div>
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-bold text-[#61401E] mb-2">Gênero</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData((prev) => ({ ...prev, gender: e.target.value }))}
                  className="block w-full px-4 py-3 border border-[#d4c7b5]/40 rounded-xl bg-[#FFFFF9]/40 focus:outline-none focus:border-[#61401E] text-[#61401E] transition-all text-sm"
                >
                  <option value="Masculino">Masculino</option>
                  <option value="Feminino">Feminino</option>
                  <option value="Outro">Prefiro não responder</option>
                </select>
              </div>

              {/* Birth Date */}
              <div>
                <label className="block text-sm font-bold text-[#61401E] mb-2">Data de Nascimento</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8c7661]">
                    <Calendar size={18} />
                  </div>
                  <input
                    type="date"
                    required
                    value={formData.birthDate}
                    onChange={(e) => setFormData((prev) => ({ ...prev, birthDate: e.target.value }))}
                    className="block w-full pl-10 pr-4 py-3 border border-[#d4c7b5]/40 rounded-xl bg-[#FFFFF9]/40 focus:outline-none focus:border-[#61401E] text-[#61401E] transition-all text-sm"
                  />
                </div>
              </div>

              {/* CRP (Restricted to Numbers only, error length validate) */}
              <div>
                <label className="block text-sm font-bold text-[#61401E] mb-2">
                  Registro CRP <span className="text-[#8c7661] text-xs font-normal">(Somente números, ex: 123456)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8c7661]">
                    <BookOpen size={18} />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Apenas dígitos"
                    maxLength={6}
                    value={formData.crp}
                    onChange={handleCrpChange}
                    onKeyDown={(e) => {
                      // Prevent letters and other symbols. Allow: numbers, backspace, tab, delete, arrows
                      const allowedKeys = ['Backspace', 'Tab', 'Delete', 'ArrowLeft', 'ArrowRight'];
                      if (!allowedKeys.includes(e.key) && isNaN(Number(e.key))) {
                        e.preventDefault();
                      }
                    }}
                    className="block w-full pl-10 pr-4 py-3 border border-[#d4c7b5]/40 rounded-xl bg-[#FFFFF9]/40 focus:outline-none focus:border-[#61401E] text-[#61401E] transition-all text-sm font-mono"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-bold text-[#61401E] mb-2">Telefone (DDDMóvel)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8c7661]">
                    <Phone size={18} />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Ex: 11999998888"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    className="block w-full pl-10 pr-4 py-3 border border-[#d4c7b5]/40 rounded-xl bg-[#FFFFF9]/40 focus:outline-none focus:border-[#61401E] text-[#61401E] transition-all text-sm"
                  />
                </div>
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-bold text-[#61401E] mb-2">Preço Médio da Consulta (R$)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8c7661]">
                    <DollarSign size={18} />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Ex: 150.00"
                    value={formData.consultationPrice}
                    onChange={handlePriceChange}
                    className="block w-full pl-10 pr-4 py-3 border border-[#d4c7b5]/40 rounded-xl bg-[#FFFFF9]/40 focus:outline-none focus:border-[#61401E] text-[#61401E] transition-all text-sm"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary py-3.5 mt-8 flex items-center justify-center gap-2 cursor-pointer font-bold"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Enviando Solicitação...
                </>
              ) : (
                'Enviar Solicitação de Contratação'
              )}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-[#d4c7b5]/20 pt-6">
            <p className="text-sm text-[#8c7661]">
              Já tem uma conta liberada?{' '}
              <Link href="/login" className="font-bold text-[#61401E] hover:underline">
                Fazer login
              </Link>
            </p>
          </div>
        </div>
      </div>

      <footer className="max-w-7xl mx-auto w-full text-center text-xs text-[#8c7661] flex items-center justify-center gap-2">
        <Shield size={14} />
        <span>Todos os seus dados estão seguros e criptografados</span>
      </footer>
    </main>
  );
}
