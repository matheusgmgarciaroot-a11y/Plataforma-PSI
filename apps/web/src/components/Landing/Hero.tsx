'use client';

import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative min-height-[90vh] flex items-center justify-center pt-32 pb-20 overflow-hidden hero-gradient">
      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Quando o acolhimento desenha cada detalhe da experiência.
          </h1>
          <p className="text-xl md:text-2xl text-[#8c7661] mb-10 max-w-2xl mx-auto">
            Leve ao olhar, intuitiva e fluida, a Mindora é o sopro de inspiração que encaixa na sua rotina.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <Link href="/contratar" className="btn-primary text-lg px-8 py-4 w-full md:w-auto text-center inline-block">
              Experimente agora
            </Link>
            <button className="btn-secondary flex items-center gap-2 text-lg px-8 py-4 w-full md:w-auto justify-center">
              <Play className="fill-current" size={20} />
              Veja em ação
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-20 relative max-w-6xl mx-auto rounded-3xl overflow-hidden shadow-2xl"
        >
          <div className="aspect-video bg-[#443853] flex items-center justify-center">
             {/* Placeholder para o vídeo real */}
             <p className="text-[#61401E]/50">Video Demonstrativo - Mindora</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
