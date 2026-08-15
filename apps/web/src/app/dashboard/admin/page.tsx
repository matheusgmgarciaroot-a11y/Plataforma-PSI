'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/Dashboard/Layout';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { 
  Users, 
  UserCheck, 
  Trash2, 
  Key, 
  UserMinus, 
  Loader2, 
  Check, 
  X, 
  Mail,
  ShieldAlert,
  CreditCard
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';

interface Professional {
  id: string;
  name: string;
  email: string;
  crp: string | null;
  specialty: string | null;
  role: string;
  status: string;
  gender: string | null;
  birthDate: string | null;
  phone: string | null;
  consultationPrice: number | null;
  nextPaymentDate: string | null;
  createdAt: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, token, initialize } = useAuthStore();
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'active'>('pending');
  const [error, setError] = useState<string | null>(null);
  const [refetchKey, setRefetchKey] = useState(0);

  // Modal states
  const [isCredentialsModalOpen, setIsCredentialsModalOpen] = useState(false);
  const [selectedProf, setSelectedProf] = useState<Professional | null>(null);

  // Form states
  const [credForm, setCredForm] = useState({
    name: '',
    email: '',
    password: '',
    crp: '',
    phone: '',
    consultationPrice: '',
    nextPaymentDate: '',
  });

  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (!token) return;
    axios.get(`${API_URL}/professionals`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        setProfessionals(response.data);
        setIsLoading(false);
      })
      .catch((err: unknown) => {
        console.error(err);
        setError('Erro ao carregar os dados dos psicólogos.');
        setIsLoading(false);
      });
  }, [token, refetchKey]);

  // Protect Admin route
  useEffect(() => {
    const savedUserStr = localStorage.getItem('mindora_user');
    if (savedUserStr) {
      const savedUser = JSON.parse(savedUserStr);
      if (savedUser.role !== 'admin') {
        router.push('/dashboard');
      }
    }
  }, [user, router]);

  const handleApprove = async (prof: Professional) => {
    if (!confirm(`Tem certeza de que deseja aprovar o cadastro e liberar o acesso para ${prof.name}?`)) {
      return;
    }
    try {
      await axios.patch(
        `${API_URL}/professionals/${prof.id}/status`,
        { status: 'active' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Move status to active directly in UI
      setProfessionals((prev) =>
        prev.map((p) => (p.id === prof.id ? { ...p, status: 'active' } : p))
      );
    } catch (err) {
      console.error(err);
      alert('Erro ao aprovar o cadastro do profissional.');
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'active' ? 'suspended' : 'active';
    const confirmMessage = currentStatus === 'active'
      ? 'Deseja suspender as atividades deste profissional por pendência financeira?'
      : 'Deseja reativar o acesso deste profissional e registrar pagamento em dia?';

    if (!confirm(confirmMessage)) return;

    try {
      await axios.patch(
        `${API_URL}/professionals/${id}/status`,
        { status: nextStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProfessionals((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: nextStatus } : p))
      );
    } catch (err) {
      console.error(err);
      alert('Erro ao atualizar o status do profissional.');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Tem certeza de que deseja excluir permanentemente o cadastro de ${name}?`)) {
      return;
    }
    try {
      await axios.delete(`${API_URL}/professionals/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfessionals((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
      alert('Erro ao excluir o profissional.');
    }
  };

  const handleCredSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProf) return;
    setModalLoading(true);
    setModalError(null);

    // Validate CRP (4 to 6 digits)
    if (credForm.crp.length < 4 || credForm.crp.length > 6) {
      setModalError('O CRP deve conter exatamente de 4 a 6 dígitos numéricos.');
      setModalLoading(false);
      return;
    }

    try {
      // Update details/password
      await axios.patch(
        `${API_URL}/professionals/${selectedProf.id}/credentials`,
        {
          name: credForm.name,
          email: credForm.email,
          crp: credForm.crp,
          phone: credForm.phone,
          consultationPrice: credForm.consultationPrice ? parseFloat(credForm.consultationPrice) : null,
          nextPaymentDate: credForm.nextPaymentDate || undefined,
          password: credForm.password || undefined, // Send password only if filled
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setRefetchKey((prev) => prev + 1);
      setIsCredentialsModalOpen(false);
      setSelectedProf(null);
    } catch (err: unknown) {
      console.error(err);
      const errorResponse = err as { response?: { data?: { message?: string } } };
      if (errorResponse.response?.data?.message) {
        setModalError(errorResponse.response.data.message);
      } else {
        setModalError('Erro ao salvar as credenciais.');
      }
    } finally {
      setModalLoading(false);
    }
  };

  const pendingList = professionals.filter((p) => p.status === 'pending');
  // Include both active and suspended professionals in the actives tab (exclude admin master)
  const activeList = professionals.filter((p) => (p.status === 'active' || p.status === 'suspended') && p.role !== 'admin');

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Painel de Administração</h1>
            <p className="text-[#8c7661]">Gerencie os psicólogos credenciados e solicitações de contratação do Mindora.</p>
          </div>
          
          <div className="flex items-center gap-4 bg-white border border-[#d4c7b5]/30 rounded-2xl p-4 shadow-[0_4px_20px_rgb(97,64,30,0.02)] text-sm">
            <CreditCard className="text-[#61401E]" size={20} />
            <div>
              <p className="font-bold text-[#61401E]">Assinatura Mindora</p>
              <p className="text-[#8c7661] text-xs">Valor único de R$ 25,00/mês</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r-lg">
            {error}
          </div>
        )}

        {/* Tabs Control */}
        <div className="flex bg-[#e6dfd3]/20 p-1.5 rounded-xl gap-2 w-fit">
          <button
            onClick={() => setActiveTab('pending')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${
              activeTab === 'pending'
                ? 'bg-[#61401E] text-[#FFFFF9] shadow-md'
                : 'text-[#8c7661] hover:bg-[#e6dfd3]/40'
            }`}
          >
            <UserCheck size={16} />
            Solicitações Pendentes ({pendingList.length})
          </button>
          <button
            onClick={() => setActiveTab('active')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${
              activeTab === 'active'
                ? 'bg-[#61401E] text-[#FFFFF9] shadow-md'
                : 'text-[#8c7661] hover:bg-[#e6dfd3]/40'
            }`}
          >
            <Users size={16} />
            Psicólogos Ativos ({activeList.length})
          </button>
        </div>

        {/* Content Table Area */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 size={36} className="animate-spin text-[#61401E]" />
            <p className="text-[#8c7661]">Buscando dados da base...</p>
          </div>
        ) : (
          <div className="bg-white border border-[#d4c7b5]/30 rounded-2xl shadow-sm overflow-hidden">
            {activeTab === 'pending' ? (
              /* PENDING PROFS TABLE */
              pendingList.length === 0 ? (
                <div className="p-16 text-center text-[#8c7661]">
                  Nenhuma solicitação de contratação pendente no momento.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#FFFFF9] border-b border-[#d4c7b5]/20 text-[#61401E] text-xs font-bold uppercase tracking-wider">
                        <th className="p-5">Nome</th>
                        <th className="p-5">E-mail</th>
                        <th className="p-5">CRP</th>
                        <th className="p-5">Telefone</th>
                        <th className="p-5">Preço Consulta</th>
                        <th className="p-5 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#d4c7b5]/10 text-sm text-[#61401E]">
                      {pendingList.map((prof) => (
                        <tr key={prof.id} className="hover:bg-[#FFFFF9]/40 transition-colors">
                          <td className="p-5 font-bold">{prof.name}</td>
                          <td className="p-5 text-[#8c7661]">{prof.email}</td>
                          <td className="p-5 font-mono">{prof.crp || '-'}</td>
                          <td className="p-5 text-[#8c7661]">{prof.phone || '-'}</td>
                          <td className="p-5 font-medium">
                            {prof.consultationPrice ? `R$ ${prof.consultationPrice.toFixed(2)}` : '-'}
                          </td>
                          <td className="p-5 text-right flex items-center justify-end gap-3">
                            <button
                              onClick={() => handleApprove(prof)}
                              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                              title="Aprovar e Liberar Acesso"
                            >
                              <Check size={14} />
                              Liberar Acesso
                            </button>
                            <button
                              onClick={() => handleDelete(prof.id, prof.name)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Recusar Cadastro"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            ) : (
              /* ACTIVE PROFS TABLE */
              activeList.length === 0 ? (
                <div className="p-16 text-center text-[#8c7661]">
                  Nenhum psicólogo ativo cadastrado no sistema.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#FFFFF9] border-b border-[#d4c7b5]/20 text-[#61401E] text-xs font-bold uppercase tracking-wider">
                        <th className="p-5">Nome</th>
                        <th className="p-5">E-mail</th>
                        <th className="p-5">CRP</th>
                        <th className="p-5">Telefone</th>
                        <th className="p-5">Mensalidade (R$ 25)</th>
                        <th className="p-5 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#d4c7b5]/10 text-sm text-[#61401E]">
                      {activeList.map((prof) => (
                        <tr key={prof.id} className="hover:bg-[#FFFFF9]/40 transition-colors">
                          <td className="p-5 font-bold">{prof.name}</td>
                          <td className="p-5 text-[#8c7661]">{prof.email}</td>
                          <td className="p-5 font-mono">{prof.crp || '-'}</td>
                          <td className="p-5 text-[#8c7661]">{prof.phone || '-'}</td>
                          <td className="p-5">
                            <div className="flex flex-col gap-1">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-bold w-fit ${
                                prof.status === 'active' 
                                  ? 'bg-green-100 text-green-700' 
                                  : 'bg-red-100 text-red-700'
                              }`}>
                                {prof.status === 'active' ? 'Ativo' : 'Pendente / Atrasado'}
                              </span>
                              {prof.nextPaymentDate && (
                                <span className="text-xs text-[#8c7661]">
                                  Vence em: {new Date(prof.nextPaymentDate).toLocaleDateString('pt-BR')}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="p-5 text-right flex items-center justify-end gap-2.5">
                            
                            {/* Toggle Payment Status */}
                            <button
                              onClick={() => handleToggleStatus(prof.id, prof.status)}
                              className={`px-3 py-2 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer border ${
                                prof.status === 'active'
                                  ? 'border-yellow-600/40 text-yellow-700 hover:bg-yellow-50'
                                  : 'border-green-600/40 text-green-700 hover:bg-green-50'
                              }`}
                              title={prof.status === 'active' ? 'Suspender Acesso (Inadimplência)' : 'Confirmar Pagamento e Reativar'}
                            >
                              {prof.status === 'active' ? (
                                <>
                                  <UserMinus size={13} />
                                  Suspender
                                </>
                              ) : (
                                <>
                                  <Check size={13} />
                                  Liberar/Pago
                                </>
                              )}
                            </button>

                            {/* View / Edit Details */}
                            <button
                              onClick={() => {
                                setSelectedProf(prof);
                                setCredForm({
                                  name: prof.name,
                                  email: prof.email,
                                  password: '',
                                  crp: prof.crp || '',
                                  phone: prof.phone || '',
                                  consultationPrice: prof.consultationPrice?.toString() || '',
                                  nextPaymentDate: prof.nextPaymentDate ? prof.nextPaymentDate.split('T')[0] : '',
                                });
                                setIsCredentialsModalOpen(true);
                              }}
                              className="px-3 py-2 bg-[#e6dfd3] hover:bg-[#d4c7b5] text-[#61401E] rounded-lg font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-transparent"
                              title="Visualizar / Editar Dados"
                            >
                              <Key size={13} />
                              Editar
                            </button>

                            {/* Permanent Delete */}
                            <button
                              onClick={() => handleDelete(prof.id, prof.name)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Excluir Psicólogo"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            )}
          </div>
        )}
      </div>

      {/* ================= MODAL: EDIT DATA / RESET PASSWORD ================= */}
      {isCredentialsModalOpen && selectedProf && (
        <div className="fixed inset-0 z-50 bg-[#61401E]/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#d4c7b5]/30 rounded-2xl w-full max-w-lg shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-6 border-b border-[#d4c7b5]/20 flex items-center justify-between bg-[#FFFFF9]">
              <h2 className="text-xl font-bold flex items-center gap-2 text-[#61401E]">
                <Key className="text-[#61401E]" size={20} />
                Visualizar / Editar Cadastro
              </h2>
              <button 
                onClick={() => {
                  setIsCredentialsModalOpen(false);
                  setSelectedProf(null);
                }}
                className="p-1 hover:bg-[#e6dfd3]/50 rounded-lg text-[#8c7661] hover:text-[#61401E] transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {modalError && (
              <div className="mx-6 mt-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r-lg">
                {modalError}
              </div>
            )}

            <form onSubmit={handleCredSubmit} className="p-6 space-y-4">
              
              <div>
                <label className="block text-xs font-bold text-[#61401E] mb-1.5 uppercase">Nome Completo</label>
                <input
                  type="text"
                  required
                  value={credForm.name}
                  onChange={(e) => setCredForm((prev) => ({ ...prev, name: e.target.value }))}
                  className="block w-full px-3.5 py-2.5 border border-[#d4c7b5]/40 rounded-xl text-sm focus:outline-none focus:border-[#61401E] bg-[#FFFFF9]/40"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#61401E] mb-1.5 uppercase">E-mail</label>
                <input
                  type="email"
                  required
                  value={credForm.email}
                  onChange={(e) => setCredForm((prev) => ({ ...prev, email: e.target.value }))}
                  className="block w-full px-3.5 py-2.5 border border-[#d4c7b5]/40 rounded-xl text-sm focus:outline-none focus:border-[#61401E] bg-[#FFFFF9]/40"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#61401E] mb-1.5 uppercase">CRP (Apenas Números)</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={credForm.crp}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, '');
                    setCredForm((prev) => ({ ...prev, crp: val }));
                  }}
                  className="block w-full px-3.5 py-2.5 border border-[#d4c7b5]/40 rounded-xl text-sm focus:outline-none focus:border-[#61401E] font-mono bg-[#FFFFF9]/40"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#61401E] mb-1.5 uppercase">Telefone</label>
                <input
                  type="text"
                  required
                  value={credForm.phone}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, '');
                    setCredForm((prev) => ({ ...prev, phone: val }));
                  }}
                  className="block w-full px-3.5 py-2.5 border border-[#d4c7b5]/40 rounded-xl text-sm focus:outline-none focus:border-[#61401E] bg-[#FFFFF9]/40"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#61401E] mb-1.5 uppercase">Valor Médio Consulta (R$)</label>
                <input
                  type="text"
                  required
                  value={credForm.consultationPrice}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9.,]/g, '').replace(',', '.');
                    setCredForm((prev) => ({ ...prev, consultationPrice: val }));
                  }}
                  className="block w-full px-3.5 py-2.5 border border-[#d4c7b5]/40 rounded-xl text-sm focus:outline-none focus:border-[#61401E] bg-[#FFFFF9]/40"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#61401E] mb-1.5 uppercase">Vencimento da Assinatura (Admin)</label>
                <input
                  type="date"
                  value={credForm.nextPaymentDate}
                  onChange={(e) => setCredForm((prev) => ({ ...prev, nextPaymentDate: e.target.value }))}
                  className="block w-full px-3.5 py-2.5 border border-[#d4c7b5]/40 rounded-xl text-sm focus:outline-none focus:border-[#61401E] bg-[#FFFFF9]/40"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#61401E] mb-1.5 uppercase">Definir Nova Senha (opcional)</label>
                <input
                  type="password"
                  placeholder="Deixe em branco para manter a senha atual do cliente"
                  value={credForm.password}
                  onChange={(e) => setCredForm((prev) => ({ ...prev, password: e.target.value }))}
                  className="block w-full px-3.5 py-2.5 border border-[#d4c7b5]/40 rounded-xl text-sm focus:outline-none focus:border-[#61401E] bg-[#FFFFF9]/40"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#d4c7b5]/20">
                <button
                  type="button"
                  onClick={() => {
                    setIsCredentialsModalOpen(false);
                    setSelectedProf(null);
                  }}
                  className="px-5 py-2.5 border border-[#d4c7b5]/40 text-[#61401E] font-bold rounded-xl text-sm hover:bg-[#e6dfd3]/20 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={modalLoading}
                  className="px-6 py-2.5 btn-primary text-sm flex items-center gap-2 cursor-pointer font-bold disabled:opacity-50"
                >
                  {modalLoading ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
