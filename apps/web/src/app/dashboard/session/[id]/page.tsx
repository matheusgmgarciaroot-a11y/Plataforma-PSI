'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, CheckCircle, ArrowLeft, Mic, Sparkles, AlertCircle, FileText, User, Clock, TrendingUp } from 'lucide-react';
import Link from 'next/link';

// Simulação de pacientes - em produção viria da API
const patients = {
  '1': { name: 'Matheus', age: 28, objective: 'Ansiedade Generalizada' },
  '2': { name: 'Ana Julia', age: 34, objective: 'Transição de Carreira' },
  '3': { name: 'Aline', age: 42, objective: 'Conflitos Familiares' },
  '4': { name: 'Renato', age: 31, objective: 'Autoestima' },
};

export default function SessionPage({ params }: { params: { id: string } }) {
  const patient = patients[params.id as keyof typeof patients] || { name: 'Paciente', objective: 'Não definido' };
  
  interface AiResult {
    identification: string;
    dateTime: string;
    professional: string;
    objective: string;
    evolution: string;
    procedures: string;
    referrals: string;
    observations: string;
    status: string;
  }

  const [notes, setNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiResult, setAiResult] = useState<null | AiResult>(null);
  const [step, setStep] = useState<'editor' | 'review'>('editor');
  const [isSaved, setIsSaved] = useState(false);

  // Simular auto-save
  useEffect(() => {
    if (notes.length > 0) {
      const timer = setTimeout(() => setIsSaved(true), 1500);
      return () => {
        clearTimeout(timer);
        setIsSaved(false);
      };
    }
  }, [notes]);

  const handleFinishSession = () => {
    setIsProcessing(true);
    
    // Simulação de processamento de IA
    setTimeout(() => {
      setAiResult({
        identification: `Paciente ${patient.name}, ${patient.age} anos.`,
        dateTime: new Date().toLocaleString('pt-BR'),
        professional: 'Dra. Heloisa Valentim',
        objective: patient.objective,
        evolution: notes.length > 20 
          ? `O paciente apresentou ${notes.substring(0, 50)}... Durante a sessão, observou-se uma melhora no padrão de fala e clareza sobre os gatilhos discutidos.`
          : 'Conteúdo insuficiente para análise detalhada.',
        procedures: 'Terapia Cognitivo-Comportamental (TCC), Questionamento Socrático.',
        referrals: 'Nenhum no momento.',
        observations: 'Paciente demonstrou resistência inicial ao falar sobre o tema X, mas progrediu ao longo da sessão.',
        status: 'Revisado'
      });
      setIsProcessing(false);
      setStep('review');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#FFFFF9] text-[#61401E]">
      {/* Header da Sessão */}
      <header className="h-20 border-b border-[#d4c7b5]/30 bg-white/50 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="p-2 hover:bg-[#e6dfd3] rounded-full transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div className="h-10 w-px bg-[#d4c7b5]/30" />
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-[#61401E] flex items-center justify-center text-white font-bold">
               {patient.name[0]}
             </div>
             <div>
               <p className="font-bold leading-none">{patient.name}</p>
               <p className="text-xs text-[#8c7661] mt-1">Sessão em andamento</p>
             </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs text-[#8c7661] flex items-center gap-1.5">
            <Clock size={14} />
            {isSaved ? 'Rascunho salvo' : 'Digitando...'}
          </span>
          {step === 'editor' && (
            <button 
              onClick={handleFinishSession}
              disabled={notes.length < 10 || isProcessing}
              className="btn-primary py-2.5 flex items-center gap-2 disabled:opacity-50"
            >
              <CheckCircle size={18} />
              Finalizar Sessão
            </button>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto py-12 px-6">
        <AnimatePresence mode="wait">
          {step === 'editor' ? (
            <motion.div 
              key="editor"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <FileText className="text-[#8c7661]" />
                  Anotações da Sessão
                </h2>
                <div className="flex items-center gap-2 text-sm text-[#8c7661] bg-[#e6dfd3]/30 px-4 py-2 rounded-xl">
                  <Sparkles size={16} className="text-orange-400" />
                  IA Mindora pronta para organizar
                </div>
              </div>

              <div className="relative">
                <textarea 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Comece a digitar suas anotações clínicas aqui... A Mindora irá organizar tudo no final."
                  className="w-full min-h-[500px] p-8 rounded-[2rem] bg-white border border-[#d4c7b5]/30 shadow-sm focus:ring-2 focus:ring-[#61401E]/20 focus:border-[#61401E]/40 outline-none text-lg leading-relaxed placeholder:text-[#d4c7b5]"
                />
                <button className="absolute bottom-6 right-6 p-4 rounded-full bg-[#61401E] text-white shadow-xl hover:scale-105 transition-transform">
                  <Mic size={24} />
                </button>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-2xl bg-orange-50 border border-orange-100 text-orange-800 text-sm">
                <AlertCircle size={18} />
                Lembre-se: Suas anotações são rascunhos. A versão final do prontuário será gerada pela IA e precisará da sua validação manual.
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="review"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8 pb-20"
            >
              <div className="text-center space-y-2 mb-12">
                <div className="inline-flex items-center gap-2 text-orange-600 font-bold bg-orange-50 px-4 py-1.5 rounded-full text-sm mb-4">
                  <Sparkles size={16} />
                  Revisão Sugerida pela IA
                </div>
                <h2 className="text-3xl font-bold">Validar Prontuário Psicológico</h2>
                <p className="text-[#8c7661]">Confirme se as informações estão fiéis e adicione observações se necessário.</p>
              </div>

              <div className="card-premium space-y-8 bg-white shadow-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-[#d4c7b5]/20 pb-8">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#8c7661] mb-2 block">Identificação</label>
                    <p className="font-medium">{aiResult?.identification}</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#8c7661] mb-2 block">Data e Horário</label>
                    <p className="font-medium">{aiResult?.dateTime}</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#8c7661] mb-2 block">Responsável</label>
                    <p className="font-medium">{aiResult?.professional}</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#8c7661] mb-2 block">Demanda</label>
                    <p className="font-medium">{aiResult?.objective}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <section>
                    <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                       <TrendingUp size={18} className="text-[#8c7661]" />
                       Evolução do Caso
                    </h4>
                    <p className="text-[#61401E] leading-relaxed bg-[#FFFFF9] p-6 rounded-2xl border border-[#d4c7b5]/20">
                      {aiResult?.evolution}
                    </p>
                  </section>

                  <section>
                    <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                       <CheckCircle size={18} className="text-[#8c7661]" />
                       Procedimentos Adotados
                    </h4>
                    <p className="text-[#61401E] leading-relaxed">{aiResult?.procedures}</p>
                  </section>

                  <section>
                    <h4 className="font-bold text-lg mb-3 flex items-center gap-2 text-red-700">
                       <AlertCircle size={18} />
                       Observações Relevantes
                    </h4>
                    <textarea 
                      defaultValue={aiResult?.observations}
                      className="w-full p-4 rounded-xl border border-red-100 bg-red-50/30 text-sm focus:ring-1 focus:ring-red-200 outline-none"
                    />
                  </section>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4">
                <button 
                  onClick={() => setStep('editor')}
                  className="btn-secondary px-8 py-4"
                >
                  Voltar ao Editor
                </button>
                <button 
                  className="btn-primary px-12 py-4 flex items-center gap-2 shadow-2xl shadow-[#61401E]/20"
                  onClick={() => alert('Prontuário salvo e finalizado com sucesso!')}
                >
                  <Save size={20} />
                  Confirmar e Salvar Prontuário
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Overlay de Processamento */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-[#FFFFF9]/90 backdrop-blur-md flex flex-col items-center justify-center"
          >
            <div className="relative w-24 h-24 mb-8">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-4 border-[#e6dfd3] border-t-[#61401E] rounded-full"
              />
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Sparkles size={32} className="text-[#61401E]" />
              </motion.div>
            </div>
            <h3 className="text-2xl font-bold mb-2">IA Mindora trabalhando...</h3>
            <p className="text-[#8c7661]">Organizando suas anotações e corrigindo gramática.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
