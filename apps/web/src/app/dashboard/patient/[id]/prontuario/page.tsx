'use client';

import React from 'react';
import DashboardLayout from '@/components/Dashboard/Layout';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Calendar, FileText, Download, Share2, History, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const patients = {
  '1': { name: 'Matheus', age: 28, objective: 'Ansiedade Generalizada', entry: '15/03/2025' },
  '2': { name: 'Ana Julia', age: 34, objective: 'Transição de Carreira', entry: '20/01/2025' },
  '3': { name: 'Aline', age: 42, objective: 'Conflitos Familiares', entry: '05/02/2025' },
  '4': { name: 'Renato', age: 31, objective: 'Autoestima', entry: '12/04/2025' },
};

const history = [
  { id: 1, date: '11/05/2026', time: '14:30', status: 'Finalizado', summary: 'Paciente relatou melhora significativa nos sintomas de ansiedade após introdução de técnicas de respiração.' },
  { id: 2, date: '04/05/2026', time: '15:00', status: 'Finalizado', summary: 'Sessão focada na identificação de pensamentos automáticos durante situações de estresse no trabalho.' },
  { id: 3, date: '27/04/2026', time: '14:30', status: 'Finalizado', summary: 'Discussão sobre a relação com a família e estabelecimento de limites saudáveis.' },
];

export default function ProntuarioPage({ params }: { params: { id: string } }) {
  const patient = patients[params.id as keyof typeof patients] || patients['1'];

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumbs / Header */}
        <div className="mb-10 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="p-2 hover:bg-[#e6dfd3] rounded-full transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-3xl font-bold mb-1">Prontuário Individual</h1>
              <p className="text-[#8c7661]">Histórico clínico e evolução de {patient.name}</p>
            </div>
          </div>
          <div className="flex gap-3">
             <button className="btn-secondary py-2.5 flex items-center gap-2">
               <Download size={18} /> Exportar PDF
             </button>
             <button className="btn-primary py-2.5 flex items-center gap-2">
               <Share2 size={18} /> Encaminhamento
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Ficha de Identificação */}
          <div className="space-y-6">
            <div className="card-premium">
              <div className="flex flex-col items-center text-center mb-8">
                <div className="w-24 h-24 rounded-full bg-[#61401E] text-[#FFFFF9] flex items-center justify-center text-4xl font-bold mb-4 shadow-xl">
                  {patient.name[0]}
                </div>
                <h2 className="text-2xl font-bold">{patient.name}</h2>
                <p className="text-[#8c7661]">{patient.age} anos • {patient.objective}</p>
              </div>

              <div className="space-y-4 pt-6 border-t border-[#d4c7b5]/20">
                <div className="flex justify-between text-sm">
                  <span className="text-[#8c7661]">Responsável</span>
                  <span className="font-bold">Dra. Heloisa Valentim</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#8c7661]">Início do Acompanhamento</span>
                  <span className="font-bold">{patient.entry}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#8c7661]">Sessões Realizadas</span>
                  <span className="font-bold">14 sessões</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#8c7661]">Status</span>
                  <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-bold text-[10px] uppercase">Em alta gradual</span>
                </div>
              </div>
            </div>

            <div className="card-premium bg-[#61401E] text-[#FFFFF9] border-none">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <FileText size={18} className="text-orange-300" />
                Demanda Inicial
              </h3>
              <p className="text-sm opacity-80 leading-relaxed">
                Paciente buscou atendimento por sintomas persistentes de ansiedade, dificuldade de concentração e irritabilidade no ambiente de trabalho.
              </p>
            </div>
          </div>

          {/* Linha do Tempo de Evolução */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-3 mb-6">
              <History className="text-[#8c7661]" />
              Evolução Cronológica
            </h3>

            <div className="relative space-y-8 before:absolute before:left-6 before:top-2 before:bottom-2 before:w-px before:bg-[#d4c7b5]/30">
              {history.map((session) => (
                <div key={session.id} className="relative pl-14 group">
                  <div className="absolute left-4 top-1.5 w-4 h-4 rounded-full bg-[#61401E] border-4 border-[#FFFFF9] shadow-sm z-10 group-hover:scale-125 transition-transform" />
                  
                  <div className="card-premium hover:border-[#61401E]/30 transition-all cursor-pointer">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4 text-sm font-bold">
                        <span className="text-[#61401E]">{session.date}</span>
                        <span className="text-[#8c7661]">{session.time}</span>
                        <span className="px-2 py-0.5 rounded-md bg-[#e6dfd3] text-[#61401E] text-[10px] uppercase tracking-wider">{session.status}</span>
                      </div>
                      <ChevronRight size={18} className="text-[#d4c7b5] group-hover:text-[#61401E] transition-colors" />
                    </div>
                    <p className="text-[#61401E]/80 text-sm leading-relaxed line-clamp-2">
                      {session.summary}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
