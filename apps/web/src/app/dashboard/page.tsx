'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/Dashboard/Layout';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Calendar, TrendingUp, Clock, Mic, FileText, Wallet, Settings, Play } from 'lucide-react';
import Link from 'next/link';

const patientsData = [
  { id: '1', name: 'Matheus', lastSession: 'Há 2 dias', status: 'Ativo', color: 'bg-pink-200' },
  { id: '2', name: 'Ana Julia', lastSession: 'Hoje, 09:00', status: 'Ativo', color: 'bg-blue-200' },
  { id: '3', name: 'Aline', lastSession: 'Ontem', status: 'Ativo', color: 'bg-yellow-200' },
  { id: '4', name: 'Renato', lastSession: 'Há 1 semana', status: 'Pendente', color: 'bg-green-200' },
];

export default function PainelClinicoPage() {
  const [activeTab, setActiveTab] = useState('Pacientes');

  const tabs = [
    { name: 'Pacientes', icon: Users },
    { name: 'Sessões', icon: Mic },
    { name: 'Prontuários', icon: FileText },
    { name: 'Agenda', icon: Calendar },
    { name: 'Financeiro', icon: Wallet },
    { name: 'Configurações', icon: Settings },
  ];

  return (
    <DashboardLayout>
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Painel Clínico</h1>
            <p className="text-[#8c7661]">Bem-vinda de volta, Dra. Heloisa.</p>
          </div>
          
          {/* Tabs Navigation */}
          <div className="flex bg-[#e6dfd3]/30 p-1.5 rounded-2xl gap-1 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                  activeTab === tab.name 
                    ? 'bg-[#61401E] text-[#FFFFF9] shadow-md' 
                    : 'text-[#8c7661] hover:bg-[#e6dfd3]/50'
                }`}
              >
                <tab.icon size={16} />
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'Pacientes' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="card-premium md:col-span-2">
                    <div className="flex items-center justify-between mb-8">
                      <h2 className="text-xl font-bold">Seus Pacientes</h2>
                      <button className="btn-primary text-sm py-2 px-4">+ Novo Paciente</button>
                    </div>

                    <div className="space-y-4">
                      {patientsData.map((patient) => (
                        <div key={patient.id} className="flex items-center justify-between p-5 rounded-2xl border border-[#d4c7b5]/20 bg-white hover:border-[#61401E]/30 transition-all group">
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-full ${patient.color} flex items-center justify-center font-bold text-[#61401E]/60`}>
                              {patient.name[0]}
                            </div>
                            <div>
                              <p className="font-bold text-[#61401E]">{patient.name}</p>
                              <p className="text-xs text-[#8c7661]">Última sessão: {patient.lastSession}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${patient.status === 'Ativo' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                              {patient.status}
                            </span>
                            <div className="h-8 w-px bg-[#d4c7b5]/20 mx-1" />
                            <Link 
                              href={`/dashboard/patient/${patient.id}/prontuario`}
                              className="p-2.5 rounded-xl text-[#8c7661] hover:bg-[#e6dfd3]/50 transition-all"
                              title="Ver Prontuário"
                            >
                              <FileText size={18} />
                            </Link>
                            <Link 
                              href={`/dashboard/session/${patient.id}`}
                              className="flex items-center gap-2 bg-[#61401E] text-[#FFFFF9] px-4 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition-all"
                            >
                              <Play size={14} className="fill-current" />
                              Iniciar sessão
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-6">
                    <div className="card-premium bg-[#61401E] text-[#FFFFF9] border-none shadow-xl">
                      <h3 className="font-bold mb-4 flex items-center gap-2">
                        <TrendingUp size={18} className="text-orange-300" />
                        Status da Clínica
                      </h3>
                      <div className="space-y-4 text-sm opacity-90">
                        <div className="flex justify-between">
                          <span>Pacientes Ativos</span>
                          <span className="font-bold">38</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Sessões este mês</span>
                          <span className="font-bold">124</span>
                        </div>
                        <div className="h-px bg-white/10 my-2" />
                        <div className="flex justify-between text-orange-200">
                          <span>Pendente Revisão</span>
                          <span className="font-bold">5 Prontuários</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab !== 'Pacientes' && (
              <div className="card-premium flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 rounded-full bg-[#e6dfd3]/30 flex items-center justify-center mb-6">
                   <Settings className="text-[#8c7661]" size={32} />
                </div>
                <h2 className="text-2xl font-bold mb-2">Módulo {activeTab}</h2>
                <p className="text-[#8c7661] max-w-sm">Estamos preparando as funcionalidades desta aba. Em breve você poderá gerenciar {activeTab.toLowerCase()} por aqui.</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </DashboardLayout>
  );
}
