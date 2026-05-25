'use client';

import React, { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '@/components/Dashboard/Layout';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { 
  Users, 
  UserCheck, 
  UserPlus, 
  Trash2, 
  Key, 
  UserMinus, 
  Loader2, 
  Check, 
  X, 
  Plus, 
  DollarSign, 
  Phone, 
  BookOpen, 
  UserX,
  Mail,
  ShieldAlert
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
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCredentialsModalOpen, setIsCredentialsModalOpen] = useState(false);
  const [selectedProf, setSelectedProf] = useState<Professional | null>(null);

  // Form states
  const [addForm, setAddForm] = useState({
    name: '',
    email: '',
    password: '',
    crp: '',
    gender: 'Masculino',
    birthDate: '',
    phone: '',
    consultationPrice: '',
  });

  const [credForm, setCredForm] = useState({
    name: '',
    email: '',
    password: '',
    crp: '',
    phone: '',
    consultationPrice: '',
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
    // Open credentials modal to set a password for the approved user, OR set status directly
    setSelectedProf(prof);
    setCredForm({
      name: prof.name,
      email: prof.email,
      password: '',
      crp: prof.crp || '',
      phone: prof.phone || '',
      consultationPrice: prof.consultationPrice?.toString() || '',
    });
    setIsCredentialsModalOpen(true);
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'active' ? 'suspended' : 'active';
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

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalLoading(true);
    setModalError(null);

    // Validate CRP (4 to 6 digits)
    if (addForm.crp.length < 4 || addForm.crp.length > 6) {
      setModalError('O CRP deve conter exatamente de 4 a 6 dígitos numéricos.');
      setModalLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/professionals/manual`,
        addForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Refresh list
      setRefetchKey((prev) => prev + 1);
      setIsAddModalOpen(false);
      // Reset form
      setAddForm({
        name: '',
        email: '',
        password: '',
        crp: '',
        gender: 'Masculino',
        birthDate: '',
        phone: '',
        consultationPrice: '',
      });
    } catch (err: unknown) {
      console.error(err);
      const errorResponse = err as { response?: { data?: { message?: string } } };
      if (errorResponse.response?.data?.message) {
        setModalError(errorResponse.response.data.message);
      } else {
        setModalError('Erro ao criar o profissional. Verifique os dados.');
      }
    } finally {
      setModalLoading(false);
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
      // 1. Update details/password
      await axios.patch(
        `${API_URL}/professionals/${selectedProf.id}/credentials`,
        {
          name: credForm.name,
          email: credForm.email,
          crp: credForm.crp,
          phone: credForm.phone,
          consultationPrice: credForm.consultationPrice ? parseFloat(credForm.consultationPrice) : null,
          password: credForm.password || undefined, // Send password only if filled
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 2. If it was pending, approve it (change status to active)
      if (selectedProf.status === 'pending') {
        await axios.patch(
          `${API_URL}/professionals/${selectedProf.id}/status`,
          { status: 'active' },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

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
  // Include both active and suspended professionals in the actives tab
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
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="btn-primary py-3 px-6 flex items-center justify-center gap-2 cursor-pointer rounded-xl font-bold shadow-lg"
          >
            <UserPlus size={18} />
            Cadastrar Psicólogo
          </button>
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
                        <th className="p-5">Valor Consulta</th>
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
                              Aprovar
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
                        <th className="p-5">Status</th>
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
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                              prof.status === 'active' 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {prof.status === 'active' ? 'Ativo' : 'Suspenso'}
                            </span>
                          </td>
                          <td className="p-5 text-right flex items-center justify-end gap-2.5">
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
                                });
                                setIsCredentialsModalOpen(true);
                              }}
                              className="px-3 py-2 bg-[#e6dfd3] hover:bg-[#d4c7b5] text-[#61401E] rounded-lg font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                              title="Editar Credenciais/Dados"
                            >
                              <Key size={13} />
                              Dados/Senha
                            </button>
                            <button
                              onClick={() => handleToggleStatus(prof.id, prof.status)}
                              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                                prof.status === 'active'
                                  ? 'text-yellow-600 hover:bg-yellow-50'
                                  : 'text-green-600 hover:bg-green-50'
                              }`}
                              title={prof.status === 'active' ? 'Suspender Acesso' : 'Reativar Acesso'}
                            >
                              {prof.status === 'active' ? <UserMinus size={16} /> : <UserCheck size={16} />}
                            </button>
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

      {/* ================= MODAL: ADD PROFESSIONAL MANUAL ================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#61401E]/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#d4c7b5]/30 rounded-2xl w-full max-w-2xl shadow-xl overflow-hidden">
            <div className="p-6 border-b border-[#d4c7b5]/20 flex items-center justify-between bg-[#FFFFF9]">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <UserPlus className="text-[#61401E]" size={20} />
                Cadastrar Novo Psicólogo
              </h2>
              <button 
                onClick={() => setIsAddModalOpen(false)}
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

            <form onSubmit={handleAddSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label className="block text-xs font-bold text-[#61401E] mb-1.5 uppercase">Nome Completo</label>
                  <input
                    type="text"
                    required
                    value={addForm.name}
                    onChange={(e) => setAddForm((prev) => ({ ...prev, name: e.target.value }))}
                    className="block w-full px-3.5 py-2.5 border border-[#d4c7b5]/40 rounded-xl text-sm focus:outline-none focus:border-[#61401E]"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-bold text-[#61401E] mb-1.5 uppercase">E-mail</label>
                  <input
                    type="email"
                    required
                    value={addForm.email}
                    onChange={(e) => setAddForm((prev) => ({ ...prev, email: e.target.value }))}
                    className="block w-full px-3.5 py-2.5 border border-[#d4c7b5]/40 rounded-xl text-sm focus:outline-none focus:border-[#61401E]"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-bold text-[#61401E] mb-1.5 uppercase">Definir Senha Inicial</label>
                  <input
                    type="password"
                    required
                    value={addForm.password}
                    onChange={(e) => setAddForm((prev) => ({ ...prev, password: e.target.value }))}
                    className="block w-full px-3.5 py-2.5 border border-[#d4c7b5]/40 rounded-xl text-sm focus:outline-none focus:border-[#61401E]"
                  />
                </div>

                {/* CRP */}
                <div>
                  <label className="block text-xs font-bold text-[#61401E] mb-1.5 uppercase">CRP (Apenas Números)</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={addForm.crp}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      setAddForm((prev) => ({ ...prev, crp: val }));
                    }}
                    className="block w-full px-3.5 py-2.5 border border-[#d4c7b5]/40 rounded-xl text-sm focus:outline-none focus:border-[#61401E] font-mono"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-xs font-bold text-[#61401E] mb-1.5 uppercase">Gênero</label>
                  <select
                    value={addForm.gender}
                    onChange={(e) => setAddForm((prev) => ({ ...prev, gender: e.target.value }))}
                    className="block w-full px-3.5 py-2.5 border border-[#d4c7b5]/40 rounded-xl text-sm focus:outline-none focus:border-[#61401E]"
                  >
                    <option value="Masculino">Masculino</option>
                    <option value="Feminino">Feminino</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>

                {/* Birth Date */}
                <div>
                  <label className="block text-xs font-bold text-[#61401E] mb-1.5 uppercase">Data de Nascimento</label>
                  <input
                    type="date"
                    required
                    value={addForm.birthDate}
                    onChange={(e) => setAddForm((prev) => ({ ...prev, birthDate: e.target.value }))}
                    className="block w-full px-3.5 py-2.5 border border-[#d4c7b5]/40 rounded-xl text-sm focus:outline-none focus:border-[#61401E]"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-bold text-[#61401E] mb-1.5 uppercase">Telefone</label>
                  <input
                    type="text"
                    required
                    value={addForm.phone}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      setAddForm((prev) => ({ ...prev, phone: val }));
                    }}
                    className="block w-full px-3.5 py-2.5 border border-[#d4c7b5]/40 rounded-xl text-sm focus:outline-none focus:border-[#61401E]"
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block text-xs font-bold text-[#61401E] mb-1.5 uppercase">Valor da Consulta (R$)</label>
                  <input
                    type="text"
                    required
                    value={addForm.consultationPrice}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9.,]/g, '').replace(',', '.');
                      setAddForm((prev) => ({ ...prev, consultationPrice: val }));
                    }}
                    className="block w-full px-3.5 py-2.5 border border-[#d4c7b5]/40 rounded-xl text-sm focus:outline-none focus:border-[#61401E]"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#d4c7b5]/20">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2.5 border border-[#d4c7b5]/40 text-[#61401E] font-bold rounded-xl text-sm hover:bg-[#e6dfd3]/20 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={modalLoading}
                  className="px-6 py-2.5 btn-primary text-sm flex items-center gap-2 cursor-pointer font-bold disabled:opacity-50"
                >
                  {modalLoading ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />}
                  Salvar Cadastro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: EDIT CREDENTIALS / APPROVAL ================= */}
      {isCredentialsModalOpen && selectedProf && (
        <div className="fixed inset-0 z-50 bg-[#61401E]/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#d4c7b5]/30 rounded-2xl w-full max-w-lg shadow-xl overflow-hidden">
            <div className="p-6 border-b border-[#d4c7b5]/20 flex items-center justify-between bg-[#FFFFF9]">
              <h2 className="text-xl font-bold flex items-center gap-2 text-[#61401E]">
                <Key className="text-[#61401E]" size={20} />
                {selectedProf.status === 'pending' ? 'Liberar Acesso & Credenciais' : 'Alterar Cadastro / Senha'}
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
              {selectedProf.status === 'pending' && (
                <div className="p-4 bg-blue-50 border border-blue-200 text-blue-800 rounded-xl text-xs space-y-1">
                  <p className="font-bold flex items-center gap-1">
                    <ShieldAlert size={14} />
                    Status: Solicitação Pendente
                  </p>
                  <p>Defina a senha inicial e valide os dados do profissional para concluir a aprovação.</p>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#61401E] mb-1.5 uppercase">Nome Completo</label>
                <input
                  type="text"
                  required
                  value={credForm.name}
                  onChange={(e) => setCredForm((prev) => ({ ...prev, name: e.target.value }))}
                  className="block w-full px-3.5 py-2.5 border border-[#d4c7b5]/40 rounded-xl text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#61401E] mb-1.5 uppercase">E-mail</label>
                <input
                  type="email"
                  required
                  value={credForm.email}
                  onChange={(e) => setCredForm((prev) => ({ ...prev, email: e.target.value }))}
                  className="block w-full px-3.5 py-2.5 border border-[#d4c7b5]/40 rounded-xl text-sm focus:outline-none"
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
                  className="block w-full px-3.5 py-2.5 border border-[#d4c7b5]/40 rounded-xl text-sm focus:outline-none font-mono"
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
                  className="block w-full px-3.5 py-2.5 border border-[#d4c7b5]/40 rounded-xl text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#61401E] mb-1.5 uppercase">Valor da Consulta (R$)</label>
                <input
                  type="text"
                  required
                  value={credForm.consultationPrice}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9.,]/g, '').replace(',', '.');
                    setCredForm((prev) => ({ ...prev, consultationPrice: val }));
                  }}
                  className="block w-full px-3.5 py-2.5 border border-[#d4c7b5]/40 rounded-xl text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#61401E] mb-1.5 uppercase">
                  {selectedProf.status === 'pending' ? 'Definir Senha Inicial' : 'Redefinir Senha (opcional)'}
                </label>
                <input
                  type="password"
                  placeholder={selectedProf.status === 'pending' ? 'Senha obrigatória' : 'Deixe em branco para manter a atual'}
                  required={selectedProf.status === 'pending'}
                  value={credForm.password}
                  onChange={(e) => setCredForm((prev) => ({ ...prev, password: e.target.value }))}
                  className="block w-full px-3.5 py-2.5 border border-[#d4c7b5]/40 rounded-xl text-sm focus:outline-none"
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
                  {selectedProf.status === 'pending' ? 'Aprovar & Ativar' : 'Salvar Alterações'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
