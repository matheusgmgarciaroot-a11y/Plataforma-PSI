'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { 
  Shield, 
  User, 
  Mail, 
  Lock, 
  BookOpen, 
  Phone, 
  DollarSign, 
  Calendar, 
  Loader2, 
  CheckCircle2, 
  QrCode, 
  CreditCard, 
  ArrowLeft, 
  ArrowRight 
} from 'lucide-react';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';

export default function ContratarPage() {
  const [step, setStep] = useState(1);
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

  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card'>('pix');
  const [cardData, setCardData] = useState({
    number: '',
    holder: '',
    expiry: '',
    cvv: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCrpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const numericVal = val.replace(/[^0-9]/g, '');
    setFormData((prev) => ({ ...prev, crp: numericVal }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const numericVal = val.replace(/[^0-9]/g, '');
    setFormData((prev) => ({ ...prev, phone: numericVal }));
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const numericVal = val.replace(/[^0-9.,]/g, '').replace(',', '.');
    setFormData((prev) => ({ ...prev, consultationPrice: numericVal }));
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate fields
    if (!formData.name || !formData.email || !formData.password || !formData.crp || !formData.phone || !formData.consultationPrice) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (formData.crp.length < 4 || formData.crp.length > 6) {
      setError('Número de CRP inválido. O CRP deve conter exatamente de 4 a 6 dígitos numéricos.');
      return;
    }

    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (paymentMethod === 'card') {
      if (!cardData.number || !cardData.holder || !cardData.expiry || !cardData.cvv) {
        setError('Por favor, preencha todos os campos do cartão de crédito.');
        setIsLoading(false);
        return;
      }
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
            <h1 className="text-3xl font-bold text-[#61401E] mb-4">Cadastro Realizado!</h1>
            <p className="text-[#8c7661] text-lg mb-8 leading-relaxed">
              Obrigado pelo seu interesse, <strong>{formData.name}</strong>. Seus dados e o pagamento de R$ 25,00/mês foram confirmados.
            </p>
            <div className="p-6 bg-[#FFFFF9] rounded-xl text-left border border-[#d4c7b5]/20 text-sm text-[#8c7661] mb-8 space-y-2">
              <p><strong>CRP:</strong> {formData.crp}</p>
              <p><strong>Assinatura:</strong> Ativa (R$ 25,00/mês)</p>
              <p><strong>Status de Acesso:</strong> Pendente de Liberação</p>
              <p className="pt-2 border-t border-[#d4c7b5]/10 mt-2 text-xs italic">
                Sua conta foi enviada para análise. O administrador master irá analisar seus dados cadastrais e liberar seu acesso em breve.
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
          
          {/* Progress Indicators */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                step === 1 ? 'bg-[#61401E] text-[#FFFFF9]' : 'bg-green-100 text-green-700'
              }`}>
                {step > 1 ? <CheckCircle2 size={16} className="text-green-700" /> : '1'}
              </div>
              <span className={`text-xs font-bold ${step === 1 ? 'text-[#61401E]' : 'text-green-700'}`}>Dados Clínicos</span>
            </div>
            <div className="w-10 h-0.5 bg-[#d4c7b5]/40" />
            <div className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                step === 2 ? 'bg-[#61401E] text-[#FFFFF9]' : 'bg-[#e6dfd3] text-[#8c7661]'
              }`}>
                2
              </div>
              <span className={`text-xs font-bold ${step === 2 ? 'text-[#61401E]' : 'text-[#8c7661]'}`}>Pagamento</span>
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#61401E] mb-2">
              {step === 1 ? 'Solicitar Contratação' : 'Pagamento da Assinatura'}
            </h1>
            <p className="text-[#8c7661]">
              {step === 1 
                ? 'Preencha seus dados para criar sua conta clínica e perfil profissional.' 
                : 'A assinatura do Mindora custa R$ 25,00/mês. Escolha um método abaixo para simular.'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r-lg">
              {error}
            </div>
          )}

          {step === 1 ? (
            /* STEP 1: CADASTRO FORM */
            <form onSubmit={handleNextStep} className="space-y-6">
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
                  <label className="block text-sm font-bold text-[#61401E] mb-2">Escolha sua Senha</label>
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

                {/* CRP */}
                <div>
                  <label className="block text-sm font-bold text-[#61401E] mb-2">
                    Registro CRP <span className="text-[#8c7661] text-xs font-normal">(Somente números)</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8c7661]">
                      <BookOpen size={18} />
                    </div>
                    <input
                      type="text"
                      required
                      placeholder="Ex: 123456"
                      maxLength={6}
                      value={formData.crp}
                      onChange={handleCrpChange}
                      onKeyDown={(e) => {
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
                className="w-full btn-primary py-3.5 mt-8 flex items-center justify-center gap-2 cursor-pointer font-bold animate-pulse hover:animate-none"
              >
                Avançar para o Pagamento
                <ArrowRight size={18} />
              </button>
            </form>
          ) : (
            /* STEP 2: PAGAMENTO FORM */
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Product Info Box */}
              <div className="bg-[#FFFFF9] border border-[#d4c7b5]/30 rounded-xl p-5 mb-6 text-[#61401E]">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-semibold uppercase tracking-wider text-[#8c7661]">Assinatura Mindora</span>
                  <span className="bg-[#61401E]/10 text-[#61401E] text-xs font-bold px-2.5 py-1 rounded-full">Mensal</span>
                </div>
                <div className="flex items-baseline text-[#61401E]">
                  <span className="text-3xl font-bold">R$ 25,00</span>
                  <span className="text-sm text-[#8c7661] ml-1">/mês</span>
                </div>
              </div>

              {/* Payment Tabs */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('pix')}
                  className={`flex items-center justify-center gap-2 p-3 border rounded-xl font-bold text-sm cursor-pointer transition-all ${
                    paymentMethod === 'pix'
                      ? 'border-[#61401E] bg-[#61401E] text-[#FFFFF9] shadow-sm'
                      : 'border-[#d4c7b5]/40 text-[#8c7661] hover:bg-[#e6dfd3]/20'
                  }`}
                >
                  <QrCode size={18} />
                  Pix
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`flex items-center justify-center gap-2 p-3 border rounded-xl font-bold text-sm cursor-pointer transition-all ${
                    paymentMethod === 'card'
                      ? 'border-[#61401E] bg-[#61401E] text-[#FFFFF9] shadow-sm'
                      : 'border-[#d4c7b5]/40 text-[#8c7661] hover:bg-[#e6dfd3]/20'
                  }`}
                >
                  <CreditCard size={18} />
                  Cartão de Crédito
                </button>
              </div>

              {/* Render Payment Method Fields */}
              {paymentMethod === 'pix' ? (
                /* PIX INTERFACE */
                <div className="flex flex-col items-center p-6 border border-[#d4c7b5]/20 bg-[#FFFFF9]/40 rounded-xl mb-6 text-center">
                  <div className="w-40 h-40 bg-white border border-[#d4c7b5]/30 rounded-xl flex items-center justify-center p-3 mb-4 shadow-sm relative overflow-hidden">
                    <svg viewBox="0 0 100 100" className="w-full h-full text-[#61401E] fill-current">
                      <path d="M0,0 h30 v10 h-20 v20 h-10 z M70,0 h30 v30 h-10 v-20 h-20 z M0,70 h10 v20 h20 v10 h-30 z M90,90 h-20 v10 h30 v-30 h-10 z" />
                      <rect x="15" y="15" width="15" height="15" />
                      <rect x="70" y="15" width="15" height="15" />
                      <rect x="15" y="70" width="15" height="15" />
                      <rect x="40" y="40" width="20" height="20" />
                      <rect x="45" y="15" width="10" height="5" />
                      <rect x="45" y="25" width="5" height="5" />
                      <rect x="70" y="45" width="5" height="10" />
                      <rect x="15" y="45" width="10" height="5" />
                      <rect x="45" y="70" width="10" height="5" />
                      <rect x="70" y="70" width="10" height="10" />
                    </svg>
                  </div>
                  <p className="text-xs text-[#8c7661] mb-4">
                    Escaneie o QR Code acima no app do seu banco. O pagamento simulado de R$ 25,00 será verificado instantaneamente.
                  </p>
                  <button
                    type="button"
                    onClick={() => alert('Código Copia e Cola copiado para a área de transferência!')}
                    className="text-[#61401E] text-xs font-bold underline hover:opacity-80 cursor-pointer"
                  >
                    Copiar código Pix Copia e Cola
                  </button>
                </div>
              ) : (
                /* CARD INTERFACE */
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-xs font-bold text-[#61401E] mb-1.5 uppercase">Número do Cartão</label>
                    <input
                      type="text"
                      required
                      placeholder="0000 0000 0000 0000"
                      maxLength={19}
                      value={cardData.number}
                      onChange={(e) => {
                        let val = e.target.value.replace(/[^0-9]/g, '');
                        val = val.match(/.{1,4}/g)?.join(' ') || val;
                        setCardData((prev) => ({ ...prev, number: val }));
                      }}
                      className="block w-full px-3.5 py-2.5 border border-[#d4c7b5]/40 rounded-xl text-sm focus:outline-none focus:border-[#61401E] font-mono bg-[#FFFFF9]/40"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#61401E] mb-1.5 uppercase">Nome do Titular (como no cartão)</label>
                    <input
                      type="text"
                      required
                      placeholder="EX: MARIA S SILVA"
                      value={cardData.holder}
                      onChange={(e) => setCardData((prev) => ({ ...prev, holder: e.target.value.toUpperCase() }))}
                      className="block w-full px-3.5 py-2.5 border border-[#d4c7b5]/40 rounded-xl text-sm focus:outline-none focus:border-[#61401E] bg-[#FFFFF9]/40"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#61401E] mb-1.5 uppercase">Validade</label>
                      <input
                        type="text"
                        required
                        placeholder="MM/AA"
                        maxLength={5}
                        value={cardData.expiry}
                        onChange={(e) => {
                          let val = e.target.value.replace(/[^0-9]/g, '');
                          if (val.length > 2) {
                            val = `${val.slice(0, 2)}/${val.slice(2, 4)}`;
                          }
                          setCardData((prev) => ({ ...prev, expiry: val }));
                        }}
                        className="block w-full px-3.5 py-2.5 border border-[#d4c7b5]/40 rounded-xl text-sm focus:outline-none focus:border-[#61401E] text-center font-mono bg-[#FFFFF9]/40"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#61401E] mb-1.5 uppercase">Código CVV</label>
                      <input
                        type="password"
                        required
                        placeholder="000"
                        maxLength={3}
                        value={cardData.cvv}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9]/g, '');
                          setCardData((prev) => ({ ...prev, cvv: val }));
                        }}
                        className="block w-full px-3.5 py-2.5 border border-[#d4c7b5]/40 rounded-xl text-sm focus:outline-none focus:border-[#61401E] text-center font-mono bg-[#FFFFF9]/40"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4 border-t border-[#d4c7b5]/20">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 btn-secondary py-3.5 flex items-center justify-center gap-2 cursor-pointer font-bold"
                >
                  <ArrowLeft size={18} />
                  Voltar
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-2 btn-primary py-3.5 flex items-center justify-center gap-2 cursor-pointer font-bold disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Confirmando...
                    </>
                  ) : (
                    <>
                      Confirmar Pagamento e Cadastrar
                      <CheckCircle2 size={18} />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

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
        <span>Todos os seus dados estão seguros e criptografados sob as diretrizes da LGPD</span>
      </footer>
    </main>
  );
}
