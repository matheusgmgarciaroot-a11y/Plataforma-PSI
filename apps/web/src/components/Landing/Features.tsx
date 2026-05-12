'use client';

import { motion } from 'framer-motion';
import { Mic, Calendar, MessageSquare, Wallet, CheckCircle2 } from 'lucide-react';

const features = [
  {
    title: 'Smart Notes',
    description: 'Grave, transcreva e resuma sua sessão em 3 cliques.',
    icon: Mic,
    color: 'bg-purple-100 text-purple-600',
  },
  {
    title: 'Evolução em 1 clique',
    description: 'Fichas de evolução compiladas em prontuário com IA.',
    icon: CheckCircle2,
    color: 'bg-blue-100 text-blue-600',
  },
  {
    title: 'Calendário Integrado',
    description: 'Sincronização bidirecional com Google Calendar.',
    icon: Calendar,
    color: 'bg-pink-100 text-pink-600',
  },
  {
    title: 'Lembretes via Whatsapp',
    description: 'Reduza faltas com confirmações automáticas.',
    icon: MessageSquare,
    color: 'bg-green-100 text-green-600',
  },
];

export default function Features() {
  return (
    <section className="py-24 bg-[#FFFFF9]" id="Funcionalidades">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-[#61401E]">Pensado para o profissional.</h2>
          <p className="text-xl text-[#8c7661]">Descubra como ganhar mais tempo para você e seus pacientes.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="p-8 rounded-[2rem] bg-white border border-[#d4c7b5]/30 hover:shadow-2xl transition-all group"
            >
              <div className={`w-12 h-12 rounded-2xl ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <feature.icon size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#61401E]">{feature.title}</h3>
              <p className="text-[#8c7661] leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
