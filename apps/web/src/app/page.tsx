import Hero from '@/components/Landing/Hero';
import Features from '@/components/Landing/Features';
import { Shield } from 'lucide-react';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#FFFFF9]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#FFFFF9]/80 backdrop-blur-md border-b border-[#d4c7b5]/20">
        <nav className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#61401E] rounded-xl flex items-center justify-center shadow-lg">
              <div className="w-5 h-5 bg-[#FFFFF9] rounded-full opacity-80" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-[#61401E]">Mindora</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-[#8c7661] font-medium">
            <a href="#inicio" className="hover:text-[#61401E] transition-colors">Início</a>
            <a href="#Funcionalidades" className="hover:text-[#61401E] transition-colors">Funcionalidades</a>
            <a href="#Depoimentos" className="hover:text-[#61401E] transition-colors">Depoimentos</a>
            <a href="#Planos" className="hover:text-[#61401E] transition-colors">Planos</a>
          </div>

          <a href="/dashboard" className="btn-primary py-2 px-6">
            Entrar
          </a>
        </nav>
      </header>

      <Hero />
      
      <Features />

      {/* Social Proof */}
      <section className="py-20 bg-[#61401E] text-[#FFFFF9]">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div>
              <div className="text-5xl font-bold mb-2">1M+</div>
              <p className="opacity-70">Prontuários criados</p>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">300k</div>
              <p className="opacity-70">Horas economizadas</p>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">82%</div>
              <p className="opacity-70">De adesão às atividades</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-24 bg-[#e6dfd3]/30" id="Planos">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto card-premium p-12">
            <h2 className="text-4xl font-bold mb-6 text-[#61401E]">Teste grátis por 15 dias.</h2>
            <p className="text-xl text-[#8c7661] mb-10">
              Sem cartão de crédito, sem burocracia. Agenda, SmartNotes e Financeiro liberados.
            </p>
            <button className="btn-primary text-xl px-12 py-5">
              Começar agora
            </button>
            <div className="mt-8 flex items-center justify-center gap-2 text-sm text-[#8c7661]">
              <Shield size={16} />
              <span>Dados protegidos com criptografia militar</span>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 bg-[#FFFFF9] border-t border-[#d4c7b5]/20">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-[#8c7661]">© 2025 Mindora. Todos os direitos reservados.</div>
          <div className="flex gap-6">
            <a href="#" className="text-[#8c7661] hover:text-[#61401E]">Privacidade</a>
            <a href="#" className="text-[#8c7661] hover:text-[#61401E]">Termos</a>
            <a href="#" className="text-[#8c7661] hover:text-[#61401E]">Suporte</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
