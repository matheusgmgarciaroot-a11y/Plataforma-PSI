'use client';

import React, { useEffect } from 'react';
import { 
  Users, 
  Calendar, 
  LayoutDashboard, 
  Mic, 
  Wallet, 
  Settings, 
  LogOut,
  Search,
  Bell,
  UserCheck
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
}

const SidebarItem = ({ icon: Icon, label, active }: SidebarItemProps) => (
  <div className={active ? 'sidebar-item-active' : 'sidebar-item cursor-pointer'}>
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </div>
);

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, token, logout, initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  // Route protection
  useEffect(() => {
    // If we've completed initialization and no token is present, redirect to login
    const savedToken = localStorage.getItem('mindora_token');
    if (!savedToken) {
      router.push('/login');
    }
  }, [token, router]);

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    logout();
    router.push('/login');
  };

  const isAdmin = user?.role === 'admin';
  const userName = user?.name || 'Carregando...';
  const userRoleText = isAdmin ? 'Administrador Master' : 'Psicóloga Clínica';

  return (
    <div className="flex min-h-screen bg-[#FFFFF9]">
      {/* Sidebar */}
      <aside className="w-72 border-r border-[#d4c7b5]/30 p-6 flex flex-col gap-8 bg-white/50">
        <div className="flex items-center gap-3 px-4 mb-4">
          <div className="w-10 h-10 bg-[#61401E] rounded-xl flex items-center justify-center shadow-lg">
            <div className="w-5 h-5 bg-[#FFFFF9] rounded-full opacity-80" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-[#61401E]">Mindora</span>
        </div>

        <nav className="flex-1 flex flex-col gap-2">
          {isAdmin ? (
            /* Admin Master Navigation */
            <>
              <Link href="/dashboard/admin">
                <SidebarItem 
                  icon={LayoutDashboard} 
                  label="Painel Admin" 
                  active={pathname === '/dashboard/admin'} 
                />
              </Link>
              <Link href="/dashboard/admin">
                <SidebarItem 
                  icon={Users} 
                  label="Gerenciar Psicólogos" 
                  active={pathname?.startsWith('/dashboard/admin')} 
                />
              </Link>
            </>
          ) : (
            /* Professional Navigation */
            <>
              <Link href="/dashboard">
                <SidebarItem 
                  icon={LayoutDashboard} 
                  label="Painel Clínico" 
                  active={pathname === '/dashboard'} 
                />
              </Link>
              <SidebarItem icon={Users} label="Pacientes" />
              <SidebarItem icon={Mic} label="Sessões" />
              <SidebarItem icon={Calendar} label="Prontuários" />
              <SidebarItem icon={Calendar} label="Agenda" />
              <SidebarItem icon={Wallet} label="Financeiro" />
            </>
          )}

          <div className="mt-auto flex flex-col gap-2 pt-8 border-t border-[#d4c7b5]/20">
            <SidebarItem icon={Settings} label="Configurações" />
            <button onClick={handleLogout} className="w-full text-left focus:outline-none">
              <SidebarItem icon={LogOut} label="Sair" />
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-20 border-b border-[#d4c7b5]/20 px-8 flex items-center justify-between bg-white/30 backdrop-blur-sm sticky top-0 z-20">
          <div className="relative w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8c7661]" size={18} />
            <input 
              type="text" 
              placeholder={isAdmin ? "Pesquisar profissionais..." : "Pesquisar pacientes, sessões..."}
              className="w-full bg-[#e6dfd3]/30 border-none rounded-2xl py-2.5 pl-12 pr-4 focus:ring-2 focus:ring-[#61401E]/20 text-[#61401E] placeholder:text-[#8c7661]/60"
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2.5 rounded-xl hover:bg-[#e6dfd3]/50 text-[#61401E] transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[#FFFFF9]" />
            </button>
            <div className="h-10 w-px bg-[#d4c7b5]/30 mx-2" />
            <div className="flex items-center gap-3 pl-2 cursor-pointer group">
              <div className="text-right">
                <p className="text-sm font-bold text-[#61401E]">{userName}</p>
                <p className="text-xs text-[#8c7661]">{userRoleText}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#61401E]/10 border border-[#61401E]/20 flex items-center justify-center text-[#61401E] font-bold overflow-hidden group-hover:border-[#61401E] transition-colors">
                {userName[0]?.toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-10 flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
